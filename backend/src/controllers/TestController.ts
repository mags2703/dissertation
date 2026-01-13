import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';
import fs from 'fs/promises';
import path from 'path';
import { exec, execSync } from 'child_process';
import { Parser } from 'xml2js';

const retrieveCoverage = async (
  parser: Parser,
  srcPath: string,
  reportPath: string
) => {
  execSync(
    `java -jar lib/jacococli.jar report jacoco.exec --classfiles ${srcPath}/Solution.class --sourcefiles . --xml ${reportPath}/coverage.xml`,
    { cwd: config.testPath }
  );

  const coverageXml = await fs.readFile(
    path.join(config.testPath, 'reports', 'coverage.xml'),
    { encoding: 'utf8' }
  );

  const coverageJson = await new Promise((resolve, reject) => {
    parser.parseString(coverageXml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  console.log(coverageJson);
  let counters = {};
  // @ts-ignore
  for (const counter of coverageJson.report.counter) {
    const name = counter.type[0].toLowerCase();
    const covered = parseFloat(counter.covered[0]);
    const missed = parseFloat(counter.missed[0]);
    // @ts-ignore
    counters[name] = covered / (covered + missed);
  }

  return counters;
};

const retrieveTestDetails = async (
  parser: Parser,
  srcPath: string,
  reportPath: string
) => {
  await new Promise((resolve, _reject) => {
    exec(
      `java -javaagent:lib/jacocoagent.jar=destfile=jacoco.exec -jar lib/junit.jar --class-path ${srcPath} --scan-class-path --reports-dir ${reportPath}`,
      { cwd: config.testPath, encoding: 'utf8' },
      (err, stdout, stderr) => {
        resolve({ err, stdout, stderr });
      }
    );
  });

  const testXml = await fs.readFile(
    path.join(config.testPath, reportPath, 'TEST-junit-jupiter.xml'),
    { encoding: 'utf8' }
  );

  const output = await new Promise((resolve, reject) => {
    parser.parseString(testXml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });

  // @ts-ignore
  const tests = output.testsuite.testcase.map((test) => {
    const passed = test.failure == null ? true : false;
    return {
      name: test.name[0],
      passed,
    };
  });

  return tests;
};

export const runTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parser = new Parser({ mergeAttrs: true, explicitArray: true });
  try {
    await fs.writeFile(
      path.join(config.testPath, 'src', 'Solution.java'),
      config.solutionCode!
    );

    await fs.writeFile(
      path.join(config.testPath, 'src', 'SolutionTest.java'),
      config.testCode!
    );

    await fs.writeFile(
      path.join(
        config.testPath,
        'solutions',
        config.activeProblem.toString(),
        'SolutionTest.java'
      ),
      config.testCode!
    );

    execSync('javac -cp lib/junit.jar src/*.java', { cwd: config.testPath });
    execSync(
      `javac -cp lib/junit.jar solutions/${config.activeProblem}/*.java`,
      { cwd: config.testPath }
    );

    const userTests = await retrieveTestDetails(parser, 'src', 'reports');
    const userCoverage = await retrieveCoverage(parser, 'src', 'reports');

    const providedPath = path.join(
      'solutions',
      config.activeProblem.toString()
    );

    const providedTests = await retrieveTestDetails(
      parser,
      providedPath,
      path.join(providedPath, 'reports')
    );
    const providedCoverage = await retrieveTestDetails(
      parser,
      providedPath,
      path.join(providedPath, 'reports')
    );

    console.log(userTests);
    res.json({
      user: { tests: userTests, coverage: userCoverage },
      provided: { tests: providedTests, coverage: providedCoverage },
    });
  } catch (error) {
    next(error);
  }
};

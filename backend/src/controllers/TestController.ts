import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';
import fs from 'fs/promises';
import path from 'path';
import { exec, execSync } from 'child_process';
import { Parser } from 'xml2js';
import { inputOutputMapper } from '../services/InputOutputMapper.js';

const retrieveCoverage = async (
  parser: Parser,
  classPath: string,
  fileName: string,
) => {
  execSync(
    `java -jar lib/jacococli.jar report ${fileName}.exec --classfiles ${classPath}/Solution.class --sourcefiles . --xml reports/${fileName}/coverage.xml`,
    { cwd: config.testPath },
  );

  const coverageXml = await fs.readFile(
    path.join(config.testPath, 'reports', fileName, 'coverage.xml'),
    { encoding: 'utf8' },
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
  classPath: string,
  fileName: string,
) => {
  await new Promise((resolve, _reject) => {
    exec(
      `java -javaagent:lib/jacocoagent.jar=destfile=${fileName}.exec -jar lib/junit.jar --class-path ${classPath} --select-class SolutionTest --reports-dir reports/${fileName}`,
      { cwd: config.testPath, encoding: 'utf8' },
      (err, stdout, stderr) => {
        resolve({ err, stdout, stderr });
      },
    );
  });

  const testXml = await fs.readFile(
    path.join(config.testPath, 'reports', fileName, 'TEST-junit-jupiter.xml'),
    { encoding: 'utf8' },
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

const getResults = async (
  parser: Parser,
  solutionFolder: string,
  testFolder: string,
) => {
  const solutionLabel = solutionFolder === 'user' ? 'userS' : 'instructorS';
  const testLabel = testFolder === 'user' ? 'userT' : 'instructorT';

  const tests = await retrieveTestDetails(
    parser,
    `lib:solutions/${solutionFolder}:tests/${testFolder}`,
    `${solutionLabel}_${testLabel}`,
  );
  const coverage = await retrieveCoverage(
    parser,
    `solutions/${solutionFolder}`,
    `${solutionLabel}_${testLabel}`,
  );
  return { tests, coverage };
};

export const runTest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const parser = new Parser({ mergeAttrs: true, explicitArray: true });
  const solutionsFolder = path.join(config.testPath, 'solutions');
  const testsFolder = path.join(config.testPath, 'tests');

  try {
    await fs.writeFile(
      path.join(solutionsFolder, 'user', 'Solution.java'),
      config.solutionCode!,
    );

    await fs.writeFile(
      path.join(testsFolder, 'user', 'SolutionTest.java'),
      config.testCode!,
    );

    execSync(
      'javac -cp lib/junit.jar solutions/user/*.java tests/user/*.java',
      {
        cwd: config.testPath,
      },
    );
    execSync(
      `javac -cp lib/junit.jar solutions/${config.activeProblem}/*.java tests/${config.activeProblem}/*.java`,
      {
        cwd: config.testPath,
      },
    );

    const userUser =
      !config.solutionCode || !config.testCode
        ? {}
        : await getResults(parser, 'user', 'user');

    const instructorUser = !config.testCode
      ? {}
      : await getResults(parser, config.activeProblem.toString(), 'user');

    const userInstructor = !config.solutionCode
      ? {}
      : await getResults(parser, 'user', config.activeProblem.toString());

    const instructorInstructor = await getResults(
      parser,
      config.activeProblem.toString(),
      config.activeProblem.toString(),
    );

    res.json({
      userTestResults: {
        user: userUser,
        instructor: instructorUser,
      },
      instructorTestResults: {
        user: userInstructor,
        instructor: instructorInstructor,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMappings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const mapping = JSON.parse(await inputOutputMapper());
    res.json(mapping);
  } catch (error) {
    next(error);
  }
};

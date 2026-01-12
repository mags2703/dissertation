import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';
import fs from 'fs/promises';
import path from 'path';
import { exec, execSync } from 'child_process';
import { Parser } from 'xml2js';

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

    execSync('javac -cp lib/junit.jar src/*.java', { cwd: config.testPath });

    await new Promise((resolve, _reject) => {
      exec(
        'java -javaagent:lib/jacocoagent.jar=destfile=jacoco.exec -jar lib/junit.jar --class-path src --scan-class-path --reports-dir reports',
        { cwd: config.testPath, encoding: 'utf8' },
        (err, stdout, stderr) => {
          resolve({ err, stdout, stderr });
        }
      );
    });

    execSync(
      'java -jar lib/jacococli.jar report jacoco.exec --classfiles src/Solution.class --sourcefiles . --xml reports/coverage.xml',
      { cwd: config.testPath }
    );

    const testXml = await fs.readFile(
      path.join(config.testPath, 'reports', 'TEST-junit-jupiter.xml'),
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

    console.log(tests);
    res.json({ tests, counters });
  } catch (error) {
    next(error);
  }
};

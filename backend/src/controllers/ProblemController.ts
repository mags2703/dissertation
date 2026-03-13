import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';
import problems from '../config/problems.js';
import { solutionSystemPrompt, testSystemPrompt } from '../config/prompts.js';

export const getProblems = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({
      problems: problems.map((problem) => ({
        id: problem.id,
        title: problem.title,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getActiveProblem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.json({
      problem: problems.find((problem) => problem.id == config.activeProblem),
    });
  } catch (error) {
    next(error);
  }
};

export const changeActiveProblem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const problemID = req.body.problem;
    const problem = problems.find((problem) => problem.id == problemID);

    if (!problem) {
      throw Error(`Problem ID ${problemID} not found`);
    }

    config.activeProblem = problemID;

    config.solutionHistory = [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: solutionSystemPrompt(problem.header),
          },
        ],
      },
    ];

    config.testHistory = [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: testSystemPrompt(problem.header),
          },
        ],
      },
    ];

    config.solutionCode = '';
    config.testCode = '';
    res.json({
      problem,
    });
  } catch (error) {
    next(error);
  }
};

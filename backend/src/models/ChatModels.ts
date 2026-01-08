import type { Request, Response, NextFunction } from 'express';
import config from '../config/config';

export const message = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const prompt = req.body.prompt;
    config.solutionHistory.push({
      role: 'user',
      content: [
        {
          type: 'input_text',
          text: prompt,
        },
      ],
    });

    const apiResponse = await config.openAIClient.responses.create({
      model: 'gpt-4.1',
      input: config.solutionHistory,
    });

    // config.solutionHistory.push({
    //   role: 'assistant',
    //   content: [
    //     {
    //       type: 'output_text',
    //       text: apiResponse.output_text,
    //     },
    //   ],
    // });

    console.log(apiResponse.output_text);
  } catch (error) {
    next(error);
  }
};

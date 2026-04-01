import type { Request, Response, NextFunction } from 'express';
import config from '../config/config.js';

export const promptModel = async (
  req: Request,
  res: Response,
  next: NextFunction,
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

    // @ts-ignore
    config.solutionHistory.push({
      role: 'assistant',
      content: [
        {
          type: 'output_text',
          text: apiResponse.output_text,
        },
      ],
    });

    const splitResponse = apiResponse.output_text.split('\n');
    const firstIndex = splitResponse.findIndex((line) =>
      line.includes('<OUTPUT>'),
    );
    const lastIndex = splitResponse.findIndex((line) =>
      line.includes('</OUTPUT>'),
    );
    const fixedResponse = [
      ...splitResponse.slice(0, firstIndex),
      ...splitResponse.slice(lastIndex + 1),
    ].join('\n');

    const code = splitResponse.slice(firstIndex + 1, lastIndex).join('\n');
    config.solutionCode = code;

    console.log(apiResponse.output_text);
    res.json({ output: fixedResponse });
  } catch (error) {
    next(error);
  }
};

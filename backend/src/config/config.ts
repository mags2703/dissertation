import OpenAI from 'openai';
import type { ResponseInput } from 'openai/resources/responses/responses.js';
import { solutionSystemPrompt, testSystemPrompt } from './prompts.js';

interface Config {
  port: number;
  testPath: string;
  answerCode?: string;
  testCode?: string;
  openAIClient: OpenAI;
  solutionHistory: ResponseInput;
  testHistory: ResponseInput;
}

const openAIClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const solutionHistory: ResponseInput = [
  {
    role: 'system',
    content: [
      {
        type: 'input_text',
        text: solutionSystemPrompt,
      },
    ],
  },
];

const testHistory: ResponseInput = [
  {
    role: 'system',
    content: [
      {
        type: 'input_text',
        text: testSystemPrompt,
      },
    ],
  },
];

const config: Config = {
  port: 3000,
  answerCode: '',
  testCode: '',
  testPath: process.env.TESTPATH!,
  openAIClient,
  solutionHistory,
  testHistory,
};

export default config;

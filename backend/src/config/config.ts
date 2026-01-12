import OpenAI from 'openai';
import type { ResponseInput } from 'openai/resources/responses/responses.js';
import { solutionSystemPrompt, testSystemPrompt } from './prompts.js';

interface Config {
  port: number;
  testPath: string;
  solutionCode?: string;
  testCode?: string;
  openAIClient: OpenAI;
  solutionHistory: ResponseInput;
  testHistory: ResponseInput;
  activeProblem: number;
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
  solutionCode: '',
  testCode: '',
  testPath: process.env.TESTPATH!,
  openAIClient,
  solutionHistory,
  testHistory,
  activeProblem: 0,
};

export default config;

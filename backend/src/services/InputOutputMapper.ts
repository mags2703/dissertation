import config from '../config/config.js';
import problems from '../config/problems.js';

const questionPrompt = (code: string) => {
  return `The following is a test class, that that tests the method ${problems[config.activeProblem]?.header}
  ${code}
  Return JSON in the form:
  {
    "test1": {
      "input": "(<inputs>)"
      "output": "<output>"
    }
  }
  where <inputs> is the comma separated list of inputs and <output> is the expected output
  
  example of test class:
  class SolutionTest {
    @Test
    void test1() {
        Solution solution = new Solution();
        assertEquals(0.6, solution.func(0.5, 0.1));
    }

    @Test
    void test2() {
        Solution solution = new Solution();
        assertEquals(2, solution.func(1, 1));
    }
  }
    
  example of resulting json:
  {
    "test1()": {
      "input": "(0.5, 0.1)"
      "output": "0.6"
    },
    "test2()": {
      "input": "(1, 1)"
      "output": "2"
    }
  }`;
};

export const inputOutputMapper = async () => {
  const code = config.testCode;
  if (!code || code === '') {
    return '{}';
  }

  const apiResponse = await config.openAIClient.responses.create({
    model: 'gpt-4.1',
    input: [
      {
        role: 'system',
        content: [
          {
            type: 'input_text',
            text: 'Only return the desired JSON, no additional text',
          },
        ],
      },
      {
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: questionPrompt(config.testCode!),
          },
        ],
      },
    ],
  });

  return apiResponse.output_text;
};

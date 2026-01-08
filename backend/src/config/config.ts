import OpenAI from 'openai';
import type { ResponseInput } from 'openai/resources/responses/responses.js';

interface Config {
  port: number;
  testPath: string;
  answerCode?: string;
  testCode?: string;
  openAIClient: OpenAI;
  solutionHistory: ResponseInput;
}

const answerCode = `public class Solution {
    public int add(int a, int b) {
        return a + b;
    }
}`;

const testCode = `import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.Test;

public class SolutionTest {

    @Test
    void test1() {
        Solution testClass = new Solution();
        assertEquals(5, testClass.func(2, 3));
    }

    @Test
    void test2() {
        Solution testClass = new Solution();
        assertEquals(5, testClass.func(2, 2));
    }
}`;

const solutionSystemPrompt = `You are to write code that goes inside func() in the following class:
\`\`\`java
public class Solution {
public double func(int a, int b){
}
}
\`\`\`
Do not add any extra code other than is asked by the user and nothing outside func().
Only add to the code unless specified not to.
Give a brief textual summary of the changes.
Return the output enclosed in <OUTPUT><OUTPUT>

Example:
Prompt 1: return a + b
Response 1:
<OUTPUT>
public class Solution {
public double func(int a, int b){
return a + b;
}
}
</OUTPUT>
The function now returns the result of a + b

Prompt 1 if a equals b return 0
Response 2:
<OUTPUT>
public class Solution {
public double func(int a, int b){
if (a == b)
return 0;
return a + b;
}
}
</OUTPUT>
The function now returns 0 if a equals b`;

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

const config: Config = {
  port: 3000,
  answerCode,
  testCode,
  testPath: process.env.TESTPATH!,
  openAIClient,
  solutionHistory,
};

export default config;

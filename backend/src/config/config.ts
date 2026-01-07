interface Config {
  port: number;
  testPath: string;
  answerCode?: string;
  testCode?: string;
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
        assertEquals(5, testClass.add(2, 3));
    }

    @Test
    void test2() {
        Solution testClass = new Solution();
        assertEquals(5, testClass.add(2, 2));
    }
}`;

const config: Config = {
  port: 3000,
  answerCode,
  testCode,
  testPath: process.env.TESTPATH!,
};

export default config;

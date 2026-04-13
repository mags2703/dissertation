# Vibe Testing: Encouraging Vibe Coders to Think About Correctness

## Repo Structure

The final fully functional prototype is contained within the 'main' branch. The modified version with disabled guardrails and modified evaluation scripts is contained within the 'eval' branch.

There are four folders containing differnent aspects of the project. The backend and frontend folders contain their respective components of the project. The test harness contains needed jar files in the 'lib' subfolder, apart from that, the other subfolders will be populuated during execution. The eval folder contains the 12 evaluation JSON scripts and the python script used to evaluate them.

## Running the project

It should be noted that all components of the project have been tested on macOS only. However, the only component that should not work on Windows is the test harness due to the use of terminal commands. The entire project should work on Linux but is untested.

The backend requires a .env file placed inside its folder. A template is provided

```bash
TESTPATH=
OPENAI_API_KEY=
```

TESTPATH is the location of the test harness folder. OPENAI_API_KEY is your OpenAI API key.

To run both the backend and frontend within their respective folders execute

```bash
npm install && npm run dev
```

Note that the backend must be run before the frontend due to port allocations

To run the evaluation scripts execute inside evaluation

```bash
pip install requests
python Main.py
```

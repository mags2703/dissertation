import json
import os
import requests

base_url = "http://localhost:3000/api/"
problem_url = "problem/active"
solution_url = "solution"
test_url = "test"
test_harness_url = "testharness"

def run_script(problem, file):
    with open(os.path.join(problem, file)) as f:
        script = json.load(f)

    data = None
    for req in script:
        url = base_url + req["url"]
        print("REQUEST:", req)
        if req["type"] == "POST":
            response = requests.post(url, json=req["body"])
        else:
            response = requests.get(url)
            data = response.json()

        print("RESPONSE:", response.json())
        print("")

    result = []

    for section in ['userTestResults', 'instructorTestResults']:
        for role in ['user', 'instructor']:
            tests = data[section][role]['tests']
            if tests is None:
                result.append("None", "None")
                continue
            coverage_dict = data[section][role]['coverage']

            passed = sum(test['passed'] for test in tests)
            total = len(tests)

            avg_coverage = (sum(coverage_dict.values()) / 5) * 100

            result.append((f"{passed}/{total}", f"{avg_coverage}%"))

    labels = ["User Tests on User Solution", "User Tests on Instructor Solution",
              "Instructor Tests on User Solution", "Instructor Tests on Instructor Solution"]

    for index, label in enumerate(labels):
        print(label, result[index])

if __name__ == "__main__":
    # run_script("0", "Good.json")
    run_script("3", "Good.json")


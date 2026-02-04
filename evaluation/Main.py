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

    for req in script:
        url = base_url + req["url"]
        print("REQUEST:", req)
        if req["type"] == "POST":
            response = requests.post(url, json=req["body"])
        else:
            response = requests.get(url)

        print("RESPONSE:", response.json())
        print("")
    print(requests.get(base_url + test_harness_url + "/mappings").json())


if __name__ == "__main__":
    # run_script("0", "Good.json")
    run_script("0", "Good.json")


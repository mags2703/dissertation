'use client';
import { ProblemSelector } from '@/components/problem-selector';
import { ProblemDescriptor } from '@/components/problem-descriptor';
import { TestCases } from '@/components/test-cases';
import { ChatInterface } from '@/components/chat-interface';
import { useEffect, useState } from 'react';
import axios from 'axios';

const problemDetails = {
  0: {
    id: 0,
    title: 'BMI Calculator',
    description:
      'Write a function that computes the BMI of a person. The BMI is computed by dividing the weight of a person (in kgs) by the square of the height of the person in meters. They are the parameters a and b respectively',
    params: 2,
    header: 'double func(double a, double b)',
  },
  1: {
    id: 1,
    title: 'Two Sum',
    description:
      'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
    params: 2,
    header: 'int[] twoSum(int[] nums, int target)',
  },
};

const mockInputOutput = {
  'test1()': { input: '(1, 1)', output: '1' },
  'test2()': { input: '(8, 2)', output: '2' },
  'test3()': { input: '(5, 3)', output: '1.67' },
  'advancedTest1()': { input: '(100, 50)', output: '2.0' },
  'advancedTest2()': { input: '(70, 35)', output: '2.0' },
};

const mockTestData = {
  userTestResults: {
    user: {},
    instructor: {},
  },
  instructorTestResults: {
    user: {},
    instructor: {},
  },
};

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState('0');
  const [testData, setTestData] = useState(mockTestData);
  const [selectedProblem, setSelectedProblem] = useState({});
  const handleRunTests = async () => {
    try {
      const data = await fetchTestData();
      console.log('TESTDATA');
      console.log(testData);
      return data;
    } catch (error) {
      console.error('[v0] Error running tests:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTestData();
    fetchProblems();
  }, []);

  useEffect(() => {
    fetchActiveProblem();
  }, [selectedProblemId]);

  const fetchTestData = async () => {
    const res = await axios.get('http://localhost:3000/api/testharness');
    setTestData(res.data);
    return res.data;
  };

  const fetchProblems = async () => {
    await axios
      .get('http://localhost:3000/api/problem')
      // @ts-ignore
      .then((data) => {
        setProblems(data.data.problems);
      });
  };

  const fetchActiveProblem = async () => {
    await axios.post('http://localhost:3000/api/problem/active', {
      problem: parseInt(selectedProblemId),
    });

    await axios.get('http://localhost:3000/api/problem/active').then((data) => {
      setSelectedProblem(data.data.problem);
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-1/2 flex flex-col border-r border-border overflow-hidden">
          {/* Problem Selector */}
          <ProblemSelector
            problems={problems}
            onProblemChange={setSelectedProblemId}
          />

          {/* Divider */}
          <div className="border-b border-border" />

          {/* Problem Descriptor */}
          <div className="flex-1 overflow-auto">
            <ProblemDescriptor problem={selectedProblem} />
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Test Cases */}
          <div className="flex-1 overflow-auto border-t border-border">
            <TestCases
              data={testData}
              inputOutput={mockInputOutput}
              onRunTests={handleRunTests}
            />
          </div>
        </div>

        {/* Right Panel - Chat */}
        <div className="w-1/2 flex flex-col bg-background-secondary overflow-hidden">
          <ChatInterface key={selectedProblemId} />
        </div>
      </div>
    </div>
  );
}

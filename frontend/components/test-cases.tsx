'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Check, X, Play } from 'lucide-react';

interface TestResult {
  name: string;
  passed: boolean;
}

interface CoverageMetrics {
  instruction: number;
  line: number;
  complexity: number;
  method: number;
  class: number;
}

interface SolutionResults {
  tests?: TestResult[];
  coverage?: CoverageMetrics;
}

interface TestResultsData {
  userTestResults: {
    user: SolutionResults;
    instructor: SolutionResults;
  };
  instructorTestResults: {
    user: SolutionResults;
    instructor: SolutionResults;
  };
}

interface TestCasesProps {
  data: TestResultsData;
  inputOutput?: Record<string, { input: string; output: string }>;
  onRunTests?: () => Promise<TestResultsData>;
}

const getCoveragePct = (coverage?: CoverageMetrics): number => {
  if (!coverage) return 0;
  const avg =
    (coverage.instruction +
      coverage.line +
      coverage.complexity +
      coverage.method +
      coverage.class) /
    5;
  return Math.round(avg * 100);
};

export function TestCases({
  data: initialData,
  inputOutput = {},
  onRunTests,
}: TestCasesProps) {
  const [data, setData] = useState<TestResultsData>(initialData);
  const [activeTab, setActiveTab] = useState<'overview' | 'cases'>('overview');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = async () => {
    if (!onRunTests) return;
    setIsRunning(true);
    try {
      const result = await onRunTests();
      setData(result);
    } catch (error) {
      console.error('[v0] Error running tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusColor = (passed: boolean | null) => {
    if (passed === true)
      return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (passed === false) return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
  };

  const getStatusIcon = (passed: boolean | null) => {
    if (passed === true) return <Check className="w-4 h-4 text-green-600" />;
    if (passed === false) return <X className="w-4 h-4 text-red-600" />;
    return null;
  };

  const userTestUserPassed =
    data.userTestResults.user.tests?.filter((t) => t.passed).length ?? 0;
  const userTestTotal = data.userTestResults.user.tests?.length ?? 0;
  const userTestInstructorPassed =
    data.userTestResults.instructor.tests?.filter((t) => t.passed).length ?? 0;

  const instructorTestUserPassed =
    data.instructorTestResults.user.tests?.filter((t) => t.passed).length ?? 0;
  const instructorTestTotal =
    data.instructorTestResults.instructor.tests?.length ?? 0;
  const instructorTestInstructorPassed =
    data.instructorTestResults.instructor.tests?.filter((t) => t.passed)
      .length ?? 0;

  const userCoverage = getCoveragePct(data.userTestResults.user.coverage);
  const userInstructorCoverage = getCoveragePct(
    data.userTestResults.instructor.coverage,
  );
  const instructorCoverage = getCoveragePct(
    data.instructorTestResults.user.coverage,
  );
  const instructorInstructorCoverage = getCoveragePct(
    data.instructorTestResults.instructor.coverage,
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-0 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'cases'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Test Cases
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'overview' ? (
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-4">
                  Test Results Overview
                </h3>

                {/* Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Headers */}
                  <div />
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-semibold text-foreground">
                      User Tests
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-sm font-semibold text-foreground">
                      Instructor Tests
                    </span>
                  </div>

                  {/* User Solution Row */}
                  <div className="flex items-center justify-start">
                    <span className="text-sm font-semibold text-foreground">
                      Your Solution
                    </span>
                  </div>
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Passed: {userTestUserPassed}/{userTestTotal}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coverage: {userCoverage}%
                      </p>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Passed: {instructorTestUserPassed}/{instructorTestTotal}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coverage: {instructorCoverage}%
                      </p>
                    </div>
                  </div>

                  {/* Instructor Solution Row */}
                  <div className="flex items-center justify-start">
                    <span className="text-sm font-semibold text-foreground">
                      Instructor Solution
                    </span>
                  </div>
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Passed: {userTestInstructorPassed}/{userTestTotal}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coverage: {userInstructorCoverage}%
                      </p>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Passed: {instructorTestInstructorPassed}/
                        {instructorTestTotal}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Coverage: {instructorInstructorCoverage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-foreground mb-3">
                Test Cases
              </h2>
            </div>

            <div className="space-y-2">
              {data.userTestResults.user.tests &&
              data.userTestResults.user.tests.length > 0 ? (
                data.userTestResults.user.tests.map((testCase, index) => {
                  const instructorResult =
                    data.userTestResults.instructor.tests?.[index];
                  return (
                    <div
                      key={`${index}`}
                      className="border border-border rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpand(String(index))}
                        className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                      >
                        {expandedId === String(index) ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}

                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground">
                              {testCase.name}
                            </span>
                            <div className="flex gap-2 ml-auto">
                              <Badge
                                className={`shrink-0 ${getStatusColor(testCase.passed)}`}
                                variant="outline"
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(testCase.passed)}
                                  <span className="text-xs">
                                    {testCase.passed
                                      ? 'Your: Pass'
                                      : 'Your: Fail'}
                                  </span>
                                </div>
                              </Badge>
                              <Badge
                                className={`shrink-0 ${getStatusColor(instructorResult?.passed ?? null)}`}
                                variant="outline"
                              >
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(
                                    instructorResult?.passed ?? null,
                                  )}
                                  <span className="text-xs">
                                    {instructorResult?.passed
                                      ? 'Instructor: Pass'
                                      : 'Instructor: Fail'}
                                  </span>
                                </div>
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                      {expandedId === String(index) &&
                        inputOutput[testCase.name] && (
                          <div className="border-t border-border bg-muted/20 p-3 space-y-2">
                            <div>
                              <p className="text-xs font-mono text-muted-foreground mb-1">
                                Input:
                              </p>
                              <p className="text-xs font-mono text-foreground bg-background px-2 py-1 rounded border border-border">
                                {inputOutput[testCase.name].input}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-mono text-muted-foreground mb-1">
                                Output:
                              </p>
                              <p className="text-xs font-mono text-foreground bg-background px-2 py-1 rounded border border-border">
                                {inputOutput[testCase.name].output}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <p className="text-sm">No test cases available</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Run Tests Button */}
      {onRunTests && (
        <div className="border-t border-border p-4">
          <Button
            onClick={handleRunTests}
            disabled={isRunning}
            size="lg"
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run Tests'}
          </Button>
        </div>
      )}
    </div>
  );
}

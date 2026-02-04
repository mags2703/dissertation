'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface Problem {
  id: number;
  title: string;
}

interface ProblemSelectorProps {
  problems: Problem[];
  onProblemChange?: (problemId: string) => void;
}

export function ProblemSelector({
  problems,
  onProblemChange,
}: ProblemSelectorProps) {
  const [selectedProblem, setSelectedProblem] = useState('0');
  // const currentProblem = problems.find(
  //   (p) => p.id === parseInt(selectedProblem),
  // );

  const handleProblemChange = (problemId: string) => {
    setSelectedProblem(problemId);
    onProblemChange?.(problemId);
  };

  return (
    <div className="p-4 bg-background">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <Select value={selectedProblem} onValueChange={handleProblemChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {problems.map((problem) => (
                <SelectItem key={problem.id} value={problem.id.toString()}>
                  <div className="flex items-center gap-2">
                    <span>{problem.title}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

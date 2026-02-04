'use client';

interface Problem {
  id: number;
  title: string;
  description: string;
  params: number;
  header: string;
}

interface ProblemDescriptorProps {
  problem?: Problem;
}

export function ProblemDescriptor({ problem }: ProblemDescriptorProps) {
  if (!problem) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p className="text-sm">No problem selected</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {problem.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Problem ID: {problem.id}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Description
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {problem.description}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Function Signature
        </h2>
        <div className="bg-muted/50 p-3 rounded border border-border">
          <p className="text-xs font-mono text-foreground">{problem.header}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Parameters
        </h2>
        <p className="text-sm text-muted-foreground">
          Number of parameters: {problem.params}
        </p>
      </div>
    </div>
  );
}

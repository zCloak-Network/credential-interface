import React from 'react';

export interface Report {
  (error: Error | null, loading?: boolean, message?: string): void;
}

export interface DidsStepProps {
  label: React.ReactNode;
  content?: React.ReactNode;
  paused?: boolean;
  optional?: React.ReactNode;
  exec: (report: Report) => Promise<any>;
}

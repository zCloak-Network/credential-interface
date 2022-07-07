export interface DidsStepProps {
  isFirst?: boolean;
  isLast?: boolean;
  step: number;
  execFunc: (step: number, func: () => void) => void;
  prevStep: () => void;
  nextStep: () => void;
  reportError: (error: Error | null) => void;
  reportStatus: (message?: string, loading?: boolean) => void;
}

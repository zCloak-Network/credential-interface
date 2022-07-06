export interface DidsStepProps {
  isFirst?: boolean;
  isLast?: boolean;
  prevStep: () => void;
  nextStep: () => void;
  reportError: (error: Error | null) => void;
  reportStatus: (message?: string, loading?: boolean) => void;
}

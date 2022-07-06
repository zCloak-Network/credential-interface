import {
  CircularProgress,
  Dialog,
  DialogContent,
  Step,
  StepContent,
  StepLabel,
  Stepper
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { DialogHeader } from '@credential/react-components';

const DidsModal: React.FC<{
  title: React.ReactNode;
  open: boolean;
  onDone?: () => void;
  onClose?: () => void;
  steps: (
    prevStep: () => void,
    nextStep: () => void,
    reportError: (error: Error | null) => void,
    reportStatus: (message?: string, loading?: boolean) => void
  ) => {
    label: React.ReactNode;
    optional?: React.ReactNode;
    content: React.ReactNode;
  }[];
}> = ({ onClose, onDone, open, steps, title }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<Record<number, Error | null | undefined>>({});
  const [status, setStatus] = useState<
    Record<number, { message?: string; loading?: boolean } | undefined>
  >({});

  const prevStep = useCallback(() => {
    setActiveStep((step) => Math.max(0, step - 1));
  }, []);

  const nextStep = useCallback(() => {
    setActiveStep(activeStep + 1);
  }, [activeStep]);

  const reportError = useCallback(
    (error: Error | null) => setError((_error) => ({ ..._error, [activeStep]: error })),
    [activeStep]
  );

  const reportStatus = useCallback(
    (message?: string, loading?: boolean) =>
      setStatus((_status) => ({ ..._status, [activeStep]: { message, loading } })),
    [activeStep]
  );

  const children = useMemo(
    () => steps(prevStep, nextStep, reportError, reportStatus),
    [nextStep, prevStep, reportError, reportStatus, steps]
  );

  useEffect(() => {
    if (activeStep >= children.length) {
      onDone?.();
    }
  }, [activeStep, onDone, children.length]);

  return (
    <Dialog maxWidth="sm" open={open}>
      <DialogHeader onClose={onClose}>{title}</DialogHeader>
      <DialogContent sx={{ minWidth: 325 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {children.map(({ content, label, optional }, index) => (
            <Step key={index}>
              <StepLabel
                error={!!error[index]}
                icon={
                  error[index] ? undefined : status[index]?.loading ? (
                    <CircularProgress size={24} />
                  ) : undefined
                }
                optional={
                  error[index]
                    ? error[index]?.message ?? optional
                    : status[index]
                    ? status[index]?.message ?? optional
                    : optional
                }
              >
                {label}
              </StepLabel>
              <StepContent>{content}</StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DidsModal);

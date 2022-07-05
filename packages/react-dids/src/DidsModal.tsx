import { Dialog, DialogContent, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

import { DialogHeader } from '@credential/react-components';

const DidsModal: React.FC<{
  title: React.ReactNode;
  open: boolean;
  onDone?: () => void;
  onClose?: () => void;
  steps: (
    prevStep: () => void,
    nextStep: () => void,
    reportError: (error: Error | null) => void
  ) => {
    label: React.ReactNode;
    optional?: React.ReactNode;
    content: React.ReactNode;
  }[];
}> = ({ onClose, onDone, open, steps, title }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<Record<number, Error | null | undefined>>({});

  const prevStep = useCallback(() => {
    setActiveStep((step) => Math.max(0, step - 1));
  }, []);

  const nextStep = useCallback(() => {
    if (activeStep >= steps.length - 1) {
      onDone?.();
    } else {
      setActiveStep(activeStep + 1);
    }
  }, [activeStep, onDone, steps.length]);

  const reportError = useCallback(
    (error: Error | null) => setError((_error) => ({ ..._error, [activeStep]: error })),
    [activeStep]
  );

  const children = useMemo(
    () => steps(prevStep, nextStep, reportError),
    [nextStep, prevStep, reportError, steps]
  );

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>{title}</DialogHeader>
      <DialogContent>
        <Stepper activeStep={activeStep} orientation="vertical">
          {children.map(({ content, label, optional }, index) => (
            <Step key={index}>
              <StepLabel
                error={!!error[index]}
                optional={error[index] ? error[index]?.message ?? optional : optional}
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

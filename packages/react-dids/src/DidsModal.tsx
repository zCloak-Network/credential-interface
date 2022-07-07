import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  Paper,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography
} from '@mui/material';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { DialogHeader } from '@credential/react-components';

const DidsModal: React.FC<{
  title: React.ReactNode;
  open: boolean;
  autoExec?: boolean;
  onDone?: () => void;
  onClose?: () => void;
  steps: (
    prevStep: () => void,
    nextStep: () => void,
    reportError: (error: Error | null) => void,
    reportStatus: (message?: string, loading?: boolean) => void,
    execFunc: (step: number, func: () => void) => void
  ) => {
    label: React.ReactNode;
    optional?: React.ReactNode;
    content: React.ReactNode;
  }[];
}> = ({ autoExec, onClose, onDone, open, steps, title }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<Record<number, Error | null | undefined>>({});
  const [status, setStatus] = useState<
    Record<number, { message?: string; loading?: boolean } | undefined>
  >({});
  const execFuncRef = useRef<Record<number, Function | null | undefined>>({});

  const prevStep = useCallback(() => {
    setActiveStep((step) => Math.max(0, step - 1));
  }, []);

  const nextStep = useCallback(() => {
    setError({ [activeStep]: null });
    setActiveStep(activeStep + 1);

    if (autoExec) {
      setTimeout(() => {
        execFuncRef.current?.[activeStep + 1]?.();
      }, 0);
    }
  }, [activeStep, autoExec]);

  const reportError = useCallback(
    (error: Error | null) => setError((_error) => ({ ..._error, [activeStep]: error })),
    [activeStep]
  );

  const reportStatus = useCallback(
    (message?: string, loading?: boolean) =>
      setStatus((_status) => ({ ..._status, [activeStep]: { message, loading } })),
    [activeStep]
  );

  const execFunc = useCallback((step: number, func: () => void) => {
    execFuncRef.current[step] = func;
  }, []);

  const children = useMemo(
    () => steps(prevStep, nextStep, reportError, reportStatus, execFunc),
    [execFunc, nextStep, prevStep, reportError, reportStatus, steps]
  );

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
        {activeStep === children.length && (
          <Paper elevation={0} square sx={{ p: 3 }}>
            <Typography>All steps finished</Typography>
            <Button onClick={onDone}>Finish</Button>
          </Paper>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DidsModal);

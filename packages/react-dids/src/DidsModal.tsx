import LockIcon from '@mui/icons-material/Lock';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  InputAdornment,
  Stack,
  Step,
  StepLabel,
  Stepper
} from '@mui/material';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';

import { DidsStepProps } from './steps/types';
import { DidsContext } from './DidsProvider';

const DidsModal: React.FC<
  React.PropsWithChildren<{
    title: React.ReactNode;
    open: boolean;
    submitText?: string;
    onDone?: () => void;
    onClose?: () => void;
    steps?: DidsStepProps[];
  }>
> = ({ children, onClose, onDone, open, steps, submitText, title }) => {
  const { didUri, isLocked, unlockDid } = useContext(DidsContext);
  const [password, setPassword] = useState<string>('');
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<Error | null>();
  const [status, setStatus] = useState<{ message?: string; loading?: boolean } | null>();
  const [execing, setExecing] = useState(false);
  const stepsRef = useRef<DidsStepProps[] | undefined>(steps);

  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const nextStep = useCallback(() => {
    setError(null);
    setStatus(null);

    setActiveStep(activeStep + 1);
  }, [activeStep]);

  const report = useCallback((error: Error | null, loading?: boolean, message?: string): void => {
    if (error) {
      setError(error);
    } else {
      setStatus({ loading, message });
    }
  }, []);

  useEffect(() => {
    if (!stepsRef.current) return;
    if (!execing) return;

    if (activeStep >= stepsRef.current.length) return;

    setStatus({ loading: true });
    stepsRef.current[activeStep]
      .exec(report)
      .then(() => {
        nextStep();
      })
      .finally(() => {
        setStatus({ loading: false });
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeStep, execing]);

  const handleExec = useCallback(() => {
    setExecing(true);
  }, []);

  const unlock = useCallback(async () => {
    if (!didUri) return;

    await unlockDid(didUri, password);
  }, [didUri, password, unlockDid]);

  return (
    <Dialog maxWidth="sm" open={open}>
      <DialogHeader onClose={onClose}>{title}</DialogHeader>
      <DialogContent sx={{ minWidth: 325, width: 578, maxWidth: '100%', padding: 7.5 }}>
        <Stack spacing={3}>
          {children}
          {isLocked && (
            <>
              <InputPassword
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Please input password"
                startAdornment={
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                }
              />
              <Button fullWidth onClick={unlock} variant="contained">
                Unlock
              </Button>
            </>
          )}
          {steps && !isLocked && (
            <>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map(({ label, optional }, index) => (
                  <Step key={index}>
                    <StepLabel
                      error={activeStep === index && !!error}
                      icon={
                        activeStep === index ? (
                          error ? undefined : status?.loading ? (
                            <CircularProgress size={24} />
                          ) : undefined
                        ) : undefined
                      }
                      optional={
                        activeStep === index
                          ? error
                            ? error.message ?? optional
                            : status
                            ? status?.message ?? optional
                            : optional
                          : optional
                      }
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
              {activeStep === steps.length ? (
                <Button fullWidth onClick={onDone} variant="contained">
                  Finish
                </Button>
              ) : (
                <Button disabled={execing} fullWidth onClick={handleExec} variant="contained">
                  {submitText ?? 'Submit'}
                </Button>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DidsModal);

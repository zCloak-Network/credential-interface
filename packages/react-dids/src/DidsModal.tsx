import LockIcon from '@mui/icons-material/Lock';
import { Button, Dialog, DialogContent, InputAdornment, lighten, Stack } from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';

import { DidsContext } from './DidsProvider';

const DidsModal: React.FC<
  React.PropsWithChildren<{
    title: React.ReactNode;
    open: boolean;
    steps: React.ReactNode;
    onClose?: () => void;
  }>
> = ({ children, onClose, open, steps, title }) => {
  const { didUri, isLocked, unlockDid } = useContext(DidsContext);
  const [password, setPassword] = useState<string>('');

  const unlock = useCallback(() => {
    if (!didUri) return;

    unlockDid(didUri, password);
  }, [didUri, password, unlockDid]);

  return (
    <Dialog maxWidth="sm" open={open}>
      <DialogHeader onClose={onClose}>{title}</DialogHeader>
      <DialogContent sx={{ minWidth: 280, width: 578, maxWidth: '100%', padding: 7.5 }}>
        <Stack spacing={3}>
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
                sx={({ palette }) => ({
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent'
                  },
                  border: 'none',
                  background: lighten(palette.primary.main, 0.94)
                })}
              />
              <Button fullWidth onClick={unlock} variant="contained">
                Unlock
              </Button>
            </>
          )}
          {isLocked ? null : steps || children}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DidsModal);

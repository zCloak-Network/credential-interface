import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import React, { useCallback, useState } from 'react';

import { useKeystore } from '@credential/react-keystore';

import DialogHeader from './DialogHeader';
import { useDids } from './DidsProvider';
import InputPassword from './InputPassword';

const UnlockModal: React.FC<{ open: boolean; onClose?: () => void; onUnlock: () => void }> = ({
  onClose,
  onUnlock,
  open
}) => {
  const { unlock } = useKeystore();
  const { account } = useDids();
  const [password, setPassword] = useState<string>();

  const _onUnlock = useCallback(() => {
    unlock(password);
    onUnlock();
  }, [onUnlock, password, unlock]);

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent>
        <Typography mb={2} variant="h4">
          Please input password unlock
        </Typography>
        <Typography mb={4} variant="inherit">
          Account: {account}
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>Please input password</InputLabel>
          <InputPassword onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={_onUnlock} variant="contained">
          Unlock
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(UnlockModal);

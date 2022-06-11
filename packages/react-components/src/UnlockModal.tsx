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

import DialogHeader from './DialogHeader';
import { useDids } from './DidsProvider';
import PasswordInput from './PasswordInput';

const UnlockModal: React.FC<{ open: boolean; onClose?: () => void; onUnlock: () => void }> = ({
  onClose,
  onUnlock,
  open
}) => {
  const { account, dids } = useDids();
  const [password, setPassword] = useState<string>();

  const unlock = useCallback(() => {
    dids.unlock(password);
    onUnlock();
  }, [dids, onUnlock, password]);

  return (
    <Dialog maxWidth="lg" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent sx={{ width: 600, maxWidth: '100%' }}>
        <Typography mb={2} variant="h4">
          Please input password unlock
        </Typography>
        <Typography mb={4} variant="inherit">
          Account: {account}
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>Please input password</InputLabel>
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <LoadingButton onClick={unlock} variant="contained">
          Unlock
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(UnlockModal);

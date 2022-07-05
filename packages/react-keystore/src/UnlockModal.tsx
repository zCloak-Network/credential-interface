import { LoadingButton } from '@mui/lab';
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  Typography
} from '@mui/material';
import React, { useCallback, useMemo, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';

import { useKeystore } from './KeystoreProvider';

const UnlockModal: React.FC<{
  open: boolean;
  publicKey: Uint8Array;
  onClose?: () => void;
  onUnlock: () => void;
}> = ({ onClose, onUnlock, open, publicKey }) => {
  const [password, setPassword] = useState<string>();
  const { keyring } = useKeystore();
  const [error, setError] = useState<Error>();

  const _onUnlock = useCallback(() => {
    try {
      keyring.getPair(publicKey).unlock(password);
      onUnlock();
    } catch (error) {
      setError(error as Error);
    }
  }, [keyring, onUnlock, password, publicKey]);

  const account = useMemo(() => keyring.getAccount(publicKey)?.address, [keyring, publicKey]);

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent>
        <Typography mb={2} variant="h4">
          Please input password unlock
        </Typography>
        <Typography mb={4} variant="inherit">
          Account: {account}
        </Typography>
        <FormControl error={!!error} fullWidth variant="outlined">
          <InputLabel shrink>Please input password</InputLabel>
          <InputPassword onChange={(e) => setPassword(e.target.value)} />
          {error && <FormHelperText>Unable to unlock account</FormHelperText>}
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

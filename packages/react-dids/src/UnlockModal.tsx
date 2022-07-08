import { DidUri } from '@kiltprotocol/sdk-js';
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
import React, { useCallback, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';

import DidName from './DidName';

const UnlockModal: React.FC<{
  open: boolean;
  did?: DidUri;
  unlockDid: (didUri: DidUri, password: string) => Promise<void>;
  onClose?: () => void;
  onUnlock: () => void;
}> = ({ did, onClose, onUnlock, open, unlockDid }) => {
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<Error>();

  const _onUnlock = useCallback(async () => {
    if (!did) return;
    if (!password) return;

    try {
      await unlockDid(did, password);

      onUnlock();
    } catch (error) {
      setError(error as Error);
    }
  }, [did, onUnlock, password, unlockDid]);

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent>
        <Typography mb={2} variant="h4">
          Please input password unlock
        </Typography>
        <Typography mb={4} variant="inherit">
          <DidName shorten={false} value={did} />
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

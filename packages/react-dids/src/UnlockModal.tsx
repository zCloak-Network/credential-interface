import { DidUri } from '@kiltprotocol/sdk-js';
import { LoadingButton } from '@mui/lab';
import { Dialog, DialogActions, DialogContent, OutlinedInput } from '@mui/material';
import React, { useCallback, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';

const UnlockModal: React.FC<{
  open: boolean;
  did?: DidUri;
  unlockDid: (didUri: DidUri, password: string) => Promise<void>;
  onClose?: () => void;
  onUnlock: () => void;
}> = ({ did, onClose, onUnlock, open, unlockDid }) => {
  const [password, setPassword] = useState<string>();

  const _onUnlock = useCallback(async () => {
    if (!did) return;
    if (!password) return;

    try {
      await unlockDid(did, password);

      onUnlock();
    } catch (error) {}
  }, [did, onUnlock, password, unlockDid]);

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent>
        <OutlinedInput disabled fullWidth value={did} />
        <InputPassword
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginTop: 4 }}
        />
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

import { DidUri } from '@kiltprotocol/sdk-js';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Button, Dialog, DialogContent, InputAdornment, OutlinedInput, Stack } from '@mui/material';
import React, { useCallback, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';

const UnlockModal: React.FC<{
  open: boolean;
  did?: DidUri;
  unlockDid: (password: string) => void;
  onClose?: () => void;
  onUnlock: () => void;
}> = ({ did, onClose, onUnlock, open, unlockDid }) => {
  const [password, setPassword] = useState<string>();

  const _onUnlock = useCallback(() => {
    if (!did) return;
    if (!password) return;

    try {
      unlockDid(password);

      onUnlock();
    } catch (error) {}
  }, [did, onUnlock, password, unlockDid]);

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent sx={{ width: '578px', maxWidth: '100%' }}>
        <Stack spacing={4}>
          <OutlinedInput
            disabled
            fullWidth
            startAdornment={
              <InputAdornment position="start">
                <PersonIcon color="primary" />
              </InputAdornment>
            }
            value={did}
          />
          <InputPassword
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Please input password"
            startAdornment={
              <InputAdornment position="start">
                <LockIcon color="primary" />
              </InputAdornment>
            }
          />
          <Button fullWidth onClick={_onUnlock} variant="contained">
            Unlock
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(UnlockModal);

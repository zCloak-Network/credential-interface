import {
  Button,
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

const UnlockModal: React.FC<{ open: boolean; onClose?: () => void }> = ({ onClose, open }) => {
  const { account, dids } = useDids();
  const [password, setPassword] = useState<string>();

  const unlock = useCallback(() => {
    dids.unlock(password);
  }, [dids, password]);

  return (
    <Dialog maxWidth="md" onClose={onClose} open={open}>
      <DialogHeader onClose={onClose}>Unlock account</DialogHeader>
      <DialogContent sx={{ width: '424px', maxWidth: '100%' }}>
        <Typography mb={4} variant="h3">
          Please input password unlock {account}
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>Please input password</InputLabel>
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={unlock} variant="contained">
          Unlock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(UnlockModal);

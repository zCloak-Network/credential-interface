import {
  Button,
  Divider,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import { InputPassword, NotificationContext } from '@credential/react-components';
import { DidsContext } from '@credential/react-dids';

const Restore: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState<string>();
  const [file, setFile] = useState<File>();
  const { notifyError } = useContext(NotificationContext);
  const { restoreDid } = useContext(DidsContext);

  const restore = useCallback(() => {
    if (!password) return;
    if (!file) return;

    file
      .text()
      .then((text) => {
        restoreDid(text, password);
      })
      .then(onSuccess)
      .catch((error) => {
        notifyError(error as Error);
      });
  }, [file, notifyError, onSuccess, password, restoreDid]);

  return (
    <Stack spacing={5.5}>
      <FormControl fullWidth variant="outlined">
        <InputLabel shrink>Did-keys File</InputLabel>
        <OutlinedInput
          endAdornment={
            <InputAdornment position="end">
              <Button component="label" variant="contained">
                Select Did Keys file
                <input
                  accept="application/json"
                  hidden
                  onChange={(e) => {
                    setFile(e.target.files?.[0]);
                  }}
                  type="file"
                />
              </Button>
            </InputAdornment>
          }
          fullWidth
          placeholder="Select Did-keys file"
          value={file?.name}
        />
      </FormControl>
      <Divider sx={() => ({ marginTop: 3, marginBottom: 3 })} variant="fullWidth" />
      <FormControl fullWidth variant="outlined">
        <InputLabel shrink>Enter password</InputLabel>
        <InputPassword
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
      </FormControl>
      <Button fullWidth onClick={restore} size="large" variant="contained">
        Restore
      </Button>
    </Stack>
  );
};

export default React.memo(Restore);

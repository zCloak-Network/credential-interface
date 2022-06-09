import { LoadingButton } from '@mui/lab';
import {
  Button,
  Container,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { NotificationContext, PasswordInput } from '@credential/react-components';
import { useKeystore } from '@credential/react-keystore';

import Success from './Success';

const Restore: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const { restoreKeystore } = useKeystore();
  const { notifyError } = useContext(NotificationContext);

  const restore = useCallback(() => {
    if (file) {
      setLoading(true);
      file
        .text()
        .then((text) => {
          restoreKeystore(text, 'claimer', password);
        })
        .then(() => setSuccess(true))
        .catch((error) => {
          notifyError(error as Error);
        })
        .finally(() => setLoading(false));
    }
  }, [file, notifyError, password, restoreKeystore]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {success ? (
        <Success
          desc="Remember to keep your secret recovery phrase safe, it’s your responsibility."
          title="Your account has been restored account!"
          toggleStart={() => navigate('/')}
        />
      ) : (
        <Stack alignItems="center" spacing={5.5}>
          <Typography textAlign="center" variant="h5">
            Restore account
          </Typography>
          <Typography textAlign="center" variant="h5">
            Select your keystore file and input your password.
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Keystore file</InputLabel>
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <Button component="label" variant="contained">
                    Select keystore file
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
              value={file?.name}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Enter password</InputLabel>
            <PasswordInput onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          <LoadingButton
            fullWidth
            loading={loading}
            onClick={restore}
            size="large"
            variant="contained"
          >
            Restore
          </LoadingButton>
        </Stack>
      )}
    </Container>
  );
};

export default React.memo(Restore);

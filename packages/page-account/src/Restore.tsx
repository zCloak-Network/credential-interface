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

import { InputPassword, NotificationContext } from '@credential/react-components';
import { DidsContext } from '@credential/react-dids';
import { useQueryParam } from '@credential/react-hooks';

import Success from './Success';

const Restore: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [file, setFile] = useState<File>();
  const { notifyError } = useContext(NotificationContext);
  const { generateDid, restoreDid } = useContext(DidsContext);
  const [redirect] = useQueryParam<string>('redirect');
  const [mnemonic, setMnemonic] = useState<string>();

  const restore = useCallback(() => {
    if (!password) return;

    if (file) {
      setLoading(true);
      file
        .text()
        .then((text) => {
          restoreDid(text, password);
        })
        .then(() => setSuccess(true))
        .catch((error) => {
          notifyError(error as Error);
        })
        .finally(() => setLoading(false));
    } else if (mnemonic) {
      generateDid(mnemonic, password);
      setSuccess(true);
    }
  }, [file, generateDid, mnemonic, notifyError, password, restoreDid]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      {success ? (
        <Success
          desc="Remember to keep your secret recovery phrase safe, it’s your responsibility."
          title="Your account has been restored account!"
          toggleStart={() => navigate(`/${redirect ?? 'claimer'}`)}
        />
      ) : (
        <Stack alignItems="center" spacing={5.5}>
          <Typography textAlign="center" variant="h3">
            Restore account
          </Typography>
          <Typography textAlign="center" variant="inherit">
            Enter your Mnemonic Phrase or select your did-keys file here to restore your account.
          </Typography>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Mnemonic Phrase or did-keys file</InputLabel>
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <Button component="label" variant="contained">
                    Select did-keys file
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
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder="Enter Mnemonic Phrase or Select did-keys file"
              value={file?.name ?? mnemonic}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel shrink>Enter password</InputLabel>
            <InputPassword
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
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

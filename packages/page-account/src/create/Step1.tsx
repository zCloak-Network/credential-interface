import { Box, Button, FormControl, InputLabel, Stack } from '@mui/material';
import React, { useCallback, useState } from 'react';

import { PasswordInput } from '@credential/react-components';

const Step1: React.FC<{ onConfirm: (password: string) => void }> = ({ onConfirm }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleConfirm = useCallback(() => {
    onConfirm(password);
  }, [onConfirm, password]);

  return (
    <>
      <Stack spacing={2} width="100%">
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>Enter password</InputLabel>
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>Confirm password</InputLabel>
          <PasswordInput onChange={(e) => setConfirmPassword(e.target.value)} />
        </FormControl>
      </Stack>
      <Box sx={{ textAlign: 'right', width: '100%' }}>
        <Button disabled={password !== confirmPassword} onClick={toggleConfirm} variant="contained">
          Create
        </Button>
      </Box>
    </>
  );
};

export default React.memo(Step1);

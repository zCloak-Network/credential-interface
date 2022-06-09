import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Account: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Stack spacing={3}>
          <Typography variant="h1">
            Welcome to
            <br />
            zCloak Credential Center
          </Typography>
          <Typography>Create a New Credential account.</Typography>
          <Button onClick={() => navigate('/account/create')} size="large" variant="contained">
            Create account
          </Button>
          <Button onClick={() => navigate('/account/restore')} size="large" variant="outlined">
            Restore account
          </Button>
        </Stack>
        <Box component="img" src="/images/home-pic.webp" width="490px" />
      </Stack>
    </Container>
  );
};

export default Account;

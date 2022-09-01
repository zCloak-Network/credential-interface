import { Dialog, DialogContent, IconButton, Stack } from '@mui/material';
import React from 'react';

import { DialogHeader } from '@credential/react-components';

function Main({ onClose }: { onClose: () => void }) {
  return (
    <Dialog maxWidth="sm" onClose={onClose} open>
      <DialogHeader onClose={onClose}>Manage DID Account</DialogHeader>
      <DialogContent>
        <Stack alignItems="center" direction="row" spacing={6}>
          <IconButton></IconButton>
          <IconButton></IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default React.memo(Main);

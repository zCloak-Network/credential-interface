import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel
} from '@mui/material';
import FileSaver from 'file-saver';
import React, { useCallback, useContext, useState } from 'react';

import { DialogHeader, InputPassword } from '@credential/react-components';
import { DidsContext } from '@credential/react-dids';

interface Props {
  onClose: () => void;
}

const ExportModal: React.FC<Props> = ({ onClose }) => {
  const { backupDid } = useContext(DidsContext);
  const [password, setPassword] = useState<string>();
  const [error, setError] = useState<Error>();

  const handleExport = useCallback(() => {
    if (!password) return;

    try {
      const json = backupDid(password);

      if (!json) return;
      const blobSiningJson = new Blob([JSON.stringify(json)], {
        type: 'text/plain;charset=utf-8'
      });

      FileSaver.saveAs(blobSiningJson, `${json.didUri}.json`);
      onClose();
    } catch (error) {
      setError(error as Error);
    }
  }, [backupDid, onClose, password]);

  return (
    <Dialog maxWidth="md" onClose={onClose} open>
      <DialogHeader onClose={onClose}>Export did</DialogHeader>
      <DialogContent>
        <FormControl error={!!error} fullWidth variant="outlined">
          <InputLabel shrink>Please input password</InputLabel>
          <InputPassword onChange={(e) => setPassword(e.target.value)} />
          {error && <FormHelperText>Password error</FormHelperText>}
        </FormControl>
        <Button
          disabled={!password}
          fullWidth
          onClick={handleExport}
          sx={{ marginTop: 2 }}
          variant="contained"
        >
          Export did
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ExportModal);

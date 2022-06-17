import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import {
  alpha,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import React, { useCallback, useContext, useState } from 'react';

import { CTypeContext, DialogHeader } from '@credential/react-components';
import { useToggle } from '@credential/react-hooks';

const ImportCType: React.FC = () => {
  const { importCType } = useContext(CTypeContext);
  const [open, toggleOpen] = useToggle();
  const [hash, setHash] = useState<string>();

  const handleClick = useCallback(() => {
    if (hash) {
      importCType(hash);
      toggleOpen();
    }
  }, [hash, importCType, toggleOpen]);

  return (
    <>
      <Button
        onClick={toggleOpen}
        startIcon={<FileUploadOutlinedIcon />}
        sx={({ palette }) => ({
          borderRadius: 6,
          color: palette.primary.main,
          boxShadow: 'none',
          background: alpha(palette.primary.main, 0.2),
          ':hover': {
            boxShadow: 'none',
            background: alpha(palette.primary.main, 0.35)
          }
        })}
        variant="contained"
      >
        Import
      </Button>
      <Dialog maxWidth="sm" onClose={toggleOpen} open={open}>
        <DialogHeader onClose={toggleOpen}>Import credential type</DialogHeader>
        <DialogContent sx={{ width: 500, maxWidth: '100%' }}>
          <FormControl fullWidth>
            <InputLabel shrink>CType hash</InputLabel>
            <OutlinedInput
              onChange={(e) => setHash(e.target.value)}
              placeholder="please input credential type hash"
            />
          </FormControl>
          <Button
            fullWidth
            onClick={handleClick}
            size="large"
            sx={{ marginTop: 4 }}
            variant="contained"
          >
            Import
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default React.memo(ImportCType);

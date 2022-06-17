import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { alpha, Button } from '@mui/material';
import React from 'react';

import { ImportCTypeModal } from '@credential/react-components';
import { useToggle } from '@credential/react-hooks';

const ImportCType: React.FC = () => {
  const [open, toggleOpen] = useToggle();

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
      <ImportCTypeModal onClose={toggleOpen} open={open} />
    </>
  );
};

export default React.memo(ImportCType);

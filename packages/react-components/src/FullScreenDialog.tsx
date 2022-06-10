import CloseIcon from '@mui/icons-material/Close';
import { Container, IconButton, Modal } from '@mui/material';
import React from 'react';

interface Props {
  open?: boolean;
  onClose?: () => void;
}

const FullScreenDialog: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  onClose,
  open = false
}) => {
  return (
    <Modal
      open={open}
      sx={{
        overflowY: 'scroll',
        width: '100%',
        py: 4,
        px: 15,

        '.MuiBackdrop-root': {
          background: 'rgba(0, 0, 0, 0.9)'
        }
      }}
    >
      <>
        {onClose && (
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              position: 'fixed',
              right: '20px',
              top: '20px'
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        <Container maxWidth="xl">{children}</Container>
      </>
    </Modal>
  );
};

export default React.memo<typeof FullScreenDialog>(FullScreenDialog);

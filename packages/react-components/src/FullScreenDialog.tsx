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
        width: '100%',

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
        <Container
          maxWidth="lg"
          sx={({ spacing }) => ({
            position: 'absolute',
            bottom: 0,
            top: spacing(4),
            left: 0,
            right: 0,
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column'
          })}
        >
          {children}
        </Container>
      </>
    </Modal>
  );
};

export default React.memo<typeof FullScreenDialog>(FullScreenDialog);

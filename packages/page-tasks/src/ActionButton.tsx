import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, Menu, MenuItem } from '@mui/material';
import React, { useCallback } from 'react';

import { Attestation } from '@credential/app-db/attestation/Attestation';
import { RequestForAttestation } from '@credential/app-db/requestForAttestation';
import { useToggle } from '@credential/react-hooks';

import RequestDetails from './RequestDetails';

const ActionButton: React.FC<{ request: RequestForAttestation; attestation?: Attestation }> = ({
  attestation,
  request
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [detailsOpen, toggleDetailsOpen] = useToggle();

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          onClick={() => {
            toggleDetailsOpen();
            handleClose();
          }}
          sx={({ palette }) => ({ color: palette.grey[600] })}
        >
          Details
        </MenuItem>
      </Menu>
      {detailsOpen && (
        <RequestDetails
          attestation={attestation}
          onClose={toggleDetailsOpen}
          open={detailsOpen}
          request={request}
        />
      )}
    </>
  );
};

export default React.memo(ActionButton);

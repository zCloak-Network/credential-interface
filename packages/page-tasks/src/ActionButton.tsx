import { IAttestation } from '@kiltprotocol/sdk-js';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { endpoint } from '@credential/app-config/endpoints';
import { useRequestMessages } from '@credential/react-hooks';
import { Request, RequestStatus } from '@credential/react-hooks/types';

import IconDetails from './icons/icon_details.svg';
import Approve from './RequestDetails/Approve';
import Reject from './RequestDetails/Reject';
import Revoke from './RequestDetails/Revoke';

const ActionButton: React.FC<{ request: Request; attestation?: IAttestation | null }> = ({
  attestation,
  request
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const messageLinked = useRequestMessages(endpoint.db, request.rootHash);

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
        MenuListProps={{ sx: { padding: 1 } }}
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem
          component={Link}
          onClick={() => {
            endpoint.db.readMessage(request.messageId);
          }}
          sx={({ palette }) => ({ color: palette.grey[600] })}
          to={`/attester/tasks/${request.rootHash}`}
        >
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconDetails />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>
        {request.status === RequestStatus.INIT && (
          <Approve messageLinked={messageLinked} request={request} type="menu" />
        )}
        {request.status === RequestStatus.INIT && (
          <Reject messageLinked={messageLinked} request={request} type="menu" />
        )}
        {request.status === RequestStatus.SUBMIT && attestation && !attestation.revoked && (
          <Revoke
            attestation={attestation}
            messageLinked={messageLinked}
            request={request}
            type="menu"
          />
        )}
      </Menu>
    </>
  );
};

export default React.memo(ActionButton);

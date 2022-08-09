import { IAttestation, IRequestAttestation } from '@kiltprotocol/sdk-js';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Message } from '@credential/app-db/message';
import { RequestStatus } from '@credential/react-hooks/types';

import IconDetails from './icons/icon_details.svg';
import Approve from './RequestDetails/Approve';
import Reject from './RequestDetails/Reject';
import Revoke from './RequestDetails/Revoke';
import { useMessageLinked } from './useMessageLinked';

const ActionButton: React.FC<{
  request: Message<IRequestAttestation>;
  attestation?: IAttestation | null;
  status: RequestStatus;
}> = ({ attestation, request, status }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const messageLinked = useMessageLinked(request.body.content.requestForAttestation.rootHash);

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
          sx={({ palette }) => ({ color: palette.grey[600] })}
          to={`/attester/tasks/${request.body.content.requestForAttestation.rootHash}`}
        >
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconDetails />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>
        {status === RequestStatus.INIT && (
          <Approve messageLinked={messageLinked} request={request} type="menu" />
        )}
        {status === RequestStatus.INIT && (
          <Reject messageLinked={messageLinked} request={request} type="menu" />
        )}
        {status === RequestStatus.SUBMIT && attestation && !attestation.revoked && (
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

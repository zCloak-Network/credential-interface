import type { DidUri } from '@kiltprotocol/sdk-js';

import {
  alpha,
  Button,
  Divider,
  Link,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { endpoint } from '@credential/app-config/endpoints';
import { Address, Copy, FormatBalance, IdentityIcon } from '@credential/react-components';
import { DidName, DidsContext } from '@credential/react-dids';
import { useBalances, useToggle } from '@credential/react-hooks';

import AddressIcon from './address.svg';
import ExportModal from './ExportModal';
import ExportIcon from './icon_export.svg';
import LogoutIcon from './icon_logout.svg';
import StarIcon from './icon_star.svg';
import KiltIcon from './pic_kilt.png';

interface Props {
  did: DidUri;
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
}

const DidMenu: React.FC<Props> = ({ anchorEl, did, onClose, open }) => {
  const { didDetails, logout } = useContext(DidsContext);
  const [exportOpen, toggleExportOpen] = useToggle();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const balances = useBalances(didDetails?.identifier);

  const handleExport = useCallback(() => {
    toggleExportOpen();
    onClose();
  }, [onClose, toggleExportOpen]);

  const handleProfile = useCallback(() => {
    navigate(pathname.startsWith('/attester') ? '/attester/did/profile' : '/claimer/did/profile');
    onClose();
  }, [navigate, onClose, pathname]);

  const handleLogout = useCallback(() => {
    logout();
    onClose();
  }, [logout, onClose]);

  return (
    <>
      <Menu
        MenuListProps={{
          sx: {
            fontSize: '1rem',
            '.MuiMenuItem-root,.MuiListItem-root': {
              paddingY: 1.5,
              paddingX: '5px'
            },
            '.MuiListItemIcon-root': {
              minWidth: '32px'
            }
          }
        }}
        anchorEl={anchorEl}
        onClose={onClose}
        open={open}
      >
        <Typography fontWeight={500} variant="h6">
          Did
        </Typography>
        <ListItem
          sx={({ palette }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 300,
            height: 72,
            paddingX: 3,
            marginTop: 1,
            borderRadius: 2.5,
            background: alpha(palette.primary.main, 0.2)
          })}
        >
          <ListItemIcon>
            <IdentityIcon value={did} />
          </ListItemIcon>
          <ListItemText primary={<DidName value={did} />} />
          <Copy value={did} />
        </ListItem>
        <Divider sx={{ marginTop: 3, marginBottom: 1 }} />
        <ListItem>
          <ListItemIcon>
            <AddressIcon />
          </ListItemIcon>
          <ListItemText>KILT Address</ListItemText>
          <ListItemSecondaryAction>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <Address value={didDetails?.identifier} />
              <Copy value={didDetails?.identifier ?? ''} />
            </Stack>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <img src={KiltIcon} />
          </ListItemIcon>
          <ListItemText>KILT Balance</ListItemText>
          <ListItemSecondaryAction>
            <FormatBalance value={balances?.free} />
          </ListItemSecondaryAction>
        </ListItem>
        {endpoint && (
          <Button
            component={Link}
            fullWidth
            href={endpoint.faucetLink}
            sx={{ marginBottom: 2 }}
            target="_blank"
            variant="contained"
          >
            Go to KILT faucet to get token
          </Button>
        )}
        <Divider sx={{ marginY: 1 }} />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText>DID Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <ExportIcon />
          </ListItemIcon>
          <ListItemText>Export DID-Key</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      {exportOpen && <ExportModal onClose={toggleExportOpen} />}
    </>
  );
};

export default React.memo(DidMenu);

import type { Did } from '@kiltprotocol/sdk-js';

import {
  alpha,
  Box,
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
import {
  IconAddress,
  IconExport,
  IconLogout,
  IconScan,
  IconStar
} from '@credential/app-config/icons';
import { PicKilt } from '@credential/app-config/images';
import { Address, Copy, FormatBalance, IdentityIcon } from '@credential/react-components';
import { DidName, DidsContext, MultiDids } from '@credential/react-dids';
import { useBalances, useToggle } from '@credential/react-hooks';

import CredentialScanner from './CredentialScanner';
import ExportModal from './ExportModal';

interface Props {
  did: Did.DidDetails;
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
}

const DidMenu: React.FC<Props> = ({ anchorEl, did, onClose, open }) => {
  const { light, logout } = useContext(DidsContext);
  const [exportOpen, toggleExportOpen] = useToggle();
  const [scannerOpen, toggleScannerOpen] = useToggle();
  const [multiDidOpen, toggleMultiDid] = useToggle();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const balances = useBalances(did.identifier);

  const handleScanner = useCallback(() => {
    toggleScannerOpen();
    onClose();
  }, [onClose, toggleScannerOpen]);

  const handleExport = useCallback(() => {
    toggleExportOpen();
    onClose();
  }, [onClose, toggleExportOpen]);

  const handleProfile = useCallback(() => {
    navigate(pathname.startsWith('/attester') ? '/attester/did/profile' : '/claimer/did/profile');
    onClose();
  }, [navigate, onClose, pathname]);

  const handleLogout = useCallback(() => {
    if (!light) return;
    logout(light);
    onClose();
  }, [light, logout, onClose]);

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography fontWeight={500} variant="h6">
            Did
          </Typography>
          <Button onClick={toggleMultiDid} size="small">
            Change
          </Button>
        </Box>
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
            <IdentityIcon value={did.uri} />
          </ListItemIcon>
          <ListItemText primary={<DidName value={did.uri} />} />
          <Copy value={did.uri} />
        </ListItem>
        <Divider sx={{ marginTop: 3, marginBottom: 1 }} />
        <ListItem>
          <ListItemIcon>
            <IconAddress sx={{ fill: 'transparent' }} />
          </ListItemIcon>
          <ListItemText>KILT Address</ListItemText>
          <ListItemSecondaryAction>
            <Stack alignItems="center" direction="row" spacing={0.5}>
              <Address value={did.identifier} />
              <Copy value={did.identifier ?? ''} />
            </Stack>
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <img src={PicKilt} />
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
        <MenuItem onClick={handleScanner}>
          <ListItemIcon>
            <IconScan />
          </ListItemIcon>
          <ListItemText>Scan QR code</ListItemText>
        </MenuItem>
        <Divider sx={{ marginY: 1 }} />
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <IconStar color="error" />
          </ListItemIcon>
          <ListItemText>DID Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <IconExport />
          </ListItemIcon>
          <ListItemText>Export DID-Key</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <IconLogout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      {exportOpen && <ExportModal onClose={toggleExportOpen} />}
      {scannerOpen && <CredentialScanner onClose={toggleScannerOpen} />}
      {multiDidOpen && <MultiDids onClose={toggleMultiDid} />}
    </>
  );
};

export default React.memo(DidMenu);

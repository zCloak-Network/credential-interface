import type { DidUri } from '@kiltprotocol/sdk-js';

import {
  alpha,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Copy, FormatBalance, IdentityIcon } from '@credential/react-components';
import { DidName, DidsContext } from '@credential/react-dids';
import { useBalances, useToggle } from '@credential/react-hooks';

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
  const { identifier, logout } = useContext(DidsContext);
  const [exportOpen, toggleExportOpen] = useToggle();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const balances = useBalances(identifier);

  const handleExport = useCallback(() => {
    toggleExportOpen();
    onClose();
  }, [onClose, toggleExportOpen]);

  const handleProfile = useCallback(() => {
    navigate(pathname.startsWith('/attester') ? '/attester/did/profile' : '/claimer/did/profile');
  }, [navigate, pathname]);

  const handleLogout = useCallback(() => {
    logout();
    onClose();
  }, [logout, onClose]);

  return (
    <>
      <Menu
        MenuListProps={{
          sx: {
            '.MuiMenuItem-root,.MuiListItem-root': {
              paddingY: 1.5,
              paddingX: '5px'
            },
            '.MuiListItemIcon-root': {
              minWidth: '36px'
            }
          }
        }}
        anchorEl={anchorEl}
        onClose={onClose}
        open={open}
      >
        <Typography fontWeight={500} variant="inherit">
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
            <img src={KiltIcon} />
          </ListItemIcon>
          <ListItemText>KILT Balance</ListItemText>
          <ListItemSecondaryAction>
            <FormatBalance value={balances?.free} />
          </ListItemSecondaryAction>
        </ListItem>
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
          <ListItemText>Export Did Keys</ListItemText>
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

import { DidUri } from '@kiltprotocol/sdk-js';
import {
  alpha,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import React, { useCallback, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Copy, IdentityIcon } from '@credential/react-components';
import { DidName, DidsContext } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import ExportModal from './ExportModal';
import ExportIcon from './icon_export.svg';
import LogoutIcon from './icon_logout.svg';
import StarIcon from './icon_star.svg';

interface Props {
  did: DidUri;
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
}

const DidMenu: React.FC<Props> = ({ anchorEl, did, onClose, open }) => {
  const { logout } = useContext(DidsContext);
  const [exportOpen, toggleExportOpen] = useToggle();
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
            padding: 3,

            '.MuiMenuItem-root': {
              paddingY: 1.5,
              paddingX: '5px'
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
          <ListItemIcon sx={{ minWidth: 0, marginRight: 0.5 }}>
            <IdentityIcon value={did} />
          </ListItemIcon>
          <ListItemText primary={<DidName value={did} />} />
          <Copy value={did} />
        </ListItem>
        <Divider sx={{ marginTop: 3, marginBottom: 1 }} />
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
          <ListItemText>Export keystore</ListItemText>
        </MenuItem>
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

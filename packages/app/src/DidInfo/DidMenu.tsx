import { DidUri } from '@kiltprotocol/sdk-js';
import Check from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  alpha,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { IdentityIcon } from '@credential/react-components';
import { DidName, DidsContext } from '@credential/react-dids';
import { useCopyClipboard, useToggle } from '@credential/react-hooks';

import ExportModal from './ExportModal';

interface Props {
  did: DidUri;
  anchorEl: Element | null;
  open: boolean;
  onClose: () => void;
}

const DidMenu: React.FC<Props> = ({ anchorEl, did, onClose, open }) => {
  const [isCopied, copy] = useCopyClipboard();
  const { logout } = useContext(DidsContext);
  const [exportOpen, toggleExportOpen] = useToggle();

  const handleExport = useCallback(() => {
    toggleExportOpen();
    onClose();
  }, [onClose, toggleExportOpen]);

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
          <IconButton onClick={() => copy(did)} size="small">
            {!isCopied ? <ContentCopyIcon fontSize="small" /> : <Check fontSize="small" />}
          </IconButton>
        </ListItem>
        <Divider sx={{ marginTop: 3, marginBottom: 1 }} />
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <FileDownloadOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export keystore</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
      {exportOpen && <ExportModal onClose={toggleExportOpen} />}
    </>
  );
};

export default React.memo(DidMenu);

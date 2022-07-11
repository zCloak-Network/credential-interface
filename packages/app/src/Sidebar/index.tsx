import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import {
  alpha,
  CSSObject,
  Drawer as MuiDrawer,
  Fab,
  lighten,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Theme
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ACCOUNT_TYPE } from '@credential/react-keystore/KeystoreProvider';

interface Item {
  to: string;
  active: boolean;
  svgIcon: React.ReactNode;
  text: string;
  extra?: React.ReactNode;
}

interface Props {
  accountType: ACCOUNT_TYPE;
  items: Item[];
  open: boolean;
  toggleOpen: () => void;
}

const drawerWidth = '220px';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflow: 'visible'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  width: `calc(${theme.spacing(10.5)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(11.5)} + 1px)`
  },
  overflow: 'visible'
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => !['open', 'accountType'].includes(prop as string)
})<{
  accountType: ACCOUNT_TYPE;
}>(({ accountType, open, theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    background:
      accountType === 'attester' ? theme.palette.common.black : theme.palette.common.white,
    zIndex: 99,
    padding: '100px 16px 0 16px',
    ...(open ? openedMixin(theme) : closedMixin(theme))
  },
  ...(open && {
    ...openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme)
  })
}));

const Sidebar: React.FC<Props> = ({ accountType, items, open, toggleOpen }) => {
  const navigate = useNavigate();

  return (
    <Drawer accountType={accountType} open={open} variant="permanent">
      <List>
        {items.map(({ active, extra, svgIcon, text, to }, index) => (
          <ListItem
            disablePadding
            key={index}
            sx={({ palette }) => ({
              display: 'block',
              mb: 2,
              background: active
                ? alpha(palette.primary.main, accountType === 'attester' ? 1 : 0.1)
                : undefined
            })}
          >
            <ListItemButton
              onClick={() => navigate(to)}
              sx={({ palette }) => ({
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                color:
                  accountType === 'attester'
                    ? active
                      ? palette.common.white
                      : palette.grey[500]
                    : active
                    ? palette.primary.main
                    : palette.common.black
              })}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'inherit'
                }}
              >
                {svgIcon}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <span>{text}</span>
                    {extra}
                  </Stack>
                }
                sx={() => ({
                  opacity: open ? 1 : 0
                })}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Fab
        color="primary"
        onClick={toggleOpen}
        size="small"
        sx={({ palette }) => ({
          display: 'flex',
          position: 'absolute',
          marginTop: -3,
          right: -15,
          width: 30,
          height: 30,
          minHeight: 30,
          background: lighten(palette.primary.main, 0.15)
        })}
      >
        {open ? <KeyboardArrowLeftRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
      </Fab>
    </Drawer>
  );
};

export default React.memo(Sidebar);

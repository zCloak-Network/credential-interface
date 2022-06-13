import {
  alpha,
  CSSObject,
  Drawer as MuiDrawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Theme
} from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Item {
  to: string;
  active: boolean;
  svgIcon: React.ReactNode;
  text: string;
}

interface Props {
  open: boolean;
  items: Item[];
}

const drawerWidth = '240px';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden'
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(10.5)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(11.5)} + 1px)`
  }
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ open, theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': { zIndex: 99, padding: '100px 16px 0 16px', ...openedMixin(theme) }
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': { zIndex: 99, padding: '100px 16px 0 16px', ...closedMixin(theme) }
    })
  })
);

const Sidebar: React.FC<Props> = ({ items, open }) => {
  const navigate = useNavigate();

  return (
    <Drawer open={open} variant="permanent">
      <List>
        {items.map(({ active, svgIcon, text, to }, index) => (
          <ListItem
            disablePadding
            key={index}
            sx={({ palette }) => ({
              display: 'block',
              mb: 2,
              background: active ? alpha(palette.primary.main, 0.1) : undefined
            })}
          >
            <ListItemButton
              onClick={() => navigate(to)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center'
                }}
              >
                {svgIcon}
              </ListItemIcon>
              <ListItemText
                primary={text}
                sx={({ palette }) => ({
                  opacity: open ? 1 : 0,
                  color: active ? palette.primary.main : undefined
                })}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default React.memo(Sidebar);
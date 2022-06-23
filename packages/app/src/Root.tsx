import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

import {
  CTypeProvider,
  NotificationProvider,
  ThemeProvider,
  ZkidExtensionProvider
} from '@credential/react-components';

import App from './App';

const Root: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <NotificationProvider>
            <ZkidExtensionProvider>
              <CTypeProvider>
                <CssBaseline />
                <App />
              </CTypeProvider>
            </ZkidExtensionProvider>
          </NotificationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Root;

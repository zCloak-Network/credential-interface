import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

import {
  AppProvider,
  CTypeProvider,
  NotificationProvider,
  ThemeProvider,
  ZkidExtensionProvider
} from '@credential/react-components';
import { DidsProvider } from '@credential/react-dids';
import { KeystoreProvider } from '@credential/react-keystore';

import App from './App';

const Root: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <NotificationProvider>
            <KeystoreProvider>
              <DidsProvider>
                <AppProvider>
                  <ZkidExtensionProvider>
                    <CTypeProvider>
                      <CssBaseline />
                      <App />
                    </CTypeProvider>
                  </ZkidExtensionProvider>
                </AppProvider>
              </DidsProvider>
            </KeystoreProvider>
          </NotificationProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Root;

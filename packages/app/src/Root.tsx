import { DEFAULT_ICON_CONFIGS, IconProvider } from '@icon-park/react';
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

const IconConfig = { ...DEFAULT_ICON_CONFIGS, prefix: 'icon' };

const Root: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <IconProvider value={IconConfig}>
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
        </IconProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default Root;

import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import {
  Attester as AttesterConstructor,
  Claimer as ClaimerConstructor
} from '@zcloak/credential-core';

import PageAccount from '@credential/page-account';
import PageCreateAccount from '@credential/page-account/Create';
import PageRestoreAccount from '@credential/page-account/Restore';
import PageClaims from '@credential/page-claims';
import PageCType from '@credential/page-ctype';
import PageOwnerCType from '@credential/page-ctype/OwnerCType';
import PageTasks from '@credential/page-tasks';
import { AppProvider, DidsProvider } from '@credential/react-components';
import { KeystoreProvider } from '@credential/react-keystore';

import AccountAuth from './Account/AccountAuth';
import Account from './Account';
import Attester from './Attester';
import Claimer from './Claimer';

const NoMatch: React.FC<{ to: string }> = ({ to }) => {
  return <Navigate replace to={to} />;
};

const createAppClaimer = () => (
  <KeystoreProvider type="claimer">
    <HashRouter basename="/claimer">
      <Routes>
        <Route
          element={
            <AccountAuth>
              <DidsProvider DidsConstructor={ClaimerConstructor}>
                <AppProvider>
                  <Claimer />
                </AppProvider>
              </DidsProvider>
            </AccountAuth>
          }
        >
          <Route element={<PageCType />} path="ctype" />
          <Route element={<PageClaims />} path="claims" />
          <Route element={<div>message</div>} path="message" />
        </Route>
        <Route element={<Account />} path="account">
          <Route element={<PageCreateAccount />} path="create" />
          <Route element={<PageRestoreAccount />} path="restore" />
          <Route element={<PageAccount />} index />
        </Route>
        <Route element={<NoMatch to="/ctype" />} path="*" />
        <Route element={<NoMatch to="/ctype" />} index />
      </Routes>
    </HashRouter>
  </KeystoreProvider>
);

const createAppAttester = () => (
  <KeystoreProvider type="attester">
    <HashRouter basename="/attester">
      <Routes>
        <Route
          element={
            <AccountAuth>
              <DidsProvider DidsConstructor={AttesterConstructor}>
                <AppProvider>
                  <Attester />
                </AppProvider>
              </DidsProvider>
            </AccountAuth>
          }
        >
          <Route element={<PageOwnerCType />} path="my-ctype" />
          <Route element={<PageTasks />} path="tasks" />
          <Route element={<div>message</div>} path="message" />
        </Route>
        <Route element={<Account />} path="account">
          <Route element={<PageCreateAccount />} path="create" />
          <Route element={<PageRestoreAccount />} path="restore" />
          <Route element={<PageAccount />} index />
        </Route>
        <Route element={<NoMatch to="/my-ctype" />} path="*" />
        <Route element={<NoMatch to="/my-ctype" />} index />
      </Routes>
    </HashRouter>
  </KeystoreProvider>
);

const AppClaimer = createAppClaimer();
const AppAttester = createAppAttester();

const App: React.FC = () => {
  return (
    <>
      {AppClaimer}
      {AppAttester}
    </>
  );
};

export default React.memo(App);

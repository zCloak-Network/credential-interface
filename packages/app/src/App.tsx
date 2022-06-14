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
import { CredentialProvider, DidsProvider } from '@credential/react-components';

import AccountAuth from './Account/AccountAuth';
import Account from './Account';
import Attester from './Attester';
import Claimer from './Claimer';

const NoMatch: React.FC<{ to: string }> = ({ to }) => {
  return <Navigate replace to={to} />;
};

const createAppClaimer = () => (
  <Route path="/claimer">
    <Route
      element={
        <AccountAuth accountType="claimer">
          <DidsProvider DidsConstructor={ClaimerConstructor}>
            <CredentialProvider>
              <Claimer />
            </CredentialProvider>
          </DidsProvider>
        </AccountAuth>
      }
    >
      <Route element={<PageCType />} path="ctype" />
      <Route element={<PageClaims />} path="claims" />
      <Route element={<div>message</div>} path="message" />
    </Route>
    <Route element={<Account />} path="account">
      <Route element={<PageCreateAccount accountType="claimer" />} path="create" />
      <Route element={<PageRestoreAccount accountType="claimer" />} path="restore" />
      <Route element={<PageAccount accountType="claimer" />} index />
    </Route>
    <Route element={<NoMatch to="/claimer/ctype" />} path="*" />
    <Route element={<NoMatch to="/claimer/ctype" />} index />
  </Route>
);

const createAppAttester = () => (
  <Route path="/attester">
    <Route
      element={
        <AccountAuth accountType="attester">
          <DidsProvider DidsConstructor={AttesterConstructor}>
            <Attester />
          </DidsProvider>
        </AccountAuth>
      }
    >
      <Route element={<div>my-ctype</div>} path="my-ctype" />
      <Route element={<div>tasks</div>} path="tasks" />
      <Route element={<div>message</div>} path="message" />
    </Route>
    <Route element={<Account />} path="account">
      <Route element={<PageCreateAccount accountType="attester" />} path="create" />
      <Route element={<PageRestoreAccount accountType="attester" />} path="restore" />
      <Route element={<PageAccount accountType="attester" />} index />
    </Route>
    <Route element={<NoMatch to="/attester/my-ctype" />} path="*" />
    <Route element={<NoMatch to="/attester/my-ctype" />} index />
  </Route>
);

const AppClaimer = createAppClaimer();
const AppAttester = createAppAttester();

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {AppClaimer}
        {AppAttester}
        <Route element={<NoMatch to="/claimer/ctype" />} path="*" />
      </Routes>
    </HashRouter>
  );
};

export default React.memo(App);

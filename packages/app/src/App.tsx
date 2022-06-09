import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Claimer as ClaimerConstructor } from '@zcloak/credential-core';

import PageAccount from '@credential/page-account';
import PageCreateAccount from '@credential/page-account/Create';
import PageRestoreAccount from '@credential/page-account/Restore';
import { DidsProvider } from '@credential/react-components';

import AccountAuth from './Account/AccountAuth';
import Account from './Account';
import Claimer from './Claimer';

const NoMatch: React.FC<{ to: string }> = ({ to }) => {
  return <Navigate replace to={to} />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route
          element={
            <AccountAuth accountType="claimer">
              <DidsProvider DidsConstructor={ClaimerConstructor}>
                <Claimer />
              </DidsProvider>
            </AccountAuth>
          }
          path="/"
        >
          <Route element={<div>111</div>} index />
        </Route>
        <Route element={<Account />} path="/account">
          <Route element={<PageCreateAccount />} path="create" />
          <Route element={<PageRestoreAccount />} path="restore" />
          <Route element={<PageAccount />} index />
        </Route>
        <Route element={<NoMatch to="/" />} path="*" />
      </Routes>
    </HashRouter>
  );
};

export default React.memo(App);

import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import PageAccount from '@credential/page-account';
import PageCreateAccount from '@credential/page-account/Create';
import PageRestoreAccount from '@credential/page-account/Restore';
import PageClaims from '@credential/page-claims';
import PageCType from '@credential/page-ctype';
import PageOwnerCType from '@credential/page-ctype/OwnerCType';
import PageMessage from '@credential/page-message';
import PageAttesterMessage from '@credential/page-message/attester';
import PageTasks from '@credential/page-tasks';

import AccountAuth from './Account/AccountAuth';
import Account from './Account';
import Attester from './Attester';
import Claimer from './Claimer';

const NoMatch: React.FC<{ to: string }> = ({ to }) => {
  return <Navigate replace to={to} />;
};

const createClaimerApp = () => (
  <Route
    element={
      <AccountAuth>
        <Claimer />
      </AccountAuth>
    }
    path="claimer"
  >
    <Route element={<PageCType />} path="ctype" />
    <Route element={<PageClaims />} path="claims" />
    <Route element={<PageMessage />} path="message" />
    <Route element={<NoMatch to="ctype" />} path="*" />
    <Route element={<NoMatch to="ctype" />} index />
  </Route>
);

const createAttesterApp = () => (
  <Route
    element={
      <AccountAuth>
        <Attester />
      </AccountAuth>
    }
    path="attester"
  >
    <Route element={<PageOwnerCType />} path="my-ctype" />
    <Route element={<PageTasks />} path="tasks" />
    <Route element={<PageAttesterMessage />} path="message" />
    <Route element={<NoMatch to="my-ctype" />} path="*" />
    <Route element={<NoMatch to="my-ctype" />} index />
  </Route>
);

const AppClaimer = createClaimerApp();
const AppAttester = createAttesterApp();

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {AppClaimer}
        {AppAttester}
        <Route element={<Account />} path="account">
          <Route element={<PageCreateAccount didRole="attester" />} path="create" />
          <Route element={<PageRestoreAccount didRole="attester" />} path="restore" />
          <Route element={<PageAccount />} index />
        </Route>
        <Route element={<NoMatch to="/claimer" />} path="*" />
      </Routes>
    </HashRouter>
  );
};

export default React.memo(App);

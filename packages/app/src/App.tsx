import { Box, styled } from '@mui/material';
import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import PageAccount from '@credential/page-account';
import PageCreateAccount from '@credential/page-account/Create';
import PageRestoreAccount from '@credential/page-account/Restore';
import PageClaims from '@credential/page-claims';
import PageCType from '@credential/page-ctype';
import PageOwnerCType from '@credential/page-ctype/OwnerCType';
import PageDidProfile from '@credential/page-did/DidProfile';
import PageUpgradeFullDid from '@credential/page-did/UpgradeFullDid';
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

const Container = styled(Box)``;

const createClaimerApp = () => (
  <Route
    element={
      <AccountAuth didRole="claimer">
        <Claimer />
      </AccountAuth>
    }
    path="claimer"
  >
    <Route path="did">
      <Route
        element={
          <Container>
            <PageDidProfile />
          </Container>
        }
        path="profile"
      />
    </Route>
    <Route
      element={
        <Container p={4}>
          <PageCType />
        </Container>
      }
      path="ctype"
    />
    <Route
      element={
        <Container p={4}>
          <PageClaims />
        </Container>
      }
      path="claims"
    />
    <Route
      element={
        <Container p={4}>
          <PageMessage />
        </Container>
      }
      path="message"
    />
    <Route element={<NoMatch to="ctype" />} path="*" />
    <Route element={<NoMatch to="ctype" />} index />
  </Route>
);

const createAttesterApp = () => (
  <Route
    element={
      <AccountAuth didRole="attester">
        <Attester />
      </AccountAuth>
    }
    path="attester"
  >
    <Route path="did">
      <Route
        element={
          <Container>
            <PageUpgradeFullDid />
          </Container>
        }
        path="upgrade"
      />
      <Route
        element={
          <Container>
            <PageDidProfile />
          </Container>
        }
        path="profile"
      />
    </Route>
    <Route
      element={
        <Container>
          <PageOwnerCType />
        </Container>
      }
      path="my-ctype"
    />
    <Route
      element={
        <Container>
          <PageTasks />
        </Container>
      }
      path="tasks"
    />
    <Route
      element={
        <Container>
          <PageAttesterMessage />
        </Container>
      }
      path="message"
    />
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
          <Route element={<PageCreateAccount />} path="create" />
          <Route element={<PageRestoreAccount />} path="restore" />
          <Route element={<PageAccount />} index />
        </Route>
        <Route element={<NoMatch to="/claimer" />} path="*" />
      </Routes>
    </HashRouter>
  );
};

export default React.memo(App);

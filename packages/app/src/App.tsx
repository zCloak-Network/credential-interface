import React from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import Claimer from './Claimer';

const NoMatch: React.FC<{ to: string }> = ({ to }) => {
  return <Navigate replace to={to} />;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Claimer />} path="/" />
        <Route path="/account">
          <Route path="create" />
          <Route path="restore" />
        </Route>
        <Route element={<NoMatch to="/" />} path="*" />
      </Routes>
    </HashRouter>
  );
};

export default React.memo(App);

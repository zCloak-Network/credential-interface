import React from 'react';
import { Navigate } from 'react-router-dom';

import { useKeystore } from '@credential/react-keystore';

const AccountAuth: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { keystore } = useKeystore();

  return keystore ? <>{children}</> : <Navigate to="/account" />;
};

export default React.memo(AccountAuth);

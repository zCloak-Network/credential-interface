import React from 'react';
import { Navigate } from 'react-router-dom';

import { useKeystore } from '@credential/react-keystore';

const AccountAuth: React.FC<React.PropsWithChildren<{ authType: 'claimer' | 'attester' }>> = ({
  children
}) => {
  const { claimerKeystore } = useKeystore();

  return claimerKeystore ? <>{children}</> : <Navigate to="/account" />;
};

export default React.memo(AccountAuth);

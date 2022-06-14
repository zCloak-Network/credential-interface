import type { ACCOUNT_TYPE } from '@credential/react-keystore/KeystoreProvider';

import React from 'react';
import { Navigate } from 'react-router-dom';

import { useKeystore } from '@credential/react-keystore';

const AccountAuth: React.FC<React.PropsWithChildren<{ accountType: ACCOUNT_TYPE }>> = ({
  accountType,
  children
}) => {
  const { attesterKeystore, claimerKeystore } = useKeystore();

  if (accountType === 'attester') {
    return attesterKeystore ? <>{children}</> : <Navigate to={`/${accountType}/account`} />;
  } else {
    return claimerKeystore ? <>{children}</> : <Navigate to={`/${accountType}/account`} />;
  }
};

export default React.memo(AccountAuth);

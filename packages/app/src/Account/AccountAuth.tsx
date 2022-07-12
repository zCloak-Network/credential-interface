import type { DidRole } from '@credential/react-dids/types';

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { DidsContext } from '@credential/react-dids';

const AccountAuth: React.FC<React.PropsWithChildren<{ didRole: DidRole }>> = ({
  children,
  didRole
}) => {
  const { didUri } = useContext(DidsContext);

  return didUri ? (
    <>{children}</>
  ) : (
    <Navigate
      to={{
        pathname: '/account',
        search: `?redirect=${didRole}`
      }}
    />
  );
};

export default React.memo(AccountAuth);

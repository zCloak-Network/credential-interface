import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import { DidsContext } from '@credential/react-dids';

const AccountAuth: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const { didUri } = useContext(DidsContext);

  return didUri ? <>{children}</> : <Navigate to="/account" />;
};

export default React.memo(AccountAuth);

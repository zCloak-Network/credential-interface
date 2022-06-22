import React, { useMemo } from 'react';

import { getDidUri } from './InputDid';

interface Props {
  value?: string | undefined;
  type?: 'full' | 'light';
}

const DidName: React.FC<Props> = ({ type, value }) => {
  const identifier = useMemo(
    () => (value ? getDidUri(value, type ?? 'light') : value),
    [type, value]
  );

  return <>{identifier}</>;
};

export default React.memo(DidName);

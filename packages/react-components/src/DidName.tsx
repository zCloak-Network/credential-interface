import React, { useMemo } from 'react';

import { getIdentifier } from './InputDid';

interface Props {
  value?: string | undefined;
}

const DidName: React.FC<Props> = ({ value }) => {
  const identifier = useMemo(() => (value ? getIdentifier(value) : value), [value]);

  return <>{identifier}</>;
};

export default React.memo(DidName);

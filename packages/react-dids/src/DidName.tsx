import { Did } from '@kiltprotocol/sdk-js';
import React, { useMemo } from 'react';

import { getDidUri } from './InputDid';

interface Props {
  value?: string | undefined;
  type?: 'full' | 'light';
}

const DidName: React.FC<Props> = ({ type, value }) => {
  const identifier = useMemo(() => {
    if (!value) return '';

    const uri = getDidUri(value, type ?? 'light');

    if (!uri) {
      return value;
    } else {
      return Did.Utils.parseDidUri(uri).identifier;
    }
  }, [type, value]);

  return <>{identifier}</>;
};

export default React.memo(DidName);

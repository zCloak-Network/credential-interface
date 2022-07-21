import { Did, DidUri } from '@kiltprotocol/sdk-js';
import React, { useEffect, useMemo, useState } from 'react';

import { Address } from '@credential/react-components';

import { getW3Name, w3NameCaches } from './getW3Name';

interface Props {
  value?: DidUri | undefined | null;
  shorten?: boolean;
}

const DidName: React.FC<Props> = ({ shorten = true, value }) => {
  const [w3Name, setW3Name] = useState<string | null>(null);

  const identifier = useMemo(() => {
    if (!value) return null;

    if (!Did.Utils.isUri(value)) return 'Not Did uri';

    const { identifier, type } = Did.Utils.parseDidUri(value);

    if (type === 'light') {
      return identifier.slice(2);
    } else {
      return identifier;
    }
  }, [value]);

  useEffect(() => {
    if (!identifier) return;

    getW3Name(identifier).then(setW3Name);
  }, [identifier]);

  return w3Name ? (
    <>{w3Name}</>
  ) : identifier && w3NameCaches[identifier] ? (
    <>{w3NameCaches[identifier]}</>
  ) : (
    <>
      did:kilt:
      <Address shorten={shorten} value={identifier} />
    </>
  );
};

export default React.memo(DidName);

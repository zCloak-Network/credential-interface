import { Did, DidUri } from '@kiltprotocol/sdk-js';
import React, { useEffect, useMemo, useState } from 'react';

import { Address } from '@credential/react-components';

interface Props {
  value?: DidUri | undefined | null;
  shorten?: boolean;
}

const w3NameCaches: Record<string, Promise<string | null> | undefined> = {};

const DidName: React.FC<Props> = ({ shorten = true, value }) => {
  const [w3Name, setW3Name] = useState<string | null>(null);

  const identifier = useMemo(() => {
    if (!value) return '';

    if (!Did.Utils.isUri(value)) return 'Not Did uri';

    const { identifier, type } = Did.Utils.parseDidUri(value);

    if (type === 'light') {
      return identifier.slice(2);
    } else {
      return identifier;
    }
  }, [value]);

  useEffect(() => {
    if (identifier) {
      w3NameCaches[identifier] = Did.Web3Names.queryWeb3NameForDidIdentifier(identifier);
    }

    w3NameCaches[identifier]?.then(setW3Name);
  }, [identifier]);

  return w3Name ? (
    <>{w3Name}</>
  ) : (
    <>
      did:kilt:
      <Address shorten={shorten} value={identifier} />
    </>
  );
};

export default React.memo(DidName);

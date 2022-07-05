import { Did, DidUri } from '@kiltprotocol/sdk-js';
import { useEffect, useState } from 'react';

export function useDidDetails(didUri?: DidUri): Did.DidDetails | null {
  const [didDetails, setDidDetails] = useState<Did.DidDetails | null>(null);

  useEffect(() => {
    if (!didUri) return;

    if (!Did.Utils.isUri(didUri)) return;

    const { type } = Did.Utils.parseDidUri(didUri);

    if (type === 'light') {
      setDidDetails(Did.LightDidDetails.fromUri(didUri));
    } else {
      Did.FullDidDetails.fromChainInfo(didUri).then(setDidDetails);
    }
  }, [didUri]);

  return didDetails;
}

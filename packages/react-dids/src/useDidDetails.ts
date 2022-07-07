import { Did, DidUri } from '@kiltprotocol/sdk-js';
import { useEffect, useState } from 'react';

export async function getDidDetails(didUri: DidUri): Promise<Did.DidDetails | null> {
  if (!Did.Utils.isUri(didUri)) return null;

  const { type } = Did.Utils.parseDidUri(didUri);

  if (type === 'light') {
    return Did.LightDidDetails.fromUri(didUri);
  } else {
    return Did.FullDidDetails.fromChainInfo(didUri);
  }
}

export function useDidDetails(didUri?: DidUri): Did.DidDetails | null {
  const [didDetails, setDidDetails] = useState<Did.DidDetails | null>(null);

  useEffect(() => {
    if (!didUri) return;

    getDidDetails(didUri).then(setDidDetails);
  }, [didUri]);

  return didDetails;
}

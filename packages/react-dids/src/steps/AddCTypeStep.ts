import { CType, DidUri } from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { credentialApi } from '@credential/react-hooks/api';

export async function addCtype(ctype?: CType | null, sender?: DidUri | null): Promise<void> {
  assert(ctype, 'No ctype found');
  assert(sender, 'No sender found');

  await credentialApi.addCType({
    owner: sender,
    ctypeHash: ctype.hash,
    metadata: ctype.schema
  });
}

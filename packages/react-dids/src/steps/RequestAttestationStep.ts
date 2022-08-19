import {
  Claim,
  CType,
  Did,
  IClaimContents,
  ICType,
  RequestForAttestation
} from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { Keyring } from '@credential/react-keystore/Keyring';

export async function requestAttestation(
  keyring: Keyring,
  sender?: Did.DidDetails | null,
  ctype?: ICType | null,
  contents?: IClaimContents
): Promise<RequestForAttestation> {
  assert(sender, 'No sender did provided');
  assert(ctype, 'No CType found');
  assert(contents, 'Claim contents is empty');

  const claim = Claim.fromCTypeAndClaimContents(
    CType.fromCType({
      schema: ctype.schema,
      hash: ctype.hash,
      owner: ctype.owner
    }),
    contents,
    sender.uri
  );

  const requestForAttestation = await RequestForAttestation.fromClaim(claim).signWithDidKey(
    keyring,
    sender,
    sender.authenticationKey.id
  );

  return requestForAttestation;
}

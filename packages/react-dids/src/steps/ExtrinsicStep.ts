import type { Report } from './types';

import { BlockchainUtils, SubmittableExtrinsic } from '@kiltprotocol/sdk-js';
import { assert } from '@polkadot/util';

import { Keyring } from '@credential/react-keystore/Keyring';

export async function signAndSend(
  report: Report,
  keyring: Keyring,
  sender?: string | Uint8Array | null,
  getExtrinsic?: () => Promise<SubmittableExtrinsic>
): Promise<void> {
  if (!getExtrinsic) return;

  assert(sender, 'No sender publicKey or address provided');

  const extrinsic = await getExtrinsic();

  if (!extrinsic) return;

  await BlockchainUtils.signAndSubmitTx(extrinsic, keyring.getPair(sender), {
    reSign: false,
    rejectOn: (result) => {
      return result.isError || result.internalError;
    },
    resolveOn: (result) => {
      report(null, true, result.status.type);

      return result.isFinalized;
    }
  });
}

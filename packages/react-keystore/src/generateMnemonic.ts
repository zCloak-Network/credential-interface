import { mnemonicGenerate } from '@polkadot/util-crypto';

export function generateMnemonic() {
  return mnemonicGenerate(12);
}

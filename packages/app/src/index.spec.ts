import { Keyring } from '@polkadot/keyring';
import { u8aEq } from '@polkadot/util';
import { mnemonicGenerate, signatureVerify } from '@polkadot/util-crypto';

describe('sign and verify', (): void => {
  it('sign and verify', () => {
    // generate account
    const keyring = new Keyring();
    const mnemonic = mnemonicGenerate();
    const { address, publicKey } = keyring.addFromMnemonic(mnemonic);

    // sign message
    const message = 'sign message';
    const signature = keyring.getPair(address).sign(message);

    // verify signature
    const result = signatureVerify(message, signature, address);

    expect(result.isValid);
    expect(u8aEq(result.publicKey, publicKey));
  });
});

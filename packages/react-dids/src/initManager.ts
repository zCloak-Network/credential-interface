import { LightDidDetails, Utils } from '@kiltprotocol/did';
import { DidUri, EncryptionKeyType, VerificationKeyType } from '@kiltprotocol/sdk-js';

import { DidManager } from '@zcloak/ui-did-keyring';
import { didKey } from '@zcloak/ui-did-keyring/defaults';

export let didManager: DidManager;

function initManager() {
  didManager = new DidManager();
}

function migrateDid() {
  try {
    const text = localStorage.getItem('credential:didUri');
    let didUri: DidUri | null = null;

    if (text) {
      didUri = JSON.parse(text).value;
    } else {
      return;
    }

    if (didUri && Utils.validateKiltDidUri(didUri)) {
      const { identifier, type } = Utils.parseDidUri(didUri);

      if (type === 'light') {
        localStorage.setItem(didKey(didUri), didUri);
      } else {
        const authPair = didManager.getPair(identifier);
        const encryptPair = didManager
          .getPairs()
          .filter((pair) => pair.address !== authPair.address)[0];

        const didUri = LightDidDetails.fromDetails({
          authenticationKey: {
            publicKey: authPair.publicKey,
            type:
              authPair.type === 'sr25519'
                ? VerificationKeyType.Sr25519
                : VerificationKeyType.Ed25519
          },
          encryptionKey: {
            publicKey: encryptPair.publicKey,
            type: EncryptionKeyType.X25519
          }
        }).uri;

        localStorage.setItem(didKey(didUri), didUri);
      }

      localStorage.removeItem('credential:didUri');
    }

    didManager.loadAll();
  } catch {}
}

export function loadAll() {
  didManager.loadAll();
  migrateDid();
}

export default initManager;

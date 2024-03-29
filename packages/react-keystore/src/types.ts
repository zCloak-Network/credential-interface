import type { EncryptionAlgorithms, Keystore, SigningAlgorithms } from '@kiltprotocol/types';

export type KeypairType = 'ed25519' | 'sr25519';

export type KiltKeystore = Keystore<SigningAlgorithms, EncryptionAlgorithms>;

import { Attester, Claimer } from '@zcloak/credential-core';

export function createDidsFactory<T extends typeof Claimer | typeof Attester>(
  C: T
): (...args: ConstructorParameters<T>) => InstanceType<typeof Claimer | typeof Attester> {
  if (C === Claimer) {
    return (...args: ConstructorParameters<typeof Claimer>) => new C(...args);
  } else {
    return (...args: ConstructorParameters<typeof Claimer>) => new C(...args);
  }
}

import type { Balances } from '@kiltprotocol/types';

import { Balance } from '@kiltprotocol/sdk-js';
import { useEffect, useState } from 'react';

export function useBalances(account?: string | null) {
  const [balances, setBalances] = useState<Balances>();

  useEffect(() => {
    let unsub: () => void;

    if (account) {
      Balance.listenToBalanceChanges(account, (_, balances) => {
        setBalances(balances);
      })
        .then((_unsub) => _unsub)
        .then((_unsub) => (unsub = _unsub));
    }

    return () => {
      unsub?.();
    };
  }, [account]);

  return balances;
}

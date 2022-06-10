import { useContext } from 'react';

import { DidsContext } from './DidsProvider';

export function useDidIsReady(): boolean {
  const { didIsReady } = useContext(DidsContext);

  return didIsReady;
}

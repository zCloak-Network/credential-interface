import { useContext, useMemo } from 'react';

import { DidsContext } from './DidsProvider';

export function useDerivedDid() {
  const { full, light } = useContext(DidsContext);

  return useMemo(() => full || light, [full, light]);
}

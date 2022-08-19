import { useCallback } from 'react';

export function useStopPropagation(callback: (...params: any[]) => any) {
  return useCallback(
    (...params: any[]) => {
      params?.[0]?.stopPropagation?.();

      // eslint-disable-next-line node/no-callback-literal
      callback(...params);
    },
    [callback]
  );
}

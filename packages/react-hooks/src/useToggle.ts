import { useCallback, useMemo, useState } from 'react';

export function useToggle(_default = false): [boolean, () => void, (value: boolean) => void] {
  const [open, setOpen] = useState<boolean>(_default);

  const toggle = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  return useMemo(() => [open, toggle, setOpen], [toggle, open]);
}

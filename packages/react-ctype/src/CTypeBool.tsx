import type { ItemProps } from './types';

import { FormControl, InputLabel, Switch } from '@mui/material';
import React, { useEffect } from 'react';

const CTypeBool: React.FC<ItemProps> = ({ defaultValue, name, onChange }) => {
  useEffect(() => {
    onChange?.(name, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel shrink>{name}</InputLabel>
      <Switch
        defaultChecked={(defaultValue || false) as boolean}
        onChange={(e) => onChange?.(name, e.target.checked)}
      />
    </FormControl>
  );
};

export default React.memo(CTypeBool);

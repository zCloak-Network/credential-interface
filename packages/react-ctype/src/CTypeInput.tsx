import type { ItemProps } from './types';

import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import React, { useEffect } from 'react';

const CTypeInput: React.FC<ItemProps> = ({ defaultValue, name, onChange, type }) => {
  useEffect(() => {
    onChange?.(name, '');
  }, [name, onChange]);

  return (
    <FormControl fullWidth>
      <InputLabel shrink>{name}</InputLabel>
      <OutlinedInput
        defaultValue={defaultValue}
        onChange={(e) => onChange?.(name, e.target.value)}
        placeholder={`Please input ${type}`}
      />
    </FormControl>
  );
};

export default React.memo(CTypeInput);

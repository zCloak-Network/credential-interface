import type { ItemProps } from './types';

import { FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const CTypeInputNumber: React.FC<ItemProps> = ({
  defaultValue,
  disabled = false,
  name,
  onChange,
  type
}) => {
  const [_value, _setValue] = useState<number>();
  const error = useMemo(() => {
    if (!_value) {
      return null;
    }

    if (type === 'number') {
      return isNaN(Number(_value)) ? new Error('Your input is not a number') : null;
    }

    if (type === 'integer') {
      return !isNaN(Number(_value)) && Number.isInteger(Number(_value))
        ? null
        : new Error('Your input is not a integer');
    }

    return null;
  }, [type, _value]);

  const _onChange = useCallback((e: any) => {
    _setValue(e.target.value);
  }, []);

  useEffect(() => {
    if (!error) {
      onChange?.(name, Number(_value));
    }
  }, [_value, error, name, onChange]);

  return (
    <FormControl error={!!error} fullWidth>
      <InputLabel shrink>{name}</InputLabel>
      <OutlinedInput
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={_onChange}
        placeholder={`Please input ${type}`}
      />
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default React.memo(CTypeInputNumber);

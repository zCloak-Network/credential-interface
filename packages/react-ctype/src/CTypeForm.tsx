import type { Did } from '@kiltprotocol/sdk-js';

import { Box, FormControl, InputLabel, OutlinedInput, Stack } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { CType } from '@credential/app-db/ctype';
import { AttesterSelect } from '@credential/react-dids';

import CTypeItem from './CTypeItem';

const CTypeForm: React.FC<
  React.PropsWithChildren<{
    cType: CType;
    disabled?: boolean;
    defaultData?: Record<string, unknown>;
    onChange?: (data: Record<string, unknown>) => void;
    defaultAttester?: string;
    handleAttester?: (value: Did.FullDidDetails | null) => void;
  }>
> = ({
  cType,
  onChange,
  handleAttester,
  disabled = false,
  defaultAttester,
  defaultData = {},
  children
}) => {
  const [data, setData] = useState<Record<string, unknown>>(defaultData);

  const _onChange = useCallback((key: string, value: unknown) => {
    setData((data) => ({
      ...data,
      [key]: value
    }));
  }, []);

  useEffect(() => {
    onChange?.(data);
  }, [data, onChange]);

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel shrink>Credential type</InputLabel>
        <OutlinedInput disabled value={cType.schema.title} />
      </FormControl>
      <AttesterSelect
        defaultValue={defaultAttester}
        disabled={disabled}
        onChange={handleAttester}
      />
      <Box />
      {Object.keys(cType.schema.properties).map((key) => (
        <CTypeItem
          defaultValue={defaultData?.[key]}
          disabled={disabled}
          key={key}
          name={key}
          onChange={_onChange}
          type={cType.schema.properties[key].type}
        />
      ))}
      {children}
    </Stack>
  );
};

export default React.memo(CTypeForm);

import type { IClaimContents } from '@kiltprotocol/sdk-js';

import { alpha, Box, Stack, Typography } from '@mui/material';
import React, { useMemo } from 'react';

export const ClaimItem: React.FC<{
  label: string;
  value: React.ReactElement | string | number | boolean | Record<string, unknown>;
}> = ({ label, value }) => {
  const el = useMemo(() => {
    if (value && React.isValidElement(value)) {
      return value;
    }

    const type = typeof value;

    if (['string', 'number', 'undefined'].includes(type)) {
      return <>{value}</>;
    } else if (typeof value === 'boolean') {
      return (
        <Box
          sx={({ palette }) => ({
            background: alpha(value ? palette.success.main : palette.error.main, 0.2),
            color: value ? palette.success.main : palette.error.main,
            borderRadius: 1,
            width: 92,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          })}
        >
          {value ? 'True' : 'False'}
        </Box>
      );
    } else {
      return <>{JSON.stringify(value)}</>;
    }
  }, [value]);

  return (
    <Stack
      alignItems="center"
      direction="row"
      height={24}
      justifyContent="space-between"
      paddingX={3}
    >
      <Typography sx={({ palette }) => ({ color: palette.grey[700] })}>{label}</Typography>
      {el}
    </Stack>
  );
};

function ClaimDisplay({ contents }: { contents: IClaimContents }) {
  return (
    <Stack spacing={1}>
      {Object.entries(contents).map(([key, value]) => (
        <ClaimItem key={key} label={key} value={value} />
      ))}
    </Stack>
  );
}

export default React.memo(ClaimDisplay);

import type { DidUri, Hash, IClaimContents } from '@kiltprotocol/sdk-js';

import {
  Box,
  Divider,
  lighten,
  Link,
  Paper,
  Stack,
  SvgIcon,
  Switch,
  Typography
} from '@mui/material';
import React, { useMemo } from 'react';

import { LogoCircleIcon } from '@credential/app-config/icons';
import { DidName } from '@credential/react-dids';
import { RequestStatus } from '@credential/react-hooks/types';

import CredentialStatus from '../CredentialStatus';
import CTypeName from '../CTypeName';

interface Props {
  ctypeHash: Hash;
  owner: DidUri;
  status: RequestStatus;
  attester: DidUri;
  revoked: boolean;
  contents: IClaimContents;
}

const Item: React.FC<{
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
      return <Switch checked={value} disabled />;
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

const CredentialContents: React.FC<Props> = ({
  attester,
  contents,
  ctypeHash,
  owner,
  revoked,
  status
}) => {
  return (
    <Paper
      sx={({ palette }) => ({
        background: lighten(palette.primary.main, 0.92),
        borderRadius: 2.5,
        marginTop: '94px'
      })}
      variant="outlined"
    >
      <Stack alignItems="center" marginBottom={5.5} marginTop="-30px" spacing={2}>
        <SvgIcon component={LogoCircleIcon} sx={{ fontSize: 60 }} viewBox="0 0 60 60" />
        <Box textAlign="center">
          <Typography variant="h3">
            <CTypeName cTypeHash={ctypeHash} />
          </Typography>
          <Typography>
            <CredentialStatus revoked={revoked} role="claimer" showText={false} status={status} />
            <Link marginLeft={1}>
              Attested by: <DidName value={attester} />
            </Link>
          </Typography>
        </Box>
      </Stack>
      <Item label="Credential owner" value={<DidName value={owner} />} />
      <Divider sx={({ palette }) => ({ marginY: 3, borderColor: palette.grey[300] })} />
      <Stack paddingBottom={5} spacing={1}>
        {Object.entries(contents).map(([key, value]) => (
          <Item key={key} label={key} value={value} />
        ))}
      </Stack>
    </Paper>
  );
};

export default React.memo(CredentialContents);

import type { DidUri } from '@kiltprotocol/types';

import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { ICTypeMetadata, ICTypeSchema } from '@credential/react-components/CTypeProvider/types';
import { DidsContext } from '@credential/react-dids';
import { credentialApi } from '@credential/react-hooks/api';

import CTypes from './CTypes';

const OwnerCType: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const [ownCTypes, setOwnCTypes] = useState<ICTypeMetadata[]>([]);

  useEffect(() => {
    if (didUri) {
      credentialApi.getUserCType(didUri).then((res) => {
        setOwnCTypes(
          res.data.map((d) => ({
            ...d,
            owner: d.owner as DidUri,
            schema: d.metadata as ICTypeSchema
          }))
        );
      });
    }
  }, [didUri]);

  return (
    <Stack spacing={3}>
      <Tabs
        sx={{
          px: 2,
          boxShadow: '0px 3px 6px rgba(153, 155, 168, 0.1)'
        }}
        value={0}
      >
        <Tab label="My CTypes" />
      </Tabs>
      <Box px={4}>
        <CTypes list={ownCTypes} />
      </Box>
    </Stack>
  );
};

export default OwnerCType;

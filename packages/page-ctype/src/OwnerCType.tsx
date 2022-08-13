import type { DidUri, ICType } from '@kiltprotocol/types';

import { CType } from '@kiltprotocol/sdk-js';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { DidsContext } from '@credential/react-dids';
import { credentialApi } from '@credential/react-hooks/api';

import CTypes from './CTypes';

const OwnerCType: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const [ownCTypes, setOwnCTypes] = useState<ICType[]>([]);

  useEffect(() => {
    if (didUri) {
      credentialApi.getCreatedCtypes(didUri).then((res) => {
        setOwnCTypes(
          res.data.map((d) => CType.fromSchema(d.metadata as ICType['schema'], d.owner as DidUri))
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

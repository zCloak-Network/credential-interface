import { Box, Stack, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useAttester } from '@credential/react-components';
import { ICTypeMetadata, ICTypeSchema } from '@credential/react-components/CTypeProvider/types';
import { credentialApi } from '@credential/react-hooks/api';

import CTypes from './CTypes';

const OwnerCType: React.FC = () => {
  const { attester } = useAttester();
  const [ownCTypes, setOwnCTypes] = useState<ICTypeMetadata[]>([]);

  useEffect(() => {
    if (attester.fullDidDetails) {
      credentialApi.getUserCType(attester.fullDidDetails.did).then((res) => {
        setOwnCTypes(
          res.data.map((d) => ({
            ...d,
            schema: d.metadata as ICTypeSchema
          }))
        );
      });
    }
  }, [attester]);

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

import type { IClaimContents } from '@kiltprotocol/types';

import { Box, Button, Container, Stack } from '@mui/material';
import React, { useState } from 'react';

import { ClaimDisplay } from '@credential/react-components';

interface Props {
  contents: IClaimContents;
}

const Contents: React.FC<Props> = ({ contents }) => {
  const [active, setActive] = useState<number>(0);

  return (
    <Box mt={3}>
      <Stack direction="row" justifyContent="center" spacing={2}>
        <Button
          onClick={() => setActive(0)}
          sx={({ palette }) => ({ color: active === 0 ? undefined : palette.grey[700] })}
        >
          Basic Info
        </Button>
        <Button
          onClick={() => setActive(1)}
          sx={({ palette }) => ({ color: active === 1 ? undefined : palette.grey[700] })}
        >
          History Record
        </Button>
      </Stack>
      <Box sx={({ palette }) => ({ background: palette.common.white, paddingX: 8, paddingY: 4 })}>
        {active === 0 && (
          <Container maxWidth="sm">
            <ClaimDisplay contents={contents} />
          </Container>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(Contents);

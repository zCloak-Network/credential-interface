import type { IClaimContents, MessageBody } from '@kiltprotocol/types';

import type { Message } from '@credential/app-db/message';

import Circle from '@mui/icons-material/Circle';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import moment from 'moment';
import React, { useMemo, useState } from 'react';

import { ClaimDisplay } from '@credential/react-components';
import { DidName } from '@credential/react-dids';

interface Props {
  contents: IClaimContents;
  messageLinked?: Message<MessageBody>[];
}

const Details: React.FC<Props> = ({ contents, messageLinked }) => {
  const [active, setActive] = useState<number>(0);
  const sortedMessageLinked = useMemo(
    () => messageLinked?.sort((l, r) => (l.createdAt < r.createdAt ? 1 : -1)),
    [messageLinked]
  );

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
      <Box
        sx={({ palette }) => ({
          background: palette.common.white,
          paddingX: { xs: 2, sm: 4, md: 6, lg: 8 },
          paddingY: { xs: 2, sm: 4 }
        })}
      >
        {active === 0 && (
          <Container maxWidth="sm">
            <ClaimDisplay contents={contents} />
          </Container>
        )}
        {active === 1 &&
          sortedMessageLinked?.map((message) => (
            <Stack
              alignItems="center"
              direction="row"
              key={message.messageId}
              mt={3}
              spacing={{ xs: 1, sm: 2 }}
            >
              <Typography
                sx={({ palette }) => ({
                  flex: '0 0 140px',
                  width: 140,
                  textAlign: 'right',
                  color: palette.grey[600]
                })}
                variant="inherit"
              >
                {moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </Typography>
              <Circle color="primary" sx={{ width: 8, height: 8 }} />
              <Typography sx={{ wordBreak: 'break-all' }}>
                <Box sx={({ palette }) => ({ display: 'inline', color: palette.primary.main })}>
                  <DidName value={message.sender} />
                </Box>{' '}
                {message.body.type}
              </Typography>
            </Stack>
          ))}
      </Box>
    </Box>
  );
};

export default React.memo(Details);

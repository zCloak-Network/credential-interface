import type { IRequestAttestation } from '@kiltprotocol/types';

import { Box, Link, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { Message } from '@credential/app-db/message';
import { CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';

import { MessageCard, MessageCardItem } from './MessageCard';
import MessageType from './MessageType';

function MessageRequestAttestation({ message }: { message: Message<IRequestAttestation> }) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <>
      <MessageCard>
        <MessageCardItem
          content={
            <Box sx={{ width: 200, ...ellipsisMixin() }}>
              {upMd && <span>Claimer: </span>}
              <Link>
                <DidName value={message.sender} />
              </Link>
            </Box>
          }
          label="Claimer"
        />
        <MessageCardItem
          content={
            <Box sx={{ width: 200, ...ellipsisMixin() }}>
              {upMd && <span>Attester: </span>}
              <Link>
                <DidName value={message.receiver} />
              </Link>
            </Box>
          }
          label="Attester"
        />
        <MessageCardItem
          content={
            <Box sx={{ width: 150, ...ellipsisMixin() }}>
              {message.body.content.requestForAttestation.rootHash}
            </Box>
          }
          label="Claim hash"
        />
        <MessageCardItem
          content={
            <CTypeName cTypeHash={message.body.content.requestForAttestation.claim.cTypeHash} />
          }
          label="Credential type"
        />
        <MessageCardItem content={<MessageType message={message} />} label="Type" />
        <MessageCardItem
          content={moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          label="Time"
        />
      </MessageCard>
    </>
  );
}

export default React.memo(MessageRequestAttestation);

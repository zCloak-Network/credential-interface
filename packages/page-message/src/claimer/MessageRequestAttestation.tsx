import type { IRequestAttestation } from '@kiltprotocol/types';

import { Box, Link, TableCell } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { Message } from '@credential/app-db/message';
import { CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';

import MessageRow from './MessageRow';
import Type from './Type';

function MessageRequestAttestation({ message }: { message: Message<IRequestAttestation> }) {
  return (
    <>
      <MessageRow message={message}>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Claimer:{' '}
            <Link>
              <DidName value={message.sender} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Attester:{' '}
            <Link>
              <DidName value={message.receiver} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            {message.body.content.requestForAttestation.rootHash}
          </Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={message.body.content.requestForAttestation.claim.cTypeHash} />
        </TableCell>
        <TableCell>
          <Type type={message.body.type} />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </MessageRow>
    </>
  );
}

export default React.memo(MessageRequestAttestation);

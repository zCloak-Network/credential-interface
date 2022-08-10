import {
  IRequestAttestation,
  ISubmitCredential,
  MessageBody,
  MessageBodyType
} from '@kiltprotocol/types';
import {
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, { useCallback, useContext } from 'react';

import { Message } from '@credential/app-db/message';
import { DidsContext } from '@credential/react-dids';
import { useMessages } from '@credential/react-hooks';

import MessageRow from './MessageRow';

const SentMessages: React.FC = () => {
  const { didUri } = useContext(DidsContext);
  const filter = useCallback(
    (message: Message<MessageBody>) =>
      [MessageBodyType.REQUEST_ATTESTATION, MessageBodyType.SUBMIT_CREDENTIAL].includes(
        message.body.type
      ) && didUri === message.sender,
    [didUri]
  );
  const messages = useMessages<IRequestAttestation | ISubmitCredential>(filter);

  return (
    <TableContainer>
      <Table
        sx={({ spacing }) => ({
          borderCollapse: 'separate',

          borderSpacing: `0px ${spacing(2)}`,
          '.MuiTableCell-root': {
            '&:nth-of-type(1)': {
              borderTopLeftRadius: '10px',
              borderBottomLeftRadius: '10px'
            },
            '&:nth-last-of-type(1)': {
              borderTopRightRadius: '10px',
              borderBottomRightRadius: '10px'
            }
          }
        })}
      >
        <TableHead>
          <TableRow
            sx={({ palette }) => ({
              border: 'none',
              background: alpha(palette.primary.main, 0.1)
            })}
          >
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>Claim hash</TableCell>
            <TableCell>Credential type</TableCell>
            <TableCell>Attester</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {messages?.map((message) => (
            <MessageRow key={message.messageId} message={message} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(SentMessages);

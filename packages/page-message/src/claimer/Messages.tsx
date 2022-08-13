import {
  IAcceptCredential,
  IRejectAttestation,
  IRejectCredential,
  IRequestAttestation,
  ISubmitAttestation,
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
import React from 'react';

import { Message } from '@credential/app-db/message';

import MessageAcceptCredential from './MessageAcceptCredential';
import MessageRejectAttestation from './MessageRejectAttestation';
import MessageRejectCredential from './MessageRejectCredential';
import MessageRequestAttestation from './MessageRequestAttestation';
import MessageSubmitAttestation from './MessageSubmitAttestation';
import MessageSubmitCredential from './MessageSubmitCredential';

function Messages({ messages }: { messages?: Message<MessageBody>[] }) {
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
            <TableCell>Sender</TableCell>
            <TableCell>Receiver</TableCell>
            <TableCell>Claim hash</TableCell>
            <TableCell>Credential type</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody
          sx={({ palette }) => ({
            'MuiTableRow-hover:hover': {
              backgroundColor: palette.common.white
            },
            '.MuiTableRow-root': {
              border: 'none',
              background: palette.background.paper,
              ':hover': {
                border: '1px solid',
                borderColor: palette.grey[200],
                boxShadow: '0px 6px 20px rgba(153, 155, 168, 0.1)',
                background: palette.common.white
              },

              '.MuiTableCell-root': {
                height: 76
              }
            }
          })}
        >
          {messages?.map((message) => {
            if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
              return (
                <MessageRequestAttestation
                  key={message.messageId}
                  message={message as Message<IRequestAttestation>}
                />
              );
            }

            if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
              return (
                <MessageSubmitAttestation
                  key={message.messageId}
                  message={message as Message<ISubmitAttestation>}
                />
              );
            }

            if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
              return (
                <MessageRejectAttestation
                  key={message.messageId}
                  message={message as Message<IRejectAttestation>}
                />
              );
            }

            if (message.body.type === MessageBodyType.SUBMIT_CREDENTIAL) {
              return (
                <MessageSubmitCredential
                  key={message.messageId}
                  message={message as Message<ISubmitCredential>}
                />
              );
            }

            if (message.body.type === MessageBodyType.ACCEPT_CREDENTIAL) {
              return (
                <MessageAcceptCredential
                  key={message.messageId}
                  message={message as Message<IAcceptCredential>}
                />
              );
            }

            if (message.body.type === MessageBodyType.REJECT_CREDENTIAL) {
              return (
                <MessageRejectCredential
                  key={message.messageId}
                  message={message as Message<IRejectCredential>}
                />
              );
            }

            return null;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default React.memo(Messages);

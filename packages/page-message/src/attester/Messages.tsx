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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';

import { Message } from '@credential/app-db/message';

import MessageAcceptCredential from '../messages/MessageAcceptCredential';
import MessageRejectAttestation from '../messages/MessageRejectAttestation';
import MessageRejectCredential from '../messages/MessageRejectCredential';
import MessageRequestAttestation from '../messages/MessageRequestAttestation';
import MessageSubmitAttestation from '../messages/MessageSubmitAttestation';
import MessageSubmitCredential from '../messages/MessageSubmitCredential';

const Messages: React.FC<{
  messages?: Message<MessageBody>[];
}> = ({ messages }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Sender</TableCell>
            <TableCell>Receiver</TableCell>
            <TableCell>Claim hash</TableCell>
            <TableCell>Credential type</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
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
};

export default React.memo(Messages);

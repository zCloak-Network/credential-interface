import { ISubmitCredential } from '@kiltprotocol/types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';

import { Message } from '@credential/app-db/message';

import MessageRow from './MessageRow';

const Messages: React.FC<{
  messages?: Message<ISubmitCredential>[];
}> = ({ messages }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>From</TableCell>
            <TableCell>Claim hash</TableCell>
            <TableCell>Credential type</TableCell>
            <TableCell>Attester</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Time</TableCell>
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

export default React.memo(Messages);

import { MessageBodyType } from '@kiltprotocol/types';
import {
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, { useContext, useMemo } from 'react';

import { AppContext, useClaimer } from '@credential/react-components';
import { useMessages } from '@credential/react-hooks';

import MessageRow from './MessageRow';

const ReceivedMessages: React.FC = () => {
  const { db } = useContext(AppContext);
  const { claimer } = useClaimer();
  const filter = useMemo(
    () => ({
      receiver: claimer.didDetails.uri,
      bodyTypes: [MessageBodyType.SUBMIT_ATTESTATION, MessageBodyType.REJECT_ATTESTATION]
    }),
    [claimer.didDetails.uri]
  );
  const messages = useMessages(db, filter);

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
            <MessageRow key={message.id} message={message as any} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default React.memo(ReceivedMessages);

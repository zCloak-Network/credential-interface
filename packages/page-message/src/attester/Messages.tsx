import { MessageBody } from '@kiltprotocol/types';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';

import { Message } from '@credential/app-db/message';

import MessageRow from '../messages/MessageRow';

const Messages: React.FC<{
  messages?: Message<MessageBody>[];
}> = ({ messages }) => {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));

  if (upMd) {
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
            {messages?.map((message) => (
              <MessageRow key={message.messageId} message={message} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Grid
      columns={{ xs: 8 }}
      container
      spacing={3}
      sx={({ palette }) => ({
        '.Message_Card': {
          background: palette.background.paper,
          border: '1px solid',
          borderColor: palette.grey[200],
          boxShadow: '0px 3px 6px rgba(153,155,168,0.1)',
          borderRadius: '5px'
        }
      })}
    >
      {messages?.map((message) => (
        <Grid key={message.messageId} sm={4} xs={8}>
          <MessageRow message={message} />
        </Grid>
      ))}
    </Grid>
  );
};

export default React.memo(Messages);

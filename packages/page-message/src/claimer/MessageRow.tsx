import type {
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation,
  ISubmitCredential
} from '@kiltprotocol/types';

import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { Message } from '@credential/app-db/message';
import { CredentialModal, CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import { useParsedMessage } from './useParsedMessage';

const MessageRow: React.FC<{
  message: Message & {
    body: ISubmitAttestation | IRejectAttestation | IRequestAttestation | ISubmitCredential;
  };
}> = ({ message }) => {
  const [open, toggleOpen] = useToggle();
  const { credential, ctypeHash, rootHash, status } = useParsedMessage(message);

  return (
    <>
      <TableRow
        onClick={() => {
          toggleOpen();
          endpoint.db.readMessage(message.messageId);
        }}
        sx={({ palette }) => ({
          border: 'none',
          background: palette.background.paper,
          ':hover': {
            border: '1px solid',
            borderColor: palette.grey[200],
            boxShadow: '0px 6px 20px rgba(153, 155, 168, 0.1)'
          },

          '.MuiTableCell-root': {
            height: 76
          }
        })}
      >
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.sender} />
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>{rootHash}</Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={ctypeHash} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.receiver} />
          </Box>
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
        <TableCell>
          <CredentialStatus
            revoked={credential?.attestation.revoked}
            role="claimer"
            showText
            status={status}
          />
        </TableCell>
      </TableRow>
      {credential && open && <CredentialModal credential={credential} onClose={toggleOpen} />}
    </>
  );
};

export default React.memo(MessageRow);

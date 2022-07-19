import {
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation,
  MessageBodyType
} from '@kiltprotocol/types';
import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { credentialDb } from '@credential/app-db';
import { Message } from '@credential/app-db/message';
import { CredentialModal, CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useAttestation, useRequest, useToggle } from '@credential/react-hooks';

const MessageRow: React.FC<{
  message: Message & { body: ISubmitAttestation | IRejectAttestation | IRequestAttestation };
}> = ({ message }) => {
  const [open, toggleOpen] = useToggle();

  const rootHash = useMemo(() => {
    return message.body.type === MessageBodyType.SUBMIT_ATTESTATION
      ? message.body.content.attestation.claimHash
      : message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.rootHash
      : message.body.content;
  }, [message.body.content, message.body.type]);
  const cTypeHash = useMemo(() => {
    return message.body.type === MessageBodyType.SUBMIT_ATTESTATION
      ? message.body.content.attestation.cTypeHash
      : message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.claim.cTypeHash
      : null;
  }, [message]);
  const request = useRequest(credentialDb, rootHash);
  const attestation = useAttestation(rootHash);

  const credential = useMemo(
    () => (attestation && request ? { request, attestation } : null),
    [attestation, request]
  );

  return (
    <>
      <TableRow
        onClick={() => {
          toggleOpen();
          credentialDb.readMessage(message.messageId);
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
          <Box sx={{ width: 150, ...ellipsisMixin() }}>{request?.rootHash ?? rootHash}</Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={request?.claim.cTypeHash ?? cTypeHash} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.receiver} />
          </Box>
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
        <TableCell>
          <CredentialStatus
            revoked={attestation?.revoked}
            role="claimer"
            showText
            status={request?.status}
          />
        </TableCell>
      </TableRow>
      {credential && open && <CredentialModal credential={credential} onClose={toggleOpen} />}
    </>
  );
};

export default React.memo(MessageRow);

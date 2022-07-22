import { IRequestAttestation, ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';
import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { Message } from '@credential/app-db/message';
import { CredentialModal, CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useCredential, useToggle } from '@credential/react-hooks';

const MessageRow: React.FC<{
  message: Message & { body: IRequestAttestation | ISubmitCredential };
}> = ({ message }) => {
  const [credentialOpen, toggleCredential] = useToggle();
  const rootHash = useMemo(() => {
    return message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.rootHash
      : message.body.content[0].request.rootHash;
  }, [message.body.content, message.body.type]);

  const { attestation, request } = useCredential(endpoint.db, rootHash);

  const credential = useMemo(
    () => (request && attestation ? { request, attestation } : null),
    [attestation, request]
  );

  const handleClick = useCallback(() => {
    credential && toggleCredential();
    endpoint.db.readMessage(message.messageId);
  }, [credential, message.messageId, toggleCredential]);

  return (
    <>
      <TableRow hover onClick={handleClick}>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.sender} />
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>{request?.rootHash}</Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={request?.claim.cTypeHash} />
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            <DidName value={message.receiver} />
          </Box>
        </TableCell>
        <TableCell>
          <CredentialStatus
            revoked={attestation?.revoked}
            role="attester"
            showText
            status={request?.status}
          />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </TableRow>
      {credentialOpen && credential && (
        <CredentialModal credential={credential} onClose={toggleCredential} />
      )}
    </>
  );
};

export default React.memo(MessageRow);

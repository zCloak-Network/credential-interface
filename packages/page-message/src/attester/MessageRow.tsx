import { IRequestAttestation, ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';
import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';

import { credentialDb } from '@credential/app-db';
import { Message } from '@credential/app-db/message';
import RequestDetails from '@credential/page-tasks/RequestDetails';
import { CredentialModal, CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useAttestation, useRequest, useToggle } from '@credential/react-hooks';

const MessageRow: React.FC<{
  message: Message & { body: IRequestAttestation | ISubmitCredential };
}> = ({ message }) => {
  const [requestOpen, toggleRequest] = useToggle();
  const [credentialOpen, toggleCredential] = useToggle();
  const rootHash = useMemo(() => {
    return message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.rootHash
      : message.body.content[0].request.rootHash;
  }, [message.body.content, message.body.type]);

  const request = useRequest(credentialDb, rootHash);
  const attestation = useAttestation(rootHash);

  const credential = useMemo(
    () => (request && attestation ? { request, attestation } : null),
    [attestation, request]
  );

  const handleClick = useCallback(() => {
    if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
      request && toggleRequest();
    } else {
      credential && toggleCredential();
    }
  }, [credential, message.body.type, request, toggleCredential, toggleRequest]);

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
      {requestOpen && request && (
        <RequestDetails
          attestation={attestation}
          onClose={toggleRequest}
          open={requestOpen}
          request={request}
          showActions={false}
        />
      )}
      {credentialOpen && credential && (
        <CredentialModal credential={credential} onClose={toggleCredential} />
      )}
    </>
  );
};

export default React.memo(MessageRow);

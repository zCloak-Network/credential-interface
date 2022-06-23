import { IRequestAttestation, ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';
import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useContext, useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { RequestForAttestationStatus } from '@credential/app-db/requestForAttestation';
import RequestDetails from '@credential/page-tasks/RequestDetails';
import RequestStatus from '@credential/page-tasks/RequestStatus';
import { AppContext, CTypeName, DidName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useRequest, useToggle } from '@credential/react-hooks';

const MessageRow: React.FC<{
  message: Message & { body: IRequestAttestation | ISubmitCredential };
}> = ({ message }) => {
  const [open, toggleOpen] = useToggle();
  const { db } = useContext(AppContext);
  const rootHash = useMemo(() => {
    return message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.rootHash
      : message.body.content[0].request.rootHash;
  }, [message.body.content, message.body.type]);

  const request = useRequest(db, rootHash);

  return (
    <>
      <TableRow hover onClick={toggleOpen}>
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
            <DidName type="full" value={message.receiver} />
          </Box>
        </TableCell>
        <TableCell>
          <RequestStatus status={request?.status ?? RequestForAttestationStatus.INIT} />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </TableRow>
      {open && request && (
        <RequestDetails onClose={toggleOpen} open={open} request={request} showActions={false} />
      )}
    </>
  );
};

export default React.memo(MessageRow);

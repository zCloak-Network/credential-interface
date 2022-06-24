import { CType } from '@kiltprotocol/sdk-js';
import {
  IRejectAttestation,
  IRequestAttestation,
  ISubmitAttestation,
  MessageBodyType
} from '@kiltprotocol/types';
import { Box, TableCell, TableRow } from '@mui/material';
import moment from 'moment';
import React, { useContext, useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import CredentialModal from '@credential/page-claims/modals/CredentialModal';
import {
  AppContext,
  CredentialStatus,
  CTypeContext,
  CTypeName,
  DidName
} from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useAttestation, useRequest, useToggle } from '@credential/react-hooks';

const MessageRow: React.FC<{
  message: Message & { body: ISubmitAttestation | IRejectAttestation | IRequestAttestation };
}> = ({ message }) => {
  const { db } = useContext(AppContext);
  const { cTypeList } = useContext(CTypeContext);
  const [open, toggleOpen] = useToggle();

  const rootHash = useMemo(() => {
    return message.body.type === MessageBodyType.SUBMIT_ATTESTATION
      ? message.body.content.attestation.claimHash
      : message.body.type === MessageBodyType.REQUEST_ATTESTATION
      ? message.body.content.requestForAttestation.rootHash
      : message.body.content;
  }, [message.body.content, message.body.type]);

  const request = useRequest(db, rootHash);
  const attestation = useAttestation(db, rootHash);
  const cType = useMemo(() => {
    return cTypeList.find(
      (cType) => CType.fromSchema(cType.schema, cType.owner).hash === request?.claim.cTypeHash
    );
  }, [cTypeList, request]);

  return (
    <>
      <TableRow
        onClick={toggleOpen}
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
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
        <TableCell>
          <CredentialStatus
            revoked={attestation?.revoked}
            role="claimer"
            status={request?.status}
          />
        </TableCell>
      </TableRow>
      {cType && request && attestation && (
        <CredentialModal
          cType={cType}
          credential={{ request, attestation }}
          onClose={toggleOpen}
          open={open}
        />
      )}
    </>
  );
};

export default React.memo(MessageRow);

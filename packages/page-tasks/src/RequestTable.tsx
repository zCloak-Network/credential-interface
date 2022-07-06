import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import moment from 'moment';
import React from 'react';

import { credentialDb } from '@credential/app-db';
import { CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useCredentials } from '@credential/react-hooks';

import ActionButton from './ActionButton';

const RequestTable: React.FC = () => {
  const list = useCredentials(credentialDb);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Claimer</TableCell>
            <TableCell>Claim hash</TableCell>
            <TableCell>Credential type</TableCell>
            <TableCell>Approval initiation time</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Operate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list?.map(({ attestation, request }) => (
            <TableRow key={request.rootHash}>
              <TableCell>
                <Box sx={{ width: 200, ...ellipsisMixin() }}>
                  <DidName value={request.claim.owner} />
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 200, ...ellipsisMixin() }}>{request.rootHash}</Box>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 200, ...ellipsisMixin() }}>
                  <CTypeName cTypeHash={request.claim.cTypeHash} />
                </Box>
              </TableCell>
              <TableCell>{moment(request.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              <TableCell>
                <CredentialStatus
                  revoked={attestation?.revoked}
                  role="attester"
                  status={request.status}
                />
              </TableCell>
              <TableCell>
                <ActionButton attestation={attestation} request={request} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;

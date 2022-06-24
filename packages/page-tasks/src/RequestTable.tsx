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
import React, { useContext } from 'react';

import { AppContext, CredentialStatus, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useCredentials } from '@credential/react-hooks';

import ActionButton from './ActionButton';

const RequestTable: React.FC = () => {
  const { db } = useContext(AppContext);
  const list = useCredentials(db);

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
                <Box sx={{ width: 120, ...ellipsisMixin() }}>{request.claim.owner}</Box>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 120, ...ellipsisMixin() }}>{request.rootHash}</Box>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 120, ...ellipsisMixin() }}>
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

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

import { AppContext, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { useRequestForAttestation } from '@credential/react-hooks';

import ActionButton from './ActionButton';
import RequestStatus from './RequestStatus';

const RequestTable: React.FC = () => {
  const { db } = useContext(AppContext);
  const list = useRequestForAttestation(db);

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
          {list?.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Box sx={{ width: 120, ...ellipsisMixin() }}>{item.claim.owner}</Box>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 120, ...ellipsisMixin() }}>{item.rootHash}</Box>
              </TableCell>
              <TableCell>
                <Box sx={{ width: 120, ...ellipsisMixin() }}>
                  <CTypeName cTypeHash={item.claim.cTypeHash} />
                </Box>
              </TableCell>
              <TableCell>{moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              <TableCell>
                <RequestStatus status={item.status} />{' '}
              </TableCell>
              <TableCell>
                <ActionButton request={item} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequestTable;
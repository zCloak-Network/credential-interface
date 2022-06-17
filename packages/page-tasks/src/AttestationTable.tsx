import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Box,
  IconButton,
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

import AttestationStatus from './AttestationStatus';

const AttestationTable: React.FC = () => {
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
          {list?.map((item) => (
            <TableRow key={item.messageId}>
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
              <TableCell>{moment(item.messageCreateAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
              <TableCell>
                <AttestationStatus status={item.status} />{' '}
              </TableCell>
              <TableCell>
                <IconButton>
                  <MoreHorizIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttestationTable;

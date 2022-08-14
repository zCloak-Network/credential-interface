import { type ISubmitCredential } from '@kiltprotocol/types';
import { Box, Link, TableCell } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import MessageRow from './MessageRow';
import MessageType from './MessageType';

function MessageSubmitCredential({ message }: { message: Message<ISubmitCredential> }) {
  const [open, toggleOpen] = useToggle();

  const credential = useMemo(() => message.body.content[0], [message.body.content]);

  return (
    <>
      <MessageRow message={message} onClick={toggleOpen}>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Holder:{' '}
            <Link>
              <DidName value={message.sender} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Verifier:{' '}
            <Link>
              <DidName value={message.receiver} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>{credential.attestation.claimHash}</Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={credential.attestation.cTypeHash} />
        </TableCell>
        <TableCell>
          <MessageType message={message} />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </MessageRow>
      {open && credential && <CredentialModal credential={credential} onClose={toggleOpen} />}
    </>
  );
}

export default React.memo(MessageSubmitCredential);

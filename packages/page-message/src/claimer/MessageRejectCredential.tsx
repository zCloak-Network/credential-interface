import { type IRejectCredential, ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';
import { Box, Link, TableCell } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useReferenceMessages, useToggle } from '@credential/react-hooks';

import MessageRow from './MessageRow';
import Type from './Type';

function MessageRejectCredential({ message }: { message: Message<IRejectCredential> }) {
  const [open, toggleOpen] = useToggle();
  const references = useReferenceMessages(message.references);

  const matchCredential = useMemo((): Message<ISubmitCredential> | undefined => {
    return references.find<Message<ISubmitCredential>>(
      (reference): reference is Message<ISubmitCredential> =>
        reference.body.type === MessageBodyType.SUBMIT_CREDENTIAL &&
        reference.body.content[0].attestation.cTypeHash === message.body.content[0]
    );
  }, [message.body.content, references]);

  return (
    <>
      <MessageRow message={message} onClick={toggleOpen}>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Verifier:{' '}
            <Link>
              <DidName value={message.sender} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Holder:{' '}
            <Link>
              <DidName value={message.receiver} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          {matchCredential && (
            <Box sx={{ width: 150, ...ellipsisMixin() }}>
              {matchCredential.body.content[0].attestation.claimHash}
            </Box>
          )}
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={message.body.content[0]} />
        </TableCell>
        <TableCell>
          <Type type={message.body.type} />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </MessageRow>
      {open && matchCredential && (
        <CredentialModal credential={matchCredential.body.content[0]} onClose={toggleOpen} />
      )}
    </>
  );
}

export default React.memo(MessageRejectCredential);

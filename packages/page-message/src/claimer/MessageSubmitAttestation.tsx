import { type ISubmitAttestation, IRequestAttestation, MessageBodyType } from '@kiltprotocol/types';
import { Box, Link, TableCell } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useReferenceMessages, useToggle } from '@credential/react-hooks';

import MessageRow from './MessageRow';
import MessageType from './MessageType';

function MessageSubmitAttestation({ message }: { message: Message<ISubmitAttestation> }) {
  const references = useReferenceMessages(message.references);
  const [open, toggleOpen] = useToggle();

  const matchRequest = useMemo((): Message<IRequestAttestation> | undefined => {
    return references.find<Message<IRequestAttestation>>(
      (reference): reference is Message<IRequestAttestation> =>
        reference.body.type === MessageBodyType.REQUEST_ATTESTATION &&
        reference.body.content.requestForAttestation.rootHash ===
          message.body.content.attestation.claimHash
    );
  }, [message.body.content.attestation.claimHash, references]);

  const credential = useMemo(
    () =>
      matchRequest
        ? {
            request: matchRequest.body.content.requestForAttestation,
            attestation: message.body.content.attestation
          }
        : null,
    [matchRequest, message.body.content.attestation]
  );

  return (
    <>
      <MessageRow message={message} onClick={toggleOpen}>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Attester:{' '}
            <Link>
              <DidName value={message.sender} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 200, ...ellipsisMixin() }}>
            Claimer:{' '}
            <Link>
              <DidName value={message.receiver} />
            </Link>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ width: 150, ...ellipsisMixin() }}>
            {message.body.content.attestation.claimHash}
          </Box>
        </TableCell>
        <TableCell>
          <CTypeName cTypeHash={message.body.content.attestation.cTypeHash} />
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

export default React.memo(MessageSubmitAttestation);

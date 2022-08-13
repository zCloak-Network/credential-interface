import { type IRejectAttestation, IRequestAttestation, MessageBodyType } from '@kiltprotocol/types';
import { Box, Link, TableCell } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CTypeName } from '@credential/react-components';
import { ellipsisMixin } from '@credential/react-components/utils';
import { DidName } from '@credential/react-dids';
import { useReferenceMessages } from '@credential/react-hooks';

import MessageRow from './MessageRow';
import Type from './Type';

function MessageRejectAttestation({ message }: { message: Message<IRejectAttestation> }) {
  const references = useReferenceMessages(message.references);

  const matchRequest = useMemo((): Message<IRequestAttestation> | undefined => {
    return references.find<Message<IRequestAttestation>>(
      (reference): reference is Message<IRequestAttestation> =>
        reference.body.type === MessageBodyType.REQUEST_ATTESTATION &&
        reference.body.content.requestForAttestation.rootHash === message.body.content
    );
  }, [message.body.content, references]);

  return (
    <>
      <MessageRow message={message}>
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
          <Box sx={{ width: 150, ...ellipsisMixin() }}>{message.body.content}</Box>
        </TableCell>
        <TableCell>
          {matchRequest && (
            <CTypeName
              cTypeHash={matchRequest.body.content.requestForAttestation.claim.cTypeHash}
            />
          )}
        </TableCell>
        <TableCell>
          <Type type={message.body.type} />
        </TableCell>
        <TableCell>{moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
      </MessageRow>
    </>
  );
}

export default React.memo(MessageRejectAttestation);

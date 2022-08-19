import { type IRejectAttestation, IRequestAttestation, MessageBodyType } from '@kiltprotocol/types';
import { Link, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useReferenceMessages } from '@credential/react-hooks';

import { MessageCard, MessageCardItem } from './MessageCard';
import MessageType from './MessageType';

function MessageRejectAttestation({ message }: { message: Message<IRejectAttestation> }) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
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
      <MessageCard>
        <MessageCardItem
          content={
            <>
              {upMd && <span>Attester: </span>}
              <Link>
                <DidName value={message.sender} />
              </Link>
            </>
          }
          label="Attester"
        />
        <MessageCardItem
          content={
            <>
              {upMd && <span>Claimer: </span>}
              <Link>
                <DidName value={message.receiver} />
              </Link>
            </>
          }
          label="Claimer"
        />
        <MessageCardItem content={message.body.content} label="Claim hash" />
        <MessageCardItem
          content={
            matchRequest && (
              <CTypeName
                cTypeHash={matchRequest.body.content.requestForAttestation.claim.cTypeHash}
              />
            )
          }
          label="Credential type"
        />
        <MessageCardItem content={<MessageType message={message} />} label="Type" />
        <MessageCardItem
          content={moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          label="Time"
        />
      </MessageCard>
    </>
  );
}

export default React.memo(MessageRejectAttestation);

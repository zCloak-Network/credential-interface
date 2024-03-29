import { type ISubmitAttestation, IRequestAttestation, MessageBodyType } from '@kiltprotocol/types';
import { Link, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useReferenceMessages, useToggle } from '@credential/react-hooks';

import { MessageCard, MessageCardItem } from './MessageCard';
import MessageType from './MessageType';

function MessageSubmitAttestation({ message }: { message: Message<ISubmitAttestation> }) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
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
      <MessageCard onClick={toggleOpen}>
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
        <MessageCardItem content={message.body.content.attestation.claimHash} label="Claim hash" />
        <MessageCardItem
          content={<CTypeName cTypeHash={message.body.content.attestation.cTypeHash} />}
          label="Credential type"
        />
        <MessageCardItem content={<MessageType message={message} />} label="Type" />
        <MessageCardItem
          content={moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          label="Time"
        />
      </MessageCard>
      {open && credential && <CredentialModal credential={credential} onClose={toggleOpen} />}
    </>
  );
}

export default React.memo(MessageSubmitAttestation);

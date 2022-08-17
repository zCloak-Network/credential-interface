import { type IAcceptCredential, ISubmitCredential, MessageBodyType } from '@kiltprotocol/types';
import { Link, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useReferenceMessages, useToggle } from '@credential/react-hooks';

import { MessageCard, MessageCardItem } from './MessageCard';
import MessageType from './MessageType';

function MessageAcceptCredential({ message }: { message: Message<IAcceptCredential> }) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
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
      <MessageCard onClick={toggleOpen}>
        <MessageCardItem
          content={
            <>
              {upMd && <span>Verifier: </span>}
              <Link>
                <DidName value={message.sender} />
              </Link>
            </>
          }
          label="Verifier"
        />
        <MessageCardItem
          content={
            <>
              {upMd && <span>Holder: </span>}
              <Link>
                <DidName value={message.receiver} />
              </Link>
            </>
          }
          label="Holder"
        />
        <MessageCardItem
          content={matchCredential && matchCredential.body.content[0].attestation.claimHash}
          label="Claim hash"
        />
        <MessageCardItem
          content={matchCredential && <CTypeName cTypeHash={message.body.content[0]} />}
          label="Credential type"
        />
        <MessageCardItem content={<MessageType message={message} />} label="Type" />
        <MessageCardItem
          content={moment(message.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          label="Time"
        />
      </MessageCard>
      {open && matchCredential && (
        <CredentialModal credential={matchCredential.body.content[0]} onClose={toggleOpen} />
      )}
    </>
  );
}

export default React.memo(MessageAcceptCredential);

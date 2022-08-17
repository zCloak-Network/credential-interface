import type {
  IAcceptCredential,
  IRejectAttestation,
  IRejectCredential,
  IRequestAttestation,
  ISubmitAttestation,
  ISubmitCredential,
  MessageBody
} from '@kiltprotocol/types';

import { MessageBodyType } from '@kiltprotocol/types';
import React from 'react';

import { Message } from '@credential/app-db/message';

import MessageAcceptCredential from './MessageAcceptCredential';
import MessageRejectAttestation from './MessageRejectAttestation';
import MessageRejectCredential from './MessageRejectCredential';
import MessageRequestAttestation from './MessageRequestAttestation';
import MessageSubmitAttestation from './MessageSubmitAttestation';
import MessageSubmitCredential from './MessageSubmitCredential';

function MessageRow({ message }: { message: Message<MessageBody> }) {
  if (message.body.type === MessageBodyType.REQUEST_ATTESTATION) {
    return (
      <MessageRequestAttestation
        key={message.messageId}
        message={message as Message<IRequestAttestation>}
      />
    );
  }

  if (message.body.type === MessageBodyType.SUBMIT_ATTESTATION) {
    return (
      <MessageSubmitAttestation
        key={message.messageId}
        message={message as Message<ISubmitAttestation>}
      />
    );
  }

  if (message.body.type === MessageBodyType.REJECT_ATTESTATION) {
    return (
      <MessageRejectAttestation
        key={message.messageId}
        message={message as Message<IRejectAttestation>}
      />
    );
  }

  if (message.body.type === MessageBodyType.SUBMIT_CREDENTIAL) {
    return (
      <MessageSubmitCredential
        key={message.messageId}
        message={message as Message<ISubmitCredential>}
      />
    );
  }

  if (message.body.type === MessageBodyType.ACCEPT_CREDENTIAL) {
    return (
      <MessageAcceptCredential
        key={message.messageId}
        message={message as Message<IAcceptCredential>}
      />
    );
  }

  if (message.body.type === MessageBodyType.REJECT_CREDENTIAL) {
    return (
      <MessageRejectCredential
        key={message.messageId}
        message={message as Message<IRejectCredential>}
      />
    );
  }

  return null;
}

export default React.memo(MessageRow);

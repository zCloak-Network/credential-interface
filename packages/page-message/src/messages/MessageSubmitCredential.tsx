import { type ISubmitCredential } from '@kiltprotocol/types';
import { Link, useMediaQuery, useTheme } from '@mui/material';
import moment from 'moment';
import React, { useMemo } from 'react';

import { Message } from '@credential/app-db/message';
import { CredentialModal, CTypeName } from '@credential/react-components';
import { DidName } from '@credential/react-dids';
import { useToggle } from '@credential/react-hooks';

import { MessageCard, MessageCardItem } from './MessageCard';
import MessageType from './MessageType';

function MessageSubmitCredential({ message }: { message: Message<ISubmitCredential> }) {
  const theme = useTheme();
  const upMd = useMediaQuery(theme.breakpoints.up('md'));
  const [open, toggleOpen] = useToggle();

  const credential = useMemo(() => message.body.content[0], [message.body.content]);

  return (
    <>
      <MessageCard onClick={toggleOpen}>
        <MessageCardItem
          content={
            <>
              {upMd && <span>Holder: </span>}
              <Link>
                <DidName value={message.sender} />
              </Link>
            </>
          }
          label="Holder"
        />
        <MessageCardItem
          content={
            <>
              {upMd && <span>Verifier: </span>}
              <Link>
                <DidName value={message.receiver} />
              </Link>
            </>
          }
          label="Verifier"
        />
        <MessageCardItem content={credential.attestation.claimHash} label="Claim hash" />
        <MessageCardItem
          content={<CTypeName cTypeHash={credential.attestation.cTypeHash} />}
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

export default React.memo(MessageSubmitCredential);

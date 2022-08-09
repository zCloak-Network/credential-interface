import type { IMessage, IRequestAttestation } from '@kiltprotocol/types';

import { Attestation, Did, IEncryptedMessage, Message as MessageKilt } from '@kiltprotocol/sdk-js';
import { alpha, Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Message } from '@credential/app-db/message';
import { AppContext, Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage, signAndSend, Steps } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import IconApprove from '../icons/icon_approve.svg';

const Approve: React.FC<{
  type?: 'button' | 'menu';
  request: Message<IRequestAttestation>;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request, type = 'button' }) => {
  const [open, toggleOpen] = useToggle();
  const { fetcher } = useContext(AppContext);
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const { keyring } = useKeystore();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const attestation = useMemo(
    () =>
      didUri
        ? Attestation.fromRequestAndDid(request.body.content.requestForAttestation, didUri)
        : null,
    [didUri, request]
  );

  const getExtrinsic = useCallback(async () => {
    if (!attestation) {
      throw new Error('no attestation found');
    }

    if (!(attester instanceof Did.FullDidDetails)) {
      throw new Error('The DID with the given identifier is not on chain.');
    }

    const tx = await attestation.getStoreTx();
    const extrinsic = await attester.authorizeExtrinsic(tx, keyring, attester.identifier);

    return extrinsic;
  }, [attestation, attester, keyring]);

  const message = useMemo(() => {
    if (!didUri) {
      return null;
    }

    if (!attestation) {
      return null;
    }

    const message = new MessageKilt(
      {
        content: { attestation },
        type: MessageKilt.BodyType.SUBMIT_ATTESTATION
      },
      didUri,
      request.body.content.requestForAttestation.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [attestation, didUri, messageLinked, request.body.content.requestForAttestation.claim.owner]);

  const claimer = useDidDetails(request.body.content.requestForAttestation.claim.owner);

  return (
    <>
      {type === 'button' ? (
        <Button
          onClick={toggleOpen}
          startIcon={<IconApprove />}
          sx={({ palette }) => ({
            background: alpha(palette.success.main, 0.1),
            borderColor: palette.success.main,
            color: palette.success.main,
            ':hover': {
              borderColor: palette.success.main
            }
          })}
          variant="outlined"
        >
          Approve
        </Button>
      ) : (
        <MenuItem onClick={toggleOpen} sx={({ palette }) => ({ color: palette.success.main })}>
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconApprove />
          </ListItemIcon>
          <ListItemText>Approve</ListItemText>
        </MenuItem>
      )}
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={toggleOpen}
            steps={[
              {
                label: 'Sign and submit attestation',
                paused: true,
                exec: (report) =>
                  signAndSend(report, keyring, attester?.authenticationKey.publicKey, getExtrinsic)
              },
              {
                label: 'Encrypt message',
                exec: () =>
                  encryptMessage(keyring, message, attester, claimer).then(setEncryptedMessage)
              },
              {
                label: 'Send message',
                paused: true,
                content: <Recaptcha onCallback={setRecaptchaToken} />,
                exec: () => sendMessage(fetcher, encryptedMessage, recaptchaToken, message)
              }
            ]}
          />
        }
        title="Approve the request"
      />
    </>
  );
};

export default React.memo(Approve);

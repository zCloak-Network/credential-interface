import type {
  IAttestation,
  IEncryptedMessage,
  IMessage,
  IRequestAttestation
} from '@kiltprotocol/types';

import { Attestation, Did, Message as MessageKilt } from '@kiltprotocol/sdk-js';
import { alpha, Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { Message } from '@credential/app-db/message';
import { AppContext, Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage, signAndSend, Steps } from '@credential/react-dids/steps';
import { useStopPropagation, useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import IconRevoke from '../icons/icon_revok.svg';

const Revoke: React.FC<{
  type?: 'button' | 'menu';
  request: Message<IRequestAttestation>;
  attestation: IAttestation;
  messageLinked?: IMessage[];
}> = ({ attestation: _attestation, messageLinked, request, type = 'button' }) => {
  const [open, toggleOpen] = useToggle();
  const { fetcher } = useContext(AppContext);
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const { keyring } = useKeystore();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const attestation = useMemo(() => {
    if (didUri) {
      const attestation = Attestation.fromAttestation(_attestation);

      attestation.revoked = true;

      return attestation;
    } else {
      return null;
    }
  }, [_attestation, didUri]);

  const getExtrinsic = useCallback(async () => {
    if (!attestation) {
      throw new Error('no attestation found');
    }

    if (!(attester instanceof Did.FullDidDetails)) {
      throw new Error('The DID with the given identifier is not on chain.');
    }

    const tx = await attestation.getRevokeTx(0);
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
  const _toggleOpen = useStopPropagation(toggleOpen);

  return (
    <>
      {type === 'button' ? (
        <Button
          onClick={_toggleOpen}
          startIcon={<IconRevoke />}
          sx={({ palette }) => ({
            background: alpha(palette.error.main, 0),
            borderColor: palette.error.main,
            color: palette.error.main,
            ':hover': {
              borderColor: palette.error.main
            }
          })}
          variant="outlined"
        >
          Revoke
        </Button>
      ) : (
        <MenuItem onClick={_toggleOpen} sx={({ palette }) => ({ color: palette.error.main })}>
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconRevoke />
          </ListItemIcon>
          <ListItemText>Revoke</ListItemText>
        </MenuItem>
      )}
      <DidsModal
        onClose={_toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={_toggleOpen}
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
            submitText="Revoke"
          />
        }
        title="Approve the request"
      />
    </>
  );
};

export default React.memo(Revoke);

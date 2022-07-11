import type { IAttestation, IEncryptedMessage, IMessage } from '@kiltprotocol/types';

import type { Request } from '@credential/react-hooks/types';

import { Attestation, Did, Message } from '@kiltprotocol/sdk-js';
import { alpha, Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { credentialDb } from '@credential/app-db';
import { DidsContext, DidsModal, useDidDetails } from '@credential/react-dids';
import { encryptMessage, sendMessage, signAndSend } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

import IconRevoke from '../icons/icon_revok.svg';

const Revoke: React.FC<{
  type?: 'button' | 'menu';
  request: Request;
  attestation: IAttestation;
  messageLinked?: IMessage[];
}> = ({ attestation: _attestation, messageLinked, request, type }) => {
  const [open, toggleOpen] = useToggle();
  const { didUri } = useContext(DidsContext);
  const attester = useDidDetails(didUri);
  const { keyring } = useKeystore();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();

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

    const message = new Message(
      {
        content: { attestation },
        type: Message.BodyType.SUBMIT_ATTESTATION
      },
      didUri,
      request.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [attestation, didUri, messageLinked, request.claim.owner]);

  const claimer = useDidDetails(request.claim.owner);

  const onDone = useCallback(() => {
    if (message) {
      credentialDb.message.add({ ...message, deal: 0, isRead: 1 });
    }

    toggleOpen();
  }, [message, toggleOpen]);

  return (
    <>
      {type === 'button' ? (
        <Button
          onClick={toggleOpen}
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
        <MenuItem onClick={toggleOpen} sx={({ palette }) => ({ color: palette.error.main })}>
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconRevoke />
          </ListItemIcon>
          <ListItemText>Revoke</ListItemText>
        </MenuItem>
      )}
      <DidsModal
        onClose={toggleOpen}
        onDone={onDone}
        open={open}
        steps={[
          {
            label: 'Sign and submit attestation',
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
            exec: () => sendMessage(encryptedMessage)
          }
        ]}
        submitText="Revoke"
        title="Approve the request"
      />
    </>
  );
};

export default React.memo(Revoke);

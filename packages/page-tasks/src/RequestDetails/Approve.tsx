import type { IMessage, IRequestAttestation } from '@kiltprotocol/types';

import { Attestation, Did, IEncryptedMessage, Message as MessageKilt } from '@kiltprotocol/sdk-js';
import { alpha, Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { IconApprove } from '@credential/app-config/icons';
import { Message } from '@credential/app-db/message';
import { AppContext, Recaptcha } from '@credential/react-components';
import { DidsModal, useDerivedDid, useDidDetails } from '@credential/react-dids';
import { didManager } from '@credential/react-dids/initManager';
import { encryptMessage, sendMessage, signAndSend, Steps } from '@credential/react-dids/steps';
import { useStopPropagation, useToggle } from '@credential/react-hooks';

const Approve: React.FC<{
  type?: 'button' | 'menu';
  request: Message<IRequestAttestation>;
  messageLinked?: IMessage[];
}> = ({ messageLinked, request, type = 'button' }) => {
  const [open, toggleOpen] = useToggle();
  const { fetcher } = useContext(AppContext);
  const attester = useDerivedDid();
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const attestation = useMemo(
    () =>
      attester
        ? Attestation.fromRequestAndDid(request.body.content.requestForAttestation, attester.uri)
        : null,
    [attester, request]
  );

  const getExtrinsic = useCallback(async () => {
    if (!attestation) {
      throw new Error('no attestation found');
    }

    if (!(attester instanceof Did.FullDidDetails)) {
      throw new Error('The DID with the given identifier is not on chain.');
    }

    const tx = await attestation.getStoreTx();
    const extrinsic = await attester.authorizeExtrinsic(tx, didManager, attester.identifier);

    return extrinsic;
  }, [attestation, attester]);

  const message = useMemo(() => {
    if (!attester) {
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
      attester.uri,
      request.body.content.requestForAttestation.claim.owner
    );

    message.references = messageLinked?.map((message) => message.messageId);

    return message;
  }, [
    attestation,
    attester,
    messageLinked,
    request.body.content.requestForAttestation.claim.owner
  ]);

  const claimer = useDidDetails(request.body.content.requestForAttestation.claim.owner);

  const _toggleOpen = useStopPropagation(toggleOpen);

  return (
    <>
      {type === 'button' ? (
        <Button
          onClick={_toggleOpen}
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
        <MenuItem onClick={_toggleOpen} sx={({ palette }) => ({ color: palette.success.main })}>
          <ListItemIcon sx={{ minWidth: '0px !important', marginRight: 1 }}>
            <IconApprove color="success" />
          </ListItemIcon>
          <ListItemText>Approve</ListItemText>
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
                  signAndSend(
                    report,
                    didManager,
                    attester?.authenticationKey.publicKey,
                    getExtrinsic
                  )
              },
              {
                label: 'Encrypt message',
                exec: () =>
                  encryptMessage(didManager, message, attester, claimer).then(setEncryptedMessage)
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

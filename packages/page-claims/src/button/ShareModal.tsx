import { Credential, Did, ICredential, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import { Box, Button, Checkbox, FormControlLabel, lighten, Paper, Stack } from '@mui/material';
import React, { useContext, useMemo, useState } from 'react';

import { AppContext, Recaptcha } from '@credential/react-components';
import { DidsModal, InputDid, useDerivedDid } from '@credential/react-dids';
import { didManager } from '@credential/react-dids/initManager';
import { encryptMessage, sendMessage, Steps } from '@credential/react-dids/steps';

const ShareModal: React.FC<{ credential: ICredential; open: boolean; onClose?: () => void }> = ({
  credential,
  onClose,
  open
}) => {
  const { fetcher } = useContext(AppContext);
  const [receiver, setReceiver] = useState<Did.DidDetails | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const sender = useDerivedDid();

  const attributes = useMemo(
    () => Array.from(Credential.fromCredential(credential).getAttributes().keys()),
    [credential]
  );
  const [selectedAttributes, setSelectAttributes] = useState<string[]>(attributes);
  const [presentation, setPresentation] = useState<ICredential | null>(null);

  const message = useMemo(
    () =>
      sender && receiver && presentation
        ? new Message(
            {
              content: [presentation],
              type: Message.BodyType.SUBMIT_CREDENTIAL
            },
            sender.uri,
            receiver.uri
          )
        : null,
    [presentation, receiver, sender]
  );

  return (
    <DidsModal
      onClose={onClose}
      open={open}
      steps={
        message ? (
          <Steps
            onDone={onClose}
            steps={[
              {
                label: 'Encrypt message',
                exec: () =>
                  encryptMessage(didManager, message, sender, receiver).then(setEncryptedMessage)
              },
              {
                label: 'Send message',
                paused: true,
                content: <Recaptcha onCallback={setRecaptchaToken} />,
                exec: () => sendMessage(fetcher, encryptedMessage, recaptchaToken, message)
              }
            ]}
            submitText="Share"
          />
        ) : null
      }
      title="Share this with others"
    >
      <Stack spacing={3}>
        <InputDid
          inputProps={{
            sx: ({ palette }) => ({
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'transparent'
              },
              border: 'none',
              background: lighten(palette.primary.main, 0.94)
            })
          }}
          onChange={setReceiver}
        />
        <Paper sx={{ height: 225, overflowY: 'scroll' }} variant="outlined">
          {attributes.map((key) => (
            <Box
              key={key}
              sx={({ palette }) => ({
                borderBottom: '1px solid',
                borderColor: palette.divider,
                height: 75,
                display: 'flex',
                alignItems: 'center',
                paddingX: 3
              })}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedAttributes.includes(key)}
                    onChange={() =>
                      selectedAttributes.includes(key)
                        ? setSelectAttributes((attributes) =>
                            attributes.filter((attribute) => attribute !== key)
                          )
                        : setSelectAttributes((attributes) => [...attributes, key])
                    }
                  />
                }
                label={key}
              />
            </Box>
          ))}
        </Paper>
        <Button
          disabled={!sender || !receiver}
          fullWidth
          onClick={() => {
            if (sender) {
              Credential.fromCredential(credential)
                .createPresentation({ selectedAttributes, signer: didManager, claimerDid: sender })
                .then(setPresentation);
            }
          }}
          variant="contained"
        >
          Share
        </Button>
      </Stack>
    </DidsModal>
  );
};

export default React.memo(ShareModal);

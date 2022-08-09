import { Credential, Did, ICredential, IEncryptedMessage, Message } from '@kiltprotocol/sdk-js';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  lighten,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@mui/material';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { IconForward } from '@credential/app-config/icons';
import { AppContext, Recaptcha } from '@credential/react-components';
import { DidsContext, DidsModal, InputDid } from '@credential/react-dids';
import { encryptMessage, sendMessage, Steps } from '@credential/react-dids/steps';
import { useToggle } from '@credential/react-hooks';
import { useKeystore } from '@credential/react-keystore';

const ShareButton: React.FC<{ credential: ICredential; withText?: boolean }> = ({
  credential,
  withText = false
}) => {
  const { keyring } = useKeystore();
  const { didDetails: sender } = useContext(DidsContext);
  const { fetcher } = useContext(AppContext);
  const [open, toggleOpen] = useToggle();
  const [receiver, setReceiver] = useState<Did.FullDidDetails | null>(null);
  const [encryptedMessage, setEncryptedMessage] = useState<IEncryptedMessage>();
  const [recaptchaToken, setRecaptchaToken] = useState<string>();

  const attributes = useMemo(
    () => Array.from(Credential.fromCredential(credential).getAttributes().keys()),
    [credential]
  );
  const [selectedAttributes, setSelectAttributes] = useState<string[]>(attributes);
  const [presentation, setPresentation] = useState<ICredential | null>(null);

  const _toggleOpen: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.stopPropagation();
      toggleOpen();
    },
    [toggleOpen]
  );

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
    <>
      <Tooltip title="Share to other">
        <Stack alignItems="center">
          <IconButton onClick={_toggleOpen}>
            <IconForward />
          </IconButton>
          {withText && (
            <Typography sx={({ palette }) => ({ color: palette.common.white })} variant="inherit">
              Share
            </Typography>
          )}
        </Stack>
      </Tooltip>
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          message ? (
            <Steps
              onDone={toggleOpen}
              steps={[
                {
                  label: 'Encrypt message',
                  exec: () =>
                    encryptMessage(keyring, message, sender, receiver).then(setEncryptedMessage)
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
            disabled={!sender}
            fullWidth
            onClick={() => {
              if (sender) {
                Credential.fromCredential(credential)
                  .createPresentation({ selectedAttributes, signer: keyring, claimerDid: sender })
                  .then(setPresentation);
              }
            }}
            variant="contained"
          >
            Share
          </Button>
        </Stack>
      </DidsModal>
    </>
  );
};

export default React.memo(ShareButton);

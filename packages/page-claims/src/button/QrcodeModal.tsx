import { Credential, ICredential } from '@kiltprotocol/sdk-js';
import { Box, Button, Checkbox, FormControlLabel, Paper, Stack, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';

import { CredentialQrcode } from '@credential/react-components';
import { DidsModal, useDerivedDid } from '@credential/react-dids';
import { didManager } from '@credential/react-dids/initManager';

const QrcodeModal: React.FC<{ credential: ICredential; open: boolean; onClose?: () => void }> = ({
  credential,
  onClose,
  open
}) => {
  const sender = useDerivedDid();
  const attributes = useMemo(
    () => Array.from(Credential.fromCredential(credential).getAttributes().keys()),
    [credential]
  );
  const [selectedAttributes, setSelectAttributes] = useState<string[]>(attributes);
  const [presentation, setPresentation] = useState<ICredential | null>(null);

  return (
    <DidsModal
      onClose={onClose}
      open={open}
      title={presentation ? 'Your credential' : 'Selective disclosure'}
    >
      {presentation ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            '.CredentialQrcode > img': {
              width: { xs: 240, sm: 300, md: 360 },
              height: { xs: 240, sm: 300, md: 360 }
            }
          }}
        >
          <Typography
            sx={({ palette }) => ({
              color: palette.grey[700],
              marginBottom: 5,
              textAlign: 'center'
            })}
            variant="inherit"
          >
            This QR code contains the credential info you are about to share, please use it with
            care.
          </Typography>
          <CredentialQrcode credential={presentation} />
        </Box>
      ) : (
        <Stack spacing={3}>
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
                  .createPresentation({
                    selectedAttributes,
                    signer: didManager,
                    claimerDid: sender
                  })
                  .then(setPresentation);
              }
            }}
            variant="contained"
          >
            Generate QR code
          </Button>
        </Stack>
      )}
    </DidsModal>
  );
};

export default React.memo(QrcodeModal);

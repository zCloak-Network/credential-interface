import { Credential } from '@kiltprotocol/sdk-js';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';

import { endpoint } from '@credential/app-config/endpoints';
import { CredentialSource } from '@credential/app-db/credential';
import { AppContext, DialogHeader } from '@credential/react-components';
import { useDerivedDid } from '@credential/react-dids';

import FileUpload from './FileUpload';

const ImportCredentialModal: React.FC<{ open: boolean; onClose?: () => void }> = ({
  onClose,
  open
}) => {
  const { fetcher } = useContext(AppContext);
  const [value, setValue] = useState<File[]>([]);
  const did = useDerivedDid();
  const [result, setResult] = useState<
    { error: null; credential: Credential } | { error: Error; credential: null }
  >();

  useEffect(() => {
    if (value.length > 0) {
      value[0]
        .text()
        .then((text) => {
          return JSON.parse(text);
        })
        .then((json) => {
          if (!Credential.isICredential(json)) throw new Error('not a valid credential file');

          return Credential.fromCredential(json);
        })
        .then(async (credential) => {
          const verifiedData = credential.verifyData();
          const verifiedAttestation = await credential.attestation.checkValidity();
          const verifiedOwn = credential.request.claim.owner === did?.uri;

          if (verifiedData && verifiedAttestation && verifiedOwn) {
            setResult({ error: null, credential });
          } else if (!verifiedData) {
            throw new Error('Verify data error. Import denied.');
          } else if (!verifiedAttestation) {
            throw new Error('Attestation is not validity. Import denied.');
          } else {
            throw new Error('This credential is not yours. Import denied.');
          }
        })
        .catch((error) => {
          setResult({ error, credential: null });
        });
    }
  }, [did, value]);

  return (
    <Dialog maxWidth="sm" onClose={onClose} open={open}>
      {!result && <DialogHeader onClose={onClose}>Import credential type</DialogHeader>}
      <DialogContent sx={{ width: 500, maxWidth: '100%' }}>
        {result ? (
          <Stack alignItems="center" spacing={2}>
            {result.error ? (
              <>
                <ErrorIcon color="warning" sx={{ width: 50, height: 50 }} />
                <Typography variant="h5">Import denied</Typography>
                <Typography color="grey.700" variant="inherit">
                  {result.error.message}
                </Typography>
                <Button
                  onClick={() => {
                    setValue([]);
                    setResult(undefined);
                  }}
                  size="large"
                  variant="contained"
                >
                  Reimport
                </Button>
              </>
            ) : (
              <>
                <CheckCircleIcon color="primary" sx={{ width: 50, height: 50 }} />
                <Typography variant="h5">Import successful</Typography>
                <Button
                  onClick={() => {
                    fetcher?.write.credential.put({
                      ...result.credential,
                      rootHash: result.credential.request.rootHash,
                      owner: result.credential.request.claim.owner,
                      attester: result.credential.attestation.owner,
                      ctypeHash: result.credential.attestation.cTypeHash,
                      updateTime: Date.now(),
                      source: endpoint.name as CredentialSource,
                      version: 0
                    });
                    onClose?.();
                  }}
                  size="large"
                  variant="contained"
                >
                  Confirm
                </Button>
              </>
            )}
          </Stack>
        ) : (
          <FileUpload onChange={setValue} value={value} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(ImportCredentialModal);

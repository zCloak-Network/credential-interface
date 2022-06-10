import type { ICTypeMetadata } from '@credential/react-components/CTypeProvider/types';

import { type IClaim, CType, Did, Message } from '@kiltprotocol/sdk-js';
import { FormControl, InputLabel, Typography } from '@mui/material';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  CredentialContenxt,
  FullScreenDialog,
  FullScreenDialogContent,
  FullScreenDialogHeader,
  PasswordInput,
  useClaimer
} from '@credential/react-components';
import { CTypeForm } from '@credential/react-ctype';
import { useToggle } from '@credential/react-hooks';
import { credentialApi } from '@credential/react-hooks/api';

const CreateClaim: React.FC = () => {
  const { claimer } = useClaimer();
  const [open, toggleOpen] = useToggle();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [cType, setCType] = useState<CType>();
  const [password, setPassword] = useState('');
  const { addCredential } = useContext(CredentialContenxt);

  const onClose = useCallback(() => {
    toggleOpen();
    navigate('', { state: null });
  }, [navigate, toggleOpen]);

  const onGenerateClaim = useCallback(
    async (claim: IClaim, attester: string) => {
      claimer.unlock(password);

      const requestForAttestation = await claimer.requestForAttestation(claim);

      const credential = claimer.generateCredential(requestForAttestation, attester);

      addCredential(credential);
      const { identifier } = Did.DidUtils.parseDidUri(attester);
      const attesterFullDid = await Did.FullDidDetails.fromChainInfo(identifier);

      if (attesterFullDid && attesterFullDid.encryptionKey) {
        const message = new Message(
          {
            content: { requestForAttestation },
            type: Message.BodyType.REQUEST_ATTESTATION
          },
          claimer.didDetails.did,
          attesterFullDid.did
        );

        credentialApi.addMessage(
          await claimer.encryptMessage(
            message,
            attesterFullDid.assembleKeyId(attesterFullDid.encryptionKey.id)
          )
        );
      }
    },
    [addCredential, claimer, password]
  );

  useEffect(() => {
    if (state) {
      const { cType } = state as { cType?: ICTypeMetadata };

      if (cType) {
        try {
          setCType(CType.fromSchema(cType.schema, cType.owner));
          toggleOpen();
        } catch {}
      }
    }
  }, [state, toggleOpen]);

  if (!cType) return null;

  return (
    <FullScreenDialog onClose={onClose} open={open}>
      <FullScreenDialogHeader>{cType.hash}</FullScreenDialogHeader>
      <FullScreenDialogContent>
        <Typography mb={4} textAlign="center" variant="h2">
          Create Claim
        </Typography>
        <CTypeForm cType={cType} onGenerateClaim={onGenerateClaim} />
        <FormControl fullWidth variant="outlined">
          <InputLabel shrink>Enter password</InputLabel>
          <PasswordInput onChange={(e) => setPassword(e.target.value)} />
        </FormControl>
      </FullScreenDialogContent>
    </FullScreenDialog>
  );
};

export default React.memo(CreateClaim);

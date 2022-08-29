import { Did } from '@kiltprotocol/sdk-js';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  OutlinedInput,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import { assert, u8aToHex } from '@polkadot/util';
import React, { useCallback, useContext, useMemo, useState } from 'react';

import { ellipsisMixin } from '@credential/react-components/utils';
import { useToggle } from '@credential/react-hooks';

import DidsModal from './DidsModal';
import { DidsContext } from './DidsProvider';
import { didManager } from './initManager';
import { signAndSend, Steps } from './steps';
import { useDerivedDid } from './useDerivedDid';

const Item: React.FC<{
  disabled?: boolean;
  checked: boolean;
  text?: string | null;
  label: string;
  onChange?: (checked: boolean) => void;
}> = ({ checked, disabled = false, label, onChange, text }) => {
  return (
    <Stack alignItems="center" direction="row" justifyContent="space-between">
      <FormControlLabel
        control={<Checkbox checked={checked} />}
        disabled={disabled}
        label={label}
        onChange={(_, checked) => onChange?.(checked)}
      />
      <Typography
        sx={({ palette }) => ({
          ...ellipsisMixin(),
          width: '50%',
          textAligh: 'right',
          color: disabled ? palette.action.disabled : undefined
        })}
        variant="inherit"
      >
        {text}
      </Typography>
    </Stack>
  );
};

const FullDidCreator: React.FC = () => {
  const { blockchain, fetchFullDid } = useContext(DidsContext);
  const didDetails = useDerivedDid();
  const [checkeds] = useState<[true, true, true, true]>([true, true, true, true]);
  const [open, toggleOpen] = useToggle();

  const keys = useMemo(() => {
    if (didDetails instanceof Did.LightDidDetails) {
      const _keys = [
        u8aToHex(didDetails.authenticationKey.publicKey),
        u8aToHex(didDetails.encryptionKey?.publicKey),
        u8aToHex(didDetails.authenticationKey.publicKey),
        u8aToHex(didDetails.authenticationKey.publicKey)
      ];

      return _keys;
    } else {
      return null;
    }
  }, [didDetails]);

  const fullDidUri = useMemo(() => {
    if (didDetails instanceof Did.LightDidDetails) {
      return 'did:kilt:' + didDetails.identifier;
    } else {
      return null;
    }
  }, [didDetails]);

  const getExtrinsic = useCallback(async () => {
    assert(didDetails, 'no light did');
    assert(didDetails instanceof Did.LightDidDetails, 'did is not light did');

    const creation = Did.FullDidCreationBuilder.fromLightDidDetails(blockchain.api, didDetails)
      .setAttestationKey(didDetails.authenticationKey)
      .setDelegationKey(didDetails.authenticationKey);

    return creation.build(didManager, didDetails?.identifier);
  }, [blockchain.api, didDetails]);

  const onDone = useCallback(() => {
    toggleOpen();
    fetchFullDid();
  }, [toggleOpen, fetchFullDid]);

  if (didDetails instanceof Did.FullDidDetails) {
    return <Alert severity="warning">You are already has full did</Alert>;
  }

  return (
    <>
      <Stack spacing={4.5}>
        <Box>
          <Typography variant="inherit">It will demonstrate the below info on-chain:</Typography>
          <Paper sx={{ padding: 3, marginTop: 2 }} variant="outlined">
            <Item checked={checkeds[0]} disabled label="Authentication Key" text={keys?.[0]} />
            <Item checked={checkeds[1]} disabled label="Agreement Key Set" text={keys?.[1]} />
            <Item checked={checkeds[2]} disabled label="Assertion Key" text={keys?.[2]} />
            <Item checked={checkeds[3]} disabled label="Delegation Key" text={keys?.[3]} />
          </Paper>
        </Box>
        <Box>
          <Typography variant="inherit">Your Fulldid:</Typography>
          <OutlinedInput disabled fullWidth sx={{ marginTop: 2 }} value={fullDidUri} />
        </Box>
        <Button fullWidth onClick={toggleOpen} variant="contained">
          Upgrade
        </Button>
      </Stack>
      <DidsModal
        onClose={toggleOpen}
        open={open}
        steps={
          <Steps
            onDone={onDone}
            steps={[
              {
                label: 'Sign and submit',
                paused: true,
                exec: (report) =>
                  signAndSend(
                    report,
                    didManager,
                    didDetails?.authenticationKey.publicKey,
                    getExtrinsic
                  )
              }
            ]}
            submitText="Upgrade"
          />
        }
        title="Upgrade to fulldid"
      />
    </>
  );
};

export default React.memo(FullDidCreator);

import type { DidUri } from '@kiltprotocol/types';

import { Did, Utils } from '@kiltprotocol/sdk-js';
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import React, { useEffect, useState } from 'react';

function validateDidUri(uri: string): uri is DidUri {
  try {
    return Did.Utils.validateKiltDidUri(uri);
  } catch {
    return false;
  }
}

function validateAddress(address: string): boolean {
  try {
    return Utils.DataUtils.validateAddress(address, '');
  } catch {
    return false;
  }
}

export function getDidUri(uriOrAddress: string, didType: 'full' | 'light'): DidUri | null {
  if (validateDidUri(uriOrAddress)) {
    return uriOrAddress;
  } else if (validateAddress(uriOrAddress)) {
    return Did.Utils.getKiltDidFromIdentifier(uriOrAddress, didType);
  } else {
    return null;
  }
}

interface Props {
  defaultValue?: string;
  onChange?: (value: Did.FullDidDetails | null) => void;
}

const InputDid: React.FC<Props> = ({ defaultValue, onChange, ...props }) => {
  const [didOrAddress, setDidOrAddress] = useState(defaultValue);
  const [fetching, setFetching] = useState(false);
  const [didDetails, setDidDetails] = useState<Did.FullDidDetails | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [warn, setWarn] = useState<Error | null>(null);

  useEffect(() => {
    onChange?.(didDetails);
  }, [didDetails, onChange]);

  useEffect(() => {
    if (!didOrAddress) return;

    const uri = getDidUri(didOrAddress, 'full');

    if (uri) {
      setError(null);

      setFetching(true);
      Did.FullDidDetails.fromChainInfo(uri)
        .then((didDetails) => {
          setDidDetails(didDetails);

          if (!didDetails) {
            setWarn(new Error("Can't found full did on chain, please make sure it is trusted"));
          } else if (!didDetails.encryptionKey) {
            setWarn(
              new Error('Input did does not set encryptionKey, you cannot send message to it')
            );
          } else {
            setWarn(null);
          }
        })
        .finally(() => setFetching(false));
    } else {
      setError(new Error('Input is not a validate didUri or address'));
    }
  }, [didOrAddress]);

  return (
    <FormControl
      color={error ? 'error' : warn ? 'warning' : undefined}
      error={!!error}
      focused={!!error || !!warn}
      fullWidth
      variant="outlined"
    >
      <InputLabel>Receipt address</InputLabel>
      <OutlinedInput
        {...props}
        defaultValue={didOrAddress}
        endAdornment={
          fetching ? (
            <InputAdornment position="end">
              <CircularProgress size={16} />
            </InputAdornment>
          ) : null
        }
        onChange={(e) => setDidOrAddress(e.target.value)}
        placeholder="Please input did"
      />
      {error ? (
        <FormHelperText>{error.message}</FormHelperText>
      ) : warn ? (
        <FormHelperText>{warn.message}</FormHelperText>
      ) : null}
    </FormControl>
  );
};

export default React.memo(InputDid);

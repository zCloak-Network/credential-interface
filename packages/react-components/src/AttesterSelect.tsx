import { Did } from '@kiltprotocol/sdk-js';
import {
  Autocomplete,
  CircularProgress,
  createFilterOptions,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

const DEFAULT_ATTESTERS = [
  'did:kilt:4rdUX21mgJYGPpU3PmmjSMDkthg9yD2eFeRXyh84tD6ssvS4',
  'did:kilt:4oNbdGidxdwg4t2vQNM3EaDqdZuksnr5ekEHLUXcQn1S83EL'
];

const filter = createFilterOptions<{ title: string; inputValue?: string }>();

interface Props {
  defaultValue?: string;
  onChange?: (value: Did.FullDidDetails | null) => void;
}

function validateDid(did: string): boolean {
  try {
    return Did.DidUtils.validateKiltDid(did);
  } catch {
    return false;
  }
}

const AttesterSelect: React.FC<Props> = ({ defaultValue, onChange }) => {
  const [attester, setAttester] = useState(defaultValue);
  const options = useMemo(() => DEFAULT_ATTESTERS.map((v) => ({ title: v })), []);
  const [didDetails, setDidDetails] = useState<Did.FullDidDetails | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [warn, setWarn] = useState<Error | null>(null);

  useEffect(() => {
    onChange?.(didDetails);
  }, [didDetails, onChange]);

  useEffect(() => {
    if (attester && validateDid(attester)) {
      setError(null);
      const { identifier } = Did.DidUtils.parseDidUri(attester);

      setFetching(true);
      Did.FullDidDetails.fromChainInfo(identifier)
        .then((didDetails) => {
          setDidDetails(didDetails);

          if (!didDetails) {
            setWarn(
              new Error("Can't found full did on chain, please make sure attester is trusted")
            );
          } else if (!didDetails.encryptionKey) {
            setWarn(
              new Error('Attester does not set encryptionKey, you cannot send message to attester')
            );
          } else {
            setWarn(null);
          }
        })
        .finally(() => setFetching(false));
    } else {
      setError(new Error('Input is not a validate did'));
    }
  }, [attester]);

  return (
    <Autocomplete<{ title: string; inputValue?: string }, undefined, undefined, true>
      clearOnBlur
      defaultValue={defaultValue}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);

        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add attester "${inputValue}"`
          });
        }

        return filtered;
      }}
      freeSolo
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }

        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.title;
        }

        // Regular option
        return option.title;
      }}
      handleHomeEndKeys
      onChange={(_, newValue: any) => {
        if (typeof newValue === 'string') {
          setAttester(newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setAttester(newValue.inputValue);
        } else {
          setAttester(newValue.title);
        }
      }}
      options={options}
      renderInput={(params) => (
        <FormControl
          color={error ? 'error' : warn ? 'warning' : undefined}
          focused={!!error || !!warn}
          fullWidth={params.fullWidth}
        >
          <InputLabel {...params.InputLabelProps} shrink>
            Attester
          </InputLabel>
          <OutlinedInput
            {...params.InputProps}
            endAdornment={
              fetching ? (
                <InputAdornment position="end">
                  <CircularProgress size={16} />
                </InputAdornment>
              ) : (
                params.InputProps.endAdornment
              )
            }
            inputProps={params.inputProps}
          />
          {error ? (
            <FormHelperText>{error.message}</FormHelperText>
          ) : warn ? (
            <FormHelperText>{warn.message}</FormHelperText>
          ) : null}
        </FormControl>
      )}
      selectOnFocus
      value={attester}
    />
  );
};

export default React.memo(AttesterSelect);

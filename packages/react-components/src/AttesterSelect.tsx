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
import React, { useEffect, useRef, useState } from 'react';

import { getDidUri } from './InputDid';

const filter = createFilterOptions<{ title: string; inputValue?: string }>();

interface Props {
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (value: Did.FullDidDetails | null) => void;
}

const AttesterSelect: React.FC<Props> = ({ defaultValue, disabled = false, onChange }) => {
  const [attester, setAttester] = useState(defaultValue);
  const options = useRef<{ title: string; inputValue?: string }[]>(
    defaultValue ? [{ title: defaultValue }] : []
  );
  const [didDetails, setDidDetails] = useState<Did.FullDidDetails | null>(null);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [warn, setWarn] = useState<Error | null>(null);

  useEffect(() => {
    onChange?.(didDetails);
  }, [didDetails, onChange]);

  useEffect(() => {
    if (!attester) return;

    const uri = getDidUri(attester, 'full');

    if (uri) {
      setError(null);

      setFetching(true);
      Did.FullDidDetails.fromChainInfo(uri)
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
      setError(new Error('Input is not a validate didUri or address'));
    }
  }, [attester]);

  return (
    <Autocomplete<{ title: string; inputValue?: string }, undefined, undefined, true>
      clearOnBlur
      defaultValue={defaultValue}
      disabled={disabled}
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
          setAttester(newValue?.title ?? null);
        }
      }}
      options={options.current}
      renderInput={(params) => (
        <FormControl
          color={error ? 'error' : warn ? 'warning' : undefined}
          error={!!error}
          focused={!!error || !!warn}
          fullWidth={params.fullWidth}
        >
          <InputLabel {...params.InputLabelProps} shrink>
            Attester
          </InputLabel>
          <OutlinedInput
            {...params.InputProps}
            disabled={params.disabled}
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

import { Did, DidUri } from '@kiltprotocol/sdk-js';
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
import React, { useCallback, useEffect, useRef, useState } from 'react';

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

  useEffect(() => {
    if (!error) {
      onChange?.(didDetails);
    } else {
      onChange?.(null);
    }
  }, [didDetails, error, onChange]);

  const fetchDid = useCallback((didUri: DidUri) => {
    return Did.FullDidDetails.fromChainInfo(didUri).then((didDetails) => {
      if (!didDetails) {
        setDidDetails(null);
        setError(new Error("Can't found full did on chain, please make sure attester is trusted"));
      } else if (!didDetails.encryptionKey) {
        setDidDetails(null);
        setError(
          new Error('Attester does not set encryptionKey, you cannot send message to attester')
        );
      } else {
        setDidDetails(didDetails);
        setError(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!attester) return;

    const uri = getDidUri(attester);

    if (uri) {
      setError(null);

      setFetching(true);
      fetchDid(uri).finally(() => setFetching(false));
    } else {
      setFetching(true);
      Did.Web3Names.queryDidForWeb3Name(attester)
        .then((did) => {
          if (did) {
            setError(null);

            return fetchDid(did);
          } else {
            throw new Error("Can't found web3Name on chain");
          }
        })
        .catch((error: Error) => {
          setDidDetails(null);
          setError(error);
        })
        .finally(() => setFetching(false));
    }
  }, [attester, fetchDid]);

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
          color={error ? 'error' : undefined}
          error={!!error}
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
          {error ? <FormHelperText>{error.message}</FormHelperText> : null}
        </FormControl>
      )}
      selectOnFocus
      value={attester}
    />
  );
};

export default React.memo(AttesterSelect);

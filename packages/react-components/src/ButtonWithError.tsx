import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import React, { useEffect, useState } from 'react';

export interface Props extends LoadingButtonProps {
  errorsPromise?: Promise<any>[];
}

const ButtonEnable: React.FC<Props> = ({ children, errorsPromise, ...props }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Error[]>([]);

  useEffect(() => {
    if (errorsPromise) {
      setLoading(true);
      Promise.all(errorsPromise)
        .then(() => setErrors([]))
        .catch((error) => {
          console.log(error);
          setErrors([error]);
        })
        .finally(() => setLoading(false));
    }
  }, [errorsPromise]);

  return (
    <LoadingButton
      {...props}
      disabled={props.disabled || errors.length > 0}
      loading={props.loading || loading}
      sx={
        errors.length > 0
          ? (theme) => ({
              background: errors.length > 0 ? theme.palette.error.main : undefined,
              color: '#fff !important'
            })
          : props.sx
      }
    >
      {errors.length > 0 ? errors[0].message : children}
    </LoadingButton>
  );
};

export default React.memo<typeof ButtonEnable>(ButtonEnable);

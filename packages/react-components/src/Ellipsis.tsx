import { Box, BoxProps } from '@mui/material';
import React from 'react';

const Ellipsis: React.FC<React.PropsWithChildren<BoxProps>> = React.forwardRef(
  ({ children, ...props }, ref) => {
    return (
      <Box
        {...props}
        className="CredentialEllipsis"
        overflow="hidden"
        ref={ref}
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {children}
      </Box>
    );
  }
);

export default React.memo<typeof Ellipsis>(Ellipsis);

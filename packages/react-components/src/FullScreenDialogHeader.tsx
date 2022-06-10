import { Box, BoxProps } from '@mui/material';
import React from 'react';

const FullScreenDialogHeader: React.FC<React.PropsWithChildren<BoxProps>> = ({
  children,
  ...props
}) => {
  return (
    <Box mb={4} {...props}>
      {children}
    </Box>
  );
};

export default React.memo<typeof FullScreenDialogHeader>(FullScreenDialogHeader);

import { CSSObject } from '@mui/material';

export const ellipsisMixin = (): CSSObject => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
});

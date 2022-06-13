import { type PaletteMode } from '@mui/material';
import { type PaletteOptions } from '@mui/material/styles';

/**
 * Customized Material UI color palette.
 *
 * @see https://mui.com/customization/palette/
 * @see https://mui.com/customization/default-theme/?expand-path=$.palette
 */
const createPalette = (mode: PaletteMode): PaletteOptions => ({
  mode,
  primary: {
    main: '#6768ac'
  },
  success: {
    main: '#00B69B'
  },
  error: {
    main: '#EF3826'
  },
  warning: {
    main: '#FFA756'
  },
  background: {
    default: mode === 'light' ? 'rgba(255, 255, 255 ,1)' : '#121212'
  },
  grey: {
    50: '#F5F6FA',
<<<<<<< HEAD
    100: '#F1F2F5',
    200: '#E5E6FA',
    300: '#D5D6DEA',
    400: '#C5C5DE'
=======
    100: '#F1F2F5'
>>>>>>> dev
  }
});

export { createPalette };

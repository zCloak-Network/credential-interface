import { type ThemeOptions } from '@mui/material/styles';

type Func = () => NonNullable<ThemeOptions['typography']>;

/**
 * Customized Material UI typography.
 *
 * @see https://mui.com/customization/typography/
 * @see https://mui.com/customization/default-theme/?expand-path=$.typography
 */
const createTypography: Func = () => ({
  fontFamily: [
    'Kanit',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    "'Segoe UI'",
    'Helvetica',
    'Arial',
    'sans-serif',
    "'Apple Color Emoji'",
    "'Segoe UI Emoji'",
    "'Segoe UI Symbol'"
  ].join(','),
  htmlFontSize: 16,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: '2.125rem'
    }
  },
  h2: {
    fontSize: '2.25rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: '1.875rem'
    }
  },
  h3: {
    fontSize: '2rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: '1.625rem'
    }
  },
  h4: {
    fontSize: '1.75rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: '1.5rem'
    }
  },
  h5: {
    fontSize: '1.5rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: '1.25rem'
    }
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    lineHeight: 1.5,
    '@media (max-width:600px)': {
      fontSize: '1.125rem'
    }
  },
  inherit: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5
  }
});

export { createTypography };

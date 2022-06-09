import { type PaletteMode } from '@mui/material';
import { type ThemeOptions } from '@mui/material/styles';

type Func = (mode: PaletteMode) => NonNullable<ThemeOptions['components']>;

/**
 * Style overrides for Material UI components.
 *
 * @see https://github.com/mui-org/material-ui/tree/master/packages/mui-material/src
 */
const createComponents: Func = () => ({
  MuiCssBaseline: {
    styleOverrides: `
    * {
      box-sizing: border-box;
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 100;
      src: url("/fonts/Kanit-Thin.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 100;
      src: url("/fonts/Kanit-ThinItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 200;
      src: url("/fonts/Kanit-ExtraLight.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 200;
      src: url("/fonts/Kanit-ExtraLightItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 300;
      src: url("/fonts/Kanit-Light.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 300;
      src: url("/fonts/Kanit-LightItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("/fonts/Kanit-Regular.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 400;
      src: url("/fonts/Kanit-Italic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 500;
      src: url("/fonts/Kanit-Medium.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 500;
      src: url("/fonts/Kanit-MediumItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 600;
      src: url("/fonts/Kanit-SemiBold.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 600;
      src: url("/fonts/Kanit-SemiBoldItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("/fonts/Kanit-Bold.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 700;
      src: url("/fonts/Kanit-BoldItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 800;
      src: url("/fonts/Kanit-ExtraBold.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 800;
      src: url("/fonts/Kanit-ExtraBoldItalic.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: normal;
      font-display: swap;
      font-weight: 900;
      src: url("/fonts/Kanit-Black.ttf");
    }
    @font-face {
      font-family: "Kanit";
      font-style: italic;
      font-display: swap;
      font-weight: 900;
      src: url("/fonts/Kanit-BlackItalic.ttf");
    }
    @font-face {
      font-family: "RobotoSlab";
      font-style: normal;
      font-display: swap;
      font-weight: 700;
      src: url("/fonts/RobotoSlab-Bold.ttf");
    }
    @font-face {
      font-family: "Roboto";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("/fonts/Roboto-Regular.ttf");
    }
    @font-face {
      font-family: "Papyrus";
      font-style: normal;
      font-display: swap;
      font-weight: 400;
      src: url("/fonts/PapyrusStd.OTF");
    }
  `
  },

  MuiLink: {
    defaultProps: {
      underline: 'none'
    }
  },

  MuiInputLabel: {
    styleOverrides: {
      outlined: ({ theme }) => ({
        position: 'relative',
        transform: 'none',
        marginBottom: theme.spacing(0.75)
      })
    }
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: '10px'
      }
    }
  },

  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: '10px !important'
      },
      list: {
        paddingLeft: 4,
        paddingRight: 4,
        border: '1px solid rgba(255, 255, 255, 0.6)',
        borderRadius: '10px'
      }
    }
  },

  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: '6px',
        ':hover, &.Mui-selected,&.Mui-focusVisible': {
          backgroundColor: '#EAECF2',
          ':hover': {
            backgroundColor: '#EAECF2'
          }
        }
      }
    }
  },

  MuiButtonBase: {
    styleOverrides: {
      root: {
        borderRadius: 10
      }
    }
  },

  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        textTransform: 'initial',
        minWidth: '140px'
      },
      outlined: ({ theme }) => ({
        borderColor: theme.palette.primary.main
      }),
      sizeSmall: {
        padding: '4px 10px',
        fontSize: '0.9375rem'
      },
      sizeMedium: {
        padding: '6px 16px',
        fontSize: '0.9375rem'
      },
      sizeLarge: {
        padding: '8px 22px',
        fontSize: '1rem'
      }
    }
  },

  MuiButtonGroup: {
    styleOverrides: {
      root: {
        boxShadow: 'none'
      }
    }
  },

  MuiDialog: {
    styleOverrides: {
      root: ({ theme: { breakpoints, spacing } }) => ({
        '.MuiDialogTitle-root': {
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 500,
          padding: spacing(3),
          [breakpoints.down('md')]: {
            padding: spacing(2)
          }
        }
      }),
      paper: ({ theme: { breakpoints, spacing } }) => ({
        borderRadius: '24px',
        margin: spacing(3),
        [breakpoints.down('md')]: {
          margin: spacing(2)
        }
      })
    }
  },

  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontSize: '1.125rem'
      }
    }
  },
  MuiDialogContent: {
    styleOverrides: {
      root: ({ theme: { breakpoints, spacing } }) => ({
        padding: spacing(3),
        [breakpoints.down('md')]: {
          padding: spacing(2)
        }
      })
    }
  },
  MuiDialogActions: {
    styleOverrides: {
      root: ({ theme: { breakpoints, spacing } }) => ({
        padding: spacing(3),
        paddingTop: 0,
        [breakpoints.down('md')]: {
          padding: spacing(2)
        }
      })
    }
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&.MuiTableRow-hover:hover': {
          backgroundColor: '#E5E7ED'
        }
      }
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: () => ({
        '&:nth-of-type(1)': {
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '10px'
        },
        '&:nth-last-of-type(1)': {
          borderTopRightRadius: '10px',
          borderBottomRightRadius: '10px'
        },
        borderBottom: 'none',
        color: '#000',
        fontWeight: 700
      }),
      head: ({ theme }) => ({
        borderBottom: '1px solid #E5E7ED',
        color: theme.palette.grey[700]
      })
    }
  }
});

export { createComponents };
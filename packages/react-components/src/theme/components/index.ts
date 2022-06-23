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
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 2px;
    }
    ::-webkit-scrollbar-thumb {
      background: #bfbfbf;
      border-radius: 10px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #333;
    }
    ::-webkit-scrollbar-corner {
      background: #179a16;
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
      sizeSmall: {
        borderRadius: '5px'
      },
      root: ({ theme: { palette } }) => ({
        borderRadius: '10px',
        '&.Mui-disabled': {
          backgroundColor: palette.background.default,
          '.MuiOutlinedInput-notchedOutline': {
            border: 'none'
          }
        }
      })
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
        borderRadius: 5,
        textTransform: 'initial'
      },
      outlined: ({ theme }) => ({
        borderColor: theme.palette.primary.main,
        minWidth: '140px'
      }),
      contained: {
        minWidth: '140px'
      },
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
      paperFullScreen: ({ theme: { palette, spacing } }) => ({
        margin: 0,
        background: palette.grey[100],
        borderRadius: 0,
        '& .MuiDialogTitle-root': {
          background: palette.common.white
        },
        '& .MuiDialogContent-root': {
          margin: spacing(3),
          marginLeft: 'auto',
          marginRight: 'auto',
          background: palette.common.white
        },
        '& .MuiDialogActions-root': {
          background: palette.common.white,
          justifyContent: 'center',
          padding: spacing(3)
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
      root: ({ theme }) => ({
        borderBottom: '1px solid',
        borderBottomColor: theme.palette.grey[300],
        '&:nth-last-of-type(1)': {
          borderBottom: 'none'
        },
        '&.MuiTableRow-hover:hover': {
          backgroundColor: '#E5E7ED'
        }
      })
    }
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        color: theme.palette.grey[900],
        fontWeight: 500
      }),
      head: ({ theme }) => ({
        background: theme.palette.grey[100],
        color: theme.palette.grey[500],
        borderBottom: 'none'
      })
    }
  }
});

export { createComponents };

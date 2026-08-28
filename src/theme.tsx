import { extendTheme } from '@mui/joy/styles';
import { colors, gradients, fonts } from './themeConfig';

export default extendTheme({
  cssVarPrefix: 'space',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: colors.accentDeep,
          solidHoverBg: '#0c5a37',
          solidActiveBg: '#094c2f',
          outlinedColor: colors.accentDeep,
          outlinedBorder: colors.borderMedium,
          plainColor: colors.accentDeep,
        },
        neutral: {
          outlinedBorder: colors.borderMedium,
          outlinedColor: colors.textBody,
        },
        background: {
          body: gradients.body,
          surface: colors.surface,
          popup: '#ffffff',
        },
        text: {
          primary: colors.text,
          secondary: colors.textBody,
          tertiary: colors.textMuted,
        },
        focusVisible: colors.accent,
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: colors.accentDeep,
          solidHoverBg: '#0c5a37',
          solidActiveBg: '#094c2f',
          outlinedColor: colors.accentDeep,
          outlinedBorder: colors.borderMedium,
          plainColor: colors.accentDeep,
        },
        neutral: {
          outlinedBorder: colors.borderMedium,
          outlinedColor: colors.textBody,
        },
        background: {
          body: gradients.body,
          surface: colors.surface,
          popup: colors.surfaceSolid,
        },
        text: {
          primary: colors.text,
          secondary: colors.textBody,
          tertiary: colors.textMuted,
        },
        focusVisible: colors.accent,
      },
    },
  },
  fontFamily: {
    display: fonts.display,
    body: fonts.body,
    code: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  components: {
    JoyCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.vars.palette.background.surface,
          backdropFilter: 'none',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 10px 28px -24px rgba(20, 65, 42, 0.38)',
          borderRadius: '14px',
        }),
      },
    },
    JoySheet: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.vars.palette.background.surface,
          backdropFilter: 'none',
        }),
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          borderRadius: '9px',
          fontWeight: 700,
          minHeight: '38px',
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderColor: colors.borderMedium,
          minHeight: '40px',
          fontSize: '14px',
        },
      },
    },
    JoyTextarea: {
      styleOverrides: {
        root: {
          background: '#ffffff',
          borderColor: colors.borderMedium,
          fontSize: '14px',
          lineHeight: 1.6,
        },
      },
    },
    JoyTypography: {
      styleOverrides: {
        root: {
          textRendering: 'optimizeLegibility',
        },
      },
    },
  },
});

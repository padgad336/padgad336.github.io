import { extendTheme } from '@mui/joy/styles';
import { colors, gradients, fonts, accentAlpha } from './themeConfig';

export default extendTheme({
  cssVarPrefix: 'space',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: colors.accentDeep,
          solidHoverBg: '#8a6bf5',
          solidActiveBg: '#7a5be6',
        },
        neutral: {
          outlinedBorder: accentAlpha(0.2),
        },
        background: {
          body: gradients.body,
          surface: 'rgba(255,255,255,0.65)',
          popup: 'rgba(255,255,255,0.75)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: colors.accentDeep,
          solidHoverBg: '#8a6bf5',
          solidActiveBg: '#7a5be6',
          outlinedBorder: accentAlpha(0.25),
        },
        neutral: {
          outlinedBorder: accentAlpha(0.12),
        },
        background: {
          body: gradients.body,
          surface: gradients.surface,
          popup: 'rgba(17,17,27,0.95)',
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
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.borderLight}`,
          boxShadow: '0 4px 18px -4px rgba(0,0,0,0.4)',
        }),
      },
    },
    JoySheet: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.vars.palette.background.surface,
          backdropFilter: 'blur(10px)',
        }),
      },
    },
  },
});

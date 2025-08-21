import { extendTheme } from '@mui/joy/styles';

const spaceGradient = 'radial-gradient(circle at 20% 18%, #24345c 0%, #101a30 50%, #050910 90%)';
const spaceSurface = 'linear-gradient(145deg, rgba(36,52,92,0.25), rgba(10,16,30,0.4))';

export default extendTheme({
  cssVarPrefix: 'space',
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#657bff',
          solidHoverBg: '#5469f5',
          solidActiveBg: '#4355e6',
        },
        neutral: {
          outlinedBorder: 'rgba(60,80,130,0.4)',
        },
        background: {
          body: spaceGradient,
          surface: 'rgba(255,255,255,0.65)',
          popup: 'rgba(255,255,255,0.75)',
        },
      },
    },
    dark: {
      palette: {
        primary: {
          solidBg: '#6d7dff',
          solidHoverBg: '#5a6af5',
          solidActiveBg: '#4754e6',
          outlinedBorder: 'rgba(120,140,255,0.4)',
        },
        neutral: {
          outlinedBorder: 'rgba(120,140,255,0.25)',
        },
        background: {
          body: spaceGradient,
          surface: spaceSurface,
          popup: 'rgba(25,35,60,0.9)',
        },
        focusVisible: '#9bb4ff',
      },
    },
  },
  fontFamily: {
    display: '"Inter", var(--joy-fontFamily-fallback)',
    body: '"Inter", var(--joy-fontFamily-fallback)',
    code: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
  },
  components: {
    JoyCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          background: theme.vars.palette.background.surface,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(120,140,255,0.18)',
          boxShadow: '0 4px 18px -4px rgba(0,0,0,0.6)',
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

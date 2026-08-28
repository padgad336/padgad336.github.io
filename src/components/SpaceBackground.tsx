import * as React from 'react';
import { Box } from '@mui/joy';
import { colors } from '../themeConfig';

/**
 * Soft ambient texture that keeps the page feeling light without competing with content.
 */
const SpaceBackground: React.FC = () => {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        '& .layer': {
          position: 'absolute',
          inset: '-50%',
          backgroundRepeat: 'repeat',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
          opacity: 0.14,
        },
        '& .layer.tiny': {
          backgroundImage: `radial-gradient(${colors.starWhite} 0 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
          animationName: 'starDrift1',
          animationDuration: '90s',
        },
        '& .layer.small': {
          backgroundImage: `radial-gradient(${colors.starPurple} 0 1px, transparent 1px)`,
          backgroundSize: '7px 7px',
          animationName: 'starDrift2',
          animationDuration: '120s',
          opacity: 0.1,
        },
        '& .layer.medium': {
          backgroundImage: `radial-gradient(${colors.starDeepPurple} 0 1.2px, transparent 1.2px)`,
          backgroundSize: '11px 11px',
          animationName: 'starDrift3',
          animationDuration: '150s',
          opacity: 0.07,
        },
        '& .twinkle': {
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 25%, rgba(117,181,139,0.16), transparent 36%), radial-gradient(circle at 82% 62%, rgba(22,121,74,0.10), transparent 42%)',
          animation: 'twinklePulse 12s ease-in-out infinite',
          opacity: 0.28,
        },
        '@keyframes starDrift1': {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(200px,800px,0)' },
        },
        '@keyframes starDrift2': {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-300px,600px,0)' },
        },
        '@keyframes starDrift3': {
          '0%': { transform: 'translate3d(0,0,0) scale(1)' },
          '100%': { transform: 'translate3d(400px,500px,0) scale(1.1)' },
        },
        '@keyframes twinklePulse': {
          '0%,100%': { opacity: 0.35 },
          '50%': { opacity: 0.65 },
        },
        '@media print': {
          display: 'none',
        },
      }}
    >
      <Box className='layer tiny' />
      <Box className='layer small' />
      <Box className='layer medium' />
      <Box className='twinkle' />
    </Box>
  );
};

export default SpaceBackground;

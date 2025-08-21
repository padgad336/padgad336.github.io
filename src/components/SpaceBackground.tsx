import * as React from 'react';
import { Box } from '@mui/joy';

/**
 * Animated space background using layered CSS starfields + twinkling + slow parallax drift.
 * Lightweight (no canvas) and respects print (hidden when printing).
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
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          mixBlendMode: 'screen',
          opacity: 0.55,
        },
        '& .layer.tiny': {
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 0 1px, transparent 1px)',
          backgroundSize: '3px 3px',
          animationName: 'starDrift1',
          animationDuration: '160s',
        },
        '& .layer.small': {
          backgroundImage: 'radial-gradient(rgba(180,200,255,0.8) 0 1.2px, transparent 1.2px)',
          backgroundSize: '6px 6px',
          animationName: 'starDrift2',
          animationDuration: '220s',
          opacity: 0.4,
        },
        '& .layer.medium': {
          backgroundImage: 'radial-gradient(rgba(120,150,255,0.9) 0 1.6px, transparent 1.6px)',
          backgroundSize: '9px 9px',
          animationName: 'starDrift3',
          animationDuration: '300s',
          opacity: 0.35,
        },
        '& .twinkle': {
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15), transparent 60%), radial-gradient(circle at 75% 60%, rgba(160,180,255,0.18), transparent 70%), radial-gradient(circle at 40% 80%, rgba(120,150,255,0.12), transparent 65%)',
          animation: 'twinklePulse 12s ease-in-out infinite',
          mixBlendMode: 'screen',
          opacity: 0.5,
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

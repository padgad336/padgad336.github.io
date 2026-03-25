import * as React from 'react';
import { Box } from '@mui/joy';
import { Outlet } from 'react-router-dom';
import SpaceBackground from '../components/SpaceBackground';
import Navbar from '../components/Navbar';

const AppLayout: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      <SpaceBackground />
      <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ flex: 1 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;

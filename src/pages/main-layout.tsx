import { Box } from '@mui/joy';
import Resume from '../components/Resume';
import SpaceBackground from '../components/SpaceBackground';

export const MainContentLayout = () => {
  return (
    // <Main
    //   sx={{ flexGrow: 1, }}
    // >
    <Box sx={{ width: '100%', position: 'relative', py: { xs: 4, md: 6 } }}>
      <SpaceBackground />
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Resume />
      </Box>
    </Box>
  );
};

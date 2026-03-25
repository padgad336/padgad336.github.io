import { Box } from '@mui/joy';
import Resume from '../components/Resume';

export const MainContentLayout = () => {
  return (
    <Box sx={{ width: '100%', position: 'relative', py: { xs: 2, md: 4 } }}>
      <Resume />
    </Box>
  );
};

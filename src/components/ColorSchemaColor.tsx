import {useState,useEffect  } from 'react';
import { useColorScheme } from '@mui/joy/styles';
import { IconButton } from '@mui/joy';
import {
    DarkModeRounded as DarkModeRoundedIcon,
    LightModeRounded as LightModeRoundedIcon 
} from '@mui/icons-material';



export function ColorSchemeToggle() {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
      setMounted(true);
    }, []);
    if (!mounted) {
      return <IconButton size="sm" variant="outlined" color="primary" />;
    }
    return (
      <IconButton
        id="toggle-mode"
        size="sm"
        variant="outlined"
        color="primary"
        onClick={() => {
          if (mode === 'light') {
            setMode('dark');
          } else {
            setMode('light');
          }
        }}
      >
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    );
  }
import * as React from 'react';
import { Box, IconButton, Typography, Sheet, List, ListItemButton, Drawer, ModalClose, DialogTitle } from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import TerminalRoundedIcon from '@mui/icons-material/TerminalRounded';
import { colors, fonts, accentAlpha, accentDeepAlpha } from '../themeConfig';

const navItems = [
  { label: '#home', path: '/' },
  { label: '#resume', path: '/resume' },
  { label: '#map', path: '/map' },
  { label: '#sip', path: '/sip' },
  { label: '#har→sip', path: '/har-to-sip' },
  { label: '#3d-table', path: '/tree' },
  { label: '#tools', path: '/tools' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <Sheet
        component='nav'
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          px: { xs: 2, md: 5 },
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: colors.surface,
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${colors.borderLight}`,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity .5s ease, transform .5s cubic-bezier(.16,.8,.3,1)',
        }}
      >
        {/* Brand */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            userSelect: 'none',
            '&:hover .brand-icon': {
              color: colors.accent,
              transform: 'rotate(8deg)',
            },
          }}
        >
          <TerminalRoundedIcon
            className='brand-icon'
            sx={{
              fontSize: 22,
              color: colors.accentDeep,
              transition: 'color .3s ease, transform .3s ease',
            }}
          />
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 17,
              color: colors.text,
              letterSpacing: '0.5px',
            }}
          >
            PadGad
          </Typography>
        </Box>

        {/* Desktop links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Typography
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  fontWeight: 500,
                  px: 1.5,
                  py: 0.5,
                  cursor: 'pointer',
                  color: active ? colors.accent : colors.textMuted,
                  transition: 'color .25s ease',
                  '&:hover': {
                    color: colors.accent,
                  },
                }}
              >
                {item.label}
              </Typography>
            );
          })}
        </Box>

        {/* Mobile hamburger */}
        <IconButton
          variant='plain'
          size='sm'
          onClick={() => setDrawerOpen(true)}
          sx={{
            display: { xs: 'flex', md: 'none' },
            color: colors.accentDeep,
          }}
        >
          <MenuRoundedIcon />
        </IconButton>
      </Sheet>

      {/* Mobile drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        anchor='right'
        size='sm'
        slotProps={{
          content: {
            sx: {
              background: 'rgba(17, 17, 27, 0.98)',
              backdropFilter: 'blur(20px)',
              borderLeft: `1px solid ${accentAlpha(0.1)}`,
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: fonts.mono,
            color: colors.accent,
            px: 2.5,
            pt: 2,
            fontSize: 16,
          }}
        >
          <TerminalRoundedIcon sx={{ mr: 1, fontSize: 18 }} />
          PadGad
        </DialogTitle>
        <ModalClose sx={{ color: colors.accentDeep }} />
        <List sx={{ mt: 2, px: 1 }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.path}
                selected={active}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                sx={{
                  borderRadius: 6,
                  mb: 0.5,
                  py: 1.2,
                  px: 2,
                  fontFamily: fonts.mono,
                  fontSize: 14,
                  color: active ? colors.accent : colors.textMuted,
                  fontWeight: active ? 700 : 400,
                  '&.Mui-selected': {
                    background: accentDeepAlpha(0.08),
                  },
                  '&:hover': {
                    background: accentDeepAlpha(0.06),
                    color: colors.accent,
                  },
                }}
              >
                {item.label}
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;

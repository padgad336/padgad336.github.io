import * as React from 'react';
import { Avatar, Box, Button, Card, CardContent, Link, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import SettingsInputAntennaRoundedIcon from '@mui/icons-material/SettingsInputAntennaRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import { colors, fonts, accentAlpha, gradients } from '../themeConfig';

const tools = [
  {
    title: 'Resume',
    description: 'Interactive portfolio & CV — print-ready layout with full experience.',
    path: '/resume',
    icon: <DescriptionRoundedIcon sx={{ fontSize: 36 }} />,
    accent: colors.accent,
  },
  {
    title: 'Map Explorer',
    description: 'Interactive map viewer with community location markers.',
    path: '/map',
    icon: <MapRoundedIcon sx={{ fontSize: 36 }} />,
    accent: colors.secondary,
  },
  {
    title: 'SIP Analyzer',
    description: 'Debug & analyze SIP logs — REGISTER, INVITE, Codec, NAT, ICE candidates.',
    path: '/sip',
    icon: <SettingsInputAntennaRoundedIcon sx={{ fontSize: 36 }} />,
    accent: '#f0883e',
  },
  {
    title: 'HAR → SIP',
    description: 'แปลง WebSocket SIP messages จากไฟล์ HAR เป็นไฟล์ .sip',
    path: '/har-to-sip',
    icon: <SwapHorizRoundedIcon sx={{ fontSize: 36 }} />,
    accent: '#d29922',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const fadeUp = (delay: number) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.16,.8,.3,1) ${delay}s`,
  });

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100vh - 56px)' }}>
      {/* Social sidebar — desktop only */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          position: 'fixed',
          left: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          flexDirection: 'column',
          gap: 2.5,
          zIndex: 10,
          opacity: mounted ? 1 : 0,
          transition: 'opacity .6s ease 0.6s',
        }}
      >
        {[
          { icon: <GitHubIcon sx={{ fontSize: 20 }} />, href: 'https://github.com/padgad336' },
          { icon: <LanguageRoundedIcon sx={{ fontSize: 20 }} />, href: '/' },
          { icon: <EmailRoundedIcon sx={{ fontSize: 20 }} />, href: 'mailto:phairat101039@gmail.com' },
        ].map((s, i) => (
          <Link
            key={i}
            href={s.href}
            target={s.href.startsWith('http') ? '_blank' : undefined}
            sx={{
              color: colors.textDim,
              transition: 'color .25s ease, transform .25s ease',
              '&:hover': { color: colors.accent, transform: 'scale(1.2)' },
            }}
          >
            {s.icon}
          </Link>
        ))}
        <Box
          sx={{
            width: 1,
            height: 60,
            mx: 'auto',
            background: gradients.lineVertical,
          }}
        />
      </Box>

      {/* ─── HERO SECTION ─── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: { xs: 4, md: 8 },
          px: { xs: 3, sm: 5, lg: 10 },
          pt: { xs: 6, md: 10 },
          pb: { xs: 4, md: 8 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Left — Text */}
        <Box sx={{ flex: 1, maxWidth: 560, ...fadeUp(0.1) }}>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: { xs: 28, sm: 34, md: 40 },
              fontWeight: 500,
              color: colors.textBody,
              lineHeight: 1.35,
              mb: 2,
            }}
          >
            PadGad is a{' '}
            <Box component='span' sx={{ color: colors.accent, fontWeight: 700 }}>
              full-stack developer
            </Box>{' '}
            and{' '}
            <Box
              component='span'
              sx={{
                color: colors.accent,
                fontWeight: 700,
                display: 'inline',
                borderBottom: `2px solid ${accentAlpha(0.4)}`,
              }}
            >
              system engineer
            </Box>
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: 14,
              color: colors.textMuted,
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            He crafts scalable systems where technology
            <br />
            meets reliability
          </Typography>

          <Button
            variant='outlined'
            onClick={() => navigate('/resume')}
            sx={{
              fontFamily: fonts.mono,
              fontSize: 13,
              fontWeight: 500,
              color: colors.textBody,
              borderColor: accentAlpha(0.35),
              borderRadius: 0,
              px: 3,
              py: 1,
              letterSpacing: '0.5px',
              transition: 'all .25s ease',
              '&:hover': {
                borderColor: colors.accent,
                background: accentAlpha(0.06),
                color: colors.accent,
              },
            }}
          >
            View Resume →
          </Button>
        </Box>

        {/* Right — Avatar + geometric pattern */}
        <Box
          sx={{
            position: 'relative',
            flex: '0 0 auto',
            ...fadeUp(0.3),
          }}
        >
          {/* Dot grid decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: -20,
              right: -30,
              width: 120,
              height: 120,
              backgroundImage: `radial-gradient(circle, ${accentAlpha(0.3)} 1px, transparent 1px)`,
              backgroundSize: '12px 12px',
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -15,
              left: -25,
              width: 80,
              height: 80,
              backgroundImage: `radial-gradient(circle, ${accentAlpha(0.2)} 1px, transparent 1px)`,
              backgroundSize: '10px 10px',
              zIndex: 0,
            }}
          />
          {/* Geometric accent square */}
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left: -15,
              width: 50,
              height: 50,
              border: `2px solid ${accentAlpha(0.2)}`,
              zIndex: 0,
            }}
          />

          <Avatar
            src='https://avatars.githubusercontent.com/u/67619755?v=4'
            sx={{
              '--Avatar-size': { xs: '200px', md: '260px' },
              borderRadius: 0,
              position: 'relative',
              zIndex: 1,
              filter: 'grayscale(0.15)',
              border: `2px solid ${accentAlpha(0.15)}`,
              transition: 'filter .4s ease, border-color .4s ease',
              '&:hover': {
                filter: 'grayscale(0)',
                borderColor: accentAlpha(0.4),
              },
            }}
          />

          {/* Status badge */}
          <Box
            sx={{
              position: 'absolute',
              bottom: -18,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.6,
              background: colors.surface,
              border: `1px solid ${colors.borderMedium}`,
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: 1,
                background: colors.accent,
                animation: 'statusPulse 2s ease-in-out infinite',
              }}
            />
            <Typography sx={{ fontFamily: fonts.mono, fontSize: 12, color: colors.textMuted }}>
              Currently working on{' '}
              <Box component='span' sx={{ color: colors.text, fontWeight: 700 }}>
                M biz consultant co.
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ─── QUOTE ─── */}
      <Box
        sx={{
          maxWidth: 700,
          mx: 'auto',
          px: { xs: 3, sm: 5 },
          py: { xs: 4, md: 5 },
          ...fadeUp(0.45),
        }}
      >
        <Box
          sx={{
            position: 'relative',
            border: `1px solid ${colors.border}`,
            px: { xs: 3, md: 5 },
            py: 3,
          }}
        >
          {/* Quote marks */}
          <Typography
            sx={{
              fontFamily: fonts.mono,
              position: 'absolute',
              top: -14,
              left: 16,
              fontSize: 28,
              color: accentAlpha(0.25),
              lineHeight: 1,
            }}
          >
            ❝
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: { xs: 15, md: 18 },
              fontWeight: 500,
              color: colors.textBody,
              textAlign: 'center',
              letterSpacing: '0.5px',
            }}
          >
            With great power comes great electricity bill
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: 13,
              color: colors.textDim,
              textAlign: 'right',
              mt: 2,
            }}
          >
            — Dr. Who
          </Typography>
        </Box>
      </Box>

      {/* ─── TOOLS SECTION ─── */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 3, sm: 5, lg: 10 },
          pb: { xs: 6, md: 10 },
          ...fadeUp(0.55),
        }}
      >
        {/* Section header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography
            sx={{
              fontFamily: fonts.mono,
              fontSize: { xs: 22, md: 28 },
              fontWeight: 700,
              color: colors.text,
            }}
          >
            <Box component='span' sx={{ color: colors.accent }}>
              #
            </Box>
            tools
          </Typography>
          <Box
            sx={{
              flex: 1,
              height: 1,
              mx: 3,
              background: gradients.line,
              display: { xs: 'none', sm: 'block' },
            }}
          />
        </Box>

        {/* Tool Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 2, md: 3 },
          }}
        >
          {tools.map((tool, i) => (
            <Card
              key={tool.path}
              variant='plain'
              onClick={() => navigate(tool.path)}
              sx={{
                cursor: 'pointer',
                p: 0,
                borderRadius: 0,
                background: colors.surfaceCard,
                border: `1px solid ${colors.borderSubtle}`,
                overflow: 'hidden',
                ...fadeUp(0.65 + i * 0.12),
                transition: 'border-color .3s ease, box-shadow .3s ease, transform .3s ease',
                '&:hover': {
                  borderColor: `${tool.accent}44`,
                  boxShadow: `0 4px 30px -8px ${tool.accent}22`,
                  transform: 'translateY(-3px)',
                },
                '&:hover .tool-accent-line': {
                  width: '100%',
                },
                '&:hover .tool-icon': {
                  color: tool.accent,
                  transform: 'scale(1.1)',
                },
                '&:hover .tool-arrow': {
                  opacity: 1,
                  transform: 'translateX(4px)',
                },
              }}
            >
              {/* Top accent line */}
              <Box
                className='tool-accent-line'
                sx={{
                  height: 2,
                  width: '30%',
                  background: tool.accent,
                  transition: 'width .4s ease',
                }}
              />
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box
                  className='tool-icon'
                  sx={{
                    color: colors.textDim,
                    mb: 2,
                    transition: 'color .3s ease, transform .3s ease',
                  }}
                >
                  {tool.icon}
                </Box>
                <Typography
                  sx={{
                    fontFamily: fonts.mono,
                    color: colors.text,
                    fontWeight: 700,
                    fontSize: { xs: 18, md: 20 },
                    mb: 1,
                  }}
                >
                  {tool.title}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fonts.mono,
                    color: colors.textDim,
                    fontSize: 13,
                    lineHeight: 1.6,
                    mb: 2,
                  }}
                >
                  {tool.description}
                </Typography>
                <Typography
                  className='tool-arrow'
                  sx={{
                    fontFamily: fonts.mono,
                    fontSize: 12,
                    color: tool.accent,
                    opacity: 0.5,
                    transition: 'opacity .3s ease, transform .3s ease',
                  }}
                >
                  Open →
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <style>{`
        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </Box>
  );
};

export default HomePage;

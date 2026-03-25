import * as React from 'react';
import {
  Box,
  Typography,
  Chip,
  Divider,
  Stack,
  Avatar,
  List,
  ListItem,
  ListItemContent,
  Button,
  Link,
  Card,
} from '@mui/joy';
import { colors, fonts, accentAlpha, gradients } from '../themeConfig';

// Basic shared data (could be externalized later)
const profileData = {
  firstName: 'Phairat',
  lastName: 'Kaewkandee',
  aka: 'PadGad',
  role: 'Full-Stack Developer',
  email: 'phairat101039@gmail.com',
  github: 'https://github.com/padgad336',
  image: 'https://avatars.githubusercontent.com/u/67619755?v=4',
};

const experience = [
  { role: 'Senior Developer', company: 'A Dot co. ltd', years: '2024–Present' },
  { role: 'Senior Developer', company: 'Stream South Technology Co. Ltd', years: '2020–2024' },
  { role: 'Senior Developer', company: 'aheadall co. ltd', years: '2020–2021' },
  { role: 'Developer', company: 'Thaidotrun', years: '2019–2020' },
];

const coreSkills = [
  'Node.js',
  'TypeScript',
  'React (Vite, AntD)',
  'Flutter',
  'Firebase',
  'Prisma',
  'Sequelize',
  'GraphQL',
  'Express.js',
];

const databaseSkills = ['PostgreSQL', 'Firestore', 'MySQL', 'MinIO (S3)', 'Redis', 'Query Optimization'];

const devopsSkills = [
  'Docker',
  'Docker Compose',
  'GitHub Actions',
  'Nginx',
  'KafkaJS',
  'Capacitor',
  'Amazon Bedrock',
  'Weaviate',
];

const securitySkills = ['SSL/TLS', 'HSTS', 'Nessus/OpenSCAP', 'systemd hardening', 'vulnerability remediation'];

export const Resume: React.FC = () => {
  const print = React.useCallback(() => window.print(), []);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // next frame for smoother initial animation
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const fadeIn = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'none' : 'translateY(14px)',
    transition: `opacity .75s ease ${delay}s, transform .75s cubic-bezier(.16,.8,.3,1) ${delay}s`,
  });

  return (
    <Box id='resume-root' sx={{ width: '100vw', minHeight: '100vh', px: { xs: 2, md: 4 }, py: { xs: 3, md: 5 } }}>
      <Card
        id='resume-card'
        variant='outlined'
        sx={{
          width: '100%',
          minHeight: 'calc(100vh - 2rem)',
          p: { xs: 3, sm: 5 },
          borderRadius: 14,
          background: `linear-gradient(145deg, rgba(30, 28, 45, 0.92), ${colors.surfaceSolid})`,
          border: `1px solid ${accentAlpha(0.25)}`,
          boxShadow: '0 4px 28px -6px rgba(0,0,0,0.7)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '&:before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 85% 15%, ${accentAlpha(0.15)}, transparent 70%)`,
            pointerEvents: 'none',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3, alignItems: { sm: 'center' } }}>
          <Avatar
            src={profileData.image}
            sx={{ '--Avatar-size': '96px', borderRadius: '16px', boxShadow: `0 0 0 2px ${accentAlpha(0.3)}` }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography
              level='h2'
              sx={{
                fontSize: 34,
                fontWeight: 700,
                letterSpacing: '0.5px',
                fontFamily: fonts.mono,
                color: colors.text,
                textShadow: `0 0 6px ${accentAlpha(0.4)}`,
                animation: 'titlePulse 6s ease-in-out infinite',
              }}
            >
              {profileData.firstName} {profileData.lastName}
            </Typography>
            <Typography level='title-lg' sx={{ color: colors.accent, fontWeight: 500 }}>
              {profileData.role} • {profileData.aka}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1.5, flexWrap: 'wrap' }}>
              <Typography level='body-sm' sx={{ color: colors.textBody }}>
                {profileData.email}
              </Typography>
              <Divider
                orientation='vertical'
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  '--Divider-thickness': '1px',
                  '--Divider-lineColor': accentAlpha(0.3),
                }}
              />
              <Link href={profileData.github} target='_blank' sx={{ fontSize: 13 }}>
                {profileData.github}
              </Link>
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size='sm'
              variant='outlined'
              onClick={print}
              sx={{ borderColor: accentAlpha(0.4), color: colors.accent }}
            >
              Print / PDF
            </Button>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: accentAlpha(0.25) }} />

        {/* Summary */}
        <Box className='section' data-block='summary'>
          <Typography level='title-md' sx={sectionTitleSx}>
            Professional Summary
          </Typography>
          <Typography level='body-sm' sx={bodyTextSx}>
            Innovative and versatile Software Engineer with extensive experience in full-stack development, system
            integration, and cloud-native infrastructure. Proven expertise in Node.js, TypeScript, Prisma, PostgreSQL,
            Docker, Kubernetes, React, Flutter, and Firebase. Adept at building and scaling real-time distributed
            systems, mobile applications, and AI-driven solutions. Strong background in university-wide digital
            transformation projects (Prince of Songkla University) including CCTV analytics, Esports management
            platforms, Softphone VOIP integration, and knowledge-base AI assistants. Skilled in system hardening,
            security compliance, and enterprise-grade deployments.
          </Typography>
        </Box>

        {/* Skills */}
        <Box className='section' data-block='core-skills' sx={{ mt: 3 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Programming & Frameworks
          </Typography>
          <Box sx={chipCloudSx}>
            {coreSkills.map((s) => (
              <Chip key={s} size='sm' variant='outlined' sx={chipSx}>
                {s}
              </Chip>
            ))}
          </Box>
        </Box>

        <Box className='section' data-block='database' sx={{ mt: 3 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Database & Storage
          </Typography>
          <Box sx={chipCloudSx}>
            {databaseSkills.map((s) => (
              <Chip key={s} size='sm' variant='outlined' sx={chipSx}>
                {s}
              </Chip>
            ))}
          </Box>
        </Box>

        <Box className='section' data-block='devops' sx={{ mt: 3 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            DevOps & Infrastructure
          </Typography>
          <Box sx={chipCloudSx}>
            {devopsSkills.map((s) => (
              <Chip key={s} size='sm' variant='outlined' sx={chipSx}>
                {s}
              </Chip>
            ))}
          </Box>
        </Box>

        <Box className='section' data-block='security' sx={{ mt: 3 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Security & Compliance
          </Typography>
          <Box sx={chipCloudSx}>
            {securitySkills.map((s) => (
              <Chip key={s} size='sm' variant='outlined' sx={chipSx}>
                {s}
              </Chip>
            ))}
          </Box>
        </Box>

        {/* Experience */}
        <Box className='section' data-block='experience' sx={{ mt: 4 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Experience
          </Typography>
          <List sx={{ mt: 1, '--ListItemDecorator-size': '0px', p: 0 }}>
            {experience.map((exp) => (
              <ListItem key={exp.company} sx={{ alignItems: 'flex-start', px: 0, py: 0.8 }}>
                <ListItemContent>
                  <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
                    {exp.role}
                  </Typography>
                  <Typography level='body-xs' sx={{ color: colors.textBody }}>
                    {exp.company}
                  </Typography>
                </ListItemContent>
                <Typography level='body-xs' sx={{ color: colors.textMuted, minWidth: 90, textAlign: 'right' }}>
                  {exp.years}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Education */}
        <Box className='section' data-block='education' sx={{ mt: 4 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Education
          </Typography>
          <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text, mt: 1 }}>
            Bachelor's Degree in Computer Science / Information Technology
          </Typography>
          <Typography level='body-xs' sx={{ color: colors.textBody }}>
            Prince of Songkla University (PSU) or equivalent
          </Typography>
        </Box>

        {/* Visual Tech Stack icons */}
        <Box className='section' data-block='visual-stack' sx={{ mt: 4 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Visual Tech Stack
          </Typography>
          {/* <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box component='img' src='https://skillicons.dev/icons?i=html,css,mui,' alt='base-styles' sx={iconRowSx} />
            <Box
              component='img'
              src='https://skillicons.dev/icons?i=js,ts,react,electron,nodejs,nextjs,redis,regex,flutter,django,threejs,php'
              alt='lang-fw'
              sx={iconRowSx}
            />
            <Box
              component='img'
              src='https://skillicons.dev/icons?i=mongodb,postgres,mysql,graphql,apollo,sqlite'
              alt='datastores'
              sx={iconRowSx}
            />
            <Box
              component='img'
              src='https://skillicons.dev/icons?i=py,git,github,gitlab,vscode,linux,postman,babel,docker'
              alt='tooling'
              sx={iconRowSx}
            />
          </Box> */}
          <img src='https://skillicons.dev/icons?i=html,css,mui,' />
          <img
            src='https://skillicons.dev/icons?i=js,ts,react,electron,nodejs,nextjs,redis,regex,flutter,django,threejs,php'
            alt='padgad-tech'
          />
          <img src='https://skillicons.dev/icons?i=mongodb,postgres,mysql,graphql,apollo,sqlite' alt='padgad-tech1' />
          <img
            src='https://skillicons.dev/icons?i=py,git,github,gitlab,vscode,linux,postman,babel,docker'
            alt='padgad-tech2'
          />
        </Box>

        {/* Selected Projects */}
        <Box className='section project-images' data-block='projects' sx={{ mt: 4 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Selected Projects
          </Typography>
          <List sx={{ mt: 1, '--ListItemDecorator-size': '0px', p: 0 }}>
            <ListItem sx={{ alignItems: 'flex-start', px: 0, py: 0.8 }}>
              <ListItemContent>
                <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
                  CCTV Staff Detection System
                </Typography>
                <Typography level='body-xs' sx={{ color: colors.textBody }}>
                  Node.js + Kafka + Redis + Prisma + PostgreSQL + Docker
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem sx={{ alignItems: 'flex-start', px: 0, py: 0.8 }}>
              <ListItemContent>
                <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
                  Esports Platform
                </Typography>
                <Typography level='body-xs' sx={{ color: colors.textBody }}>
                  React + Node.js + PostgreSQL + Docker Compose + Nginx
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem sx={{ alignItems: 'flex-start', px: 0, py: 0.8 }}>
              <ListItemContent>
                <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
                  Softphone App
                </Typography>
                <Typography level='body-xs' sx={{ color: colors.textBody }}>
                  Flutter + SIP.js + Asterisk + Firebase Messaging
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem sx={{ alignItems: 'flex-start', px: 0, py: 0.8 }}>
              <ListItemContent>
                <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
                  Health Tracker App
                </Typography>
                <Typography level='body-xs' sx={{ color: colors.textBody }}>
                  Flutter + Huawei Health + Firestore
                </Typography>
              </ListItemContent>
            </ListItem>
            <ListItem sx={{ alignItems: 'flex-start', px: 0, py: 0.8 }}>
              <ListItemContent>
                <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
                  On-premise Knowledge Base
                </Typography>
                <Typography level='body-xs' sx={{ color: colors.textBody }}>
                  Weaviate + Amazon Bedrock + GPT integration
                </Typography>
              </ListItemContent>
            </ListItem>
          </List>
        </Box>

        {/* Languages */}
        <Box className='section' data-block='languages' sx={{ mt: 4 }}>
          <Typography level='title-md' sx={sectionTitleSx}>
            Languages
          </Typography>
          <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text, mt: 1 }}>
            Thai (Native)
          </Typography>
          <Typography level='body-sm' sx={{ fontWeight: 600, color: colors.text }}>
            English ( Fair)
          </Typography>
        </Box>

        <Divider sx={{ my: 4, borderColor: accentAlpha(0.2) }} />
        <Typography level='body-xs' sx={{ color: colors.textDim, textAlign: 'center', mt: 'auto' }}>
          • Last update: {new Date().toLocaleDateString()}
        </Typography>
      </Card>
      <style>{printStyles}</style>
    </Box>
  );
};

// Styles extracted for reuse
const sectionTitleSx = {
  color: colors.accent,
  fontSize: 14,
  fontFamily: fonts.mono,
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  mb: 2,
};

const bodyTextSx = {
  color: colors.textBody,
  lineHeight: 1.55,
  fontSize: 14,
};

const chipCloudSx = { display: 'flex', gap: 0.8, flexWrap: 'wrap', mt: 1 };
const chipSx = {
  borderColor: accentAlpha(0.3),
  color: colors.text,
  fontFamily: fonts.mono,
  fontSize: 12,
  background: `linear-gradient(135deg, ${accentAlpha(0.1)}, ${accentAlpha(0.05)})`,
  backdropFilter: 'blur(4px)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'border-color .35s ease, background .35s ease, transform 180ms ease',
  '&:before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(120deg, ${accentAlpha(0.15)}, transparent 55%)`,
    opacity: 0,
    transition: 'opacity .4s ease',
  },
  '&:hover': {
    borderColor: accentAlpha(0.6),
    background: `linear-gradient(135deg, ${accentAlpha(0.2)}, ${accentAlpha(0.1)})`,
    transform: 'translateY(-2px)',
  },
  '&:hover:before': {
    opacity: 1,
  },
};

const iconRowSx = {
  width: { xs: '100%', sm: '85%', md: '70%' },
  maxWidth: 560,
  display: 'block',
  marginInline: 'auto',
  filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.45))',
  opacity: 0.9,
  transition: 'transform 120ms ease, opacity 200ms ease',
  '&:hover': {
    transform: 'scale(1.015)',
    opacity: 1,
  },
};

const projectImageSx = {
  flex: 1,
  minWidth: { xs: '100%', sm: 320 },
  maxWidth: { sm: 'calc(30% - 8px)' },
  borderRadius: 10,
  border: `1px solid ${accentAlpha(0.25)}`,
  background: colors.surfaceCard,
  padding: 1,
  display: 'block',
  width: '100%',
  objectFit: 'cover',
  boxShadow: '0 4px 18px -6px rgba(0,0,0,0.55)',
  transition: 'transform 260ms ease, box-shadow 260ms ease, border-color 260ms ease',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.015)',
    boxShadow: '0 8px 26px -4px rgba(0,0,0,0.65)',
    borderColor: accentAlpha(0.5),
  },
};

const printStyles = `
@media print {
  body, #root, #resume-root { background: ${colors.surfaceDarkest} !important; -webkit-print-color-adjust: exact; }
  #resume-root { padding: 0 !important; }
  #resume-card { box-shadow: none !important; border: 1px solid ${accentAlpha(0.15)} !important; background: ${colors.surfaceDarkest} !important; padding: 18px !important; min-height: auto !important; }
  #resume-card:before { display: none !important; }
  #resume-card .section { break-inside: avoid; page-break-inside: avoid; }
  #resume-card .section + .section { margin-top: 14px !important; }
  #resume-card h2, #resume-card [data-block] > h2 { margin-bottom: 4px !important; }
  #resume-card h2 { font-size: 22px !important; }
  #resume-card [data-block] h6, #resume-card [data-block] .MuiTypography-root { font-size: 11px !important; }
  #resume-card .MuiChip-root { transform: none !important; font-size: 10px !important; line-height: 1.2 !important; padding-inline: 4px !important; }
  #resume-card .MuiList-root { margin-top: 4px !important; }
  #resume-card .MuiListItem-root { padding-top: 2px !important; padding-bottom: 2px !important; }
  #resume-card img { max-width: 100% !important; height: auto !important; }
  #resume-card .project-images img { flex: 1 1 48% !important; max-height: 160px !important; object-fit: cover; }
  #resume-card .project-images { gap: 10px !important; }
  /* Further compression for single-page fit */
  #resume-card { font-size: 11px !important; }
  #resume-card [data-block='summary'] p { font-size: 11px !important; line-height: 1.35 !important; }
  #resume-card [data-block='experience'] .MuiTypography-body-sm { font-size: 11px !important; }
  #resume-card [data-block='experience'] .MuiTypography-body-xs { font-size: 10px !important; }
  #resume-card [data-block='core-skills'] .MuiChip-root, #resume-card [data-block='tooling'] .MuiChip-root { font-size: 9px !important; padding-inline: 3px !important; }
  #resume-card [data-block='visual-stack'] { display: none !important; }
  /* Shrink project images more */
  #resume-card .project-images img { max-height: 130px !important; }
  /* Tighten section spacing */
  #resume-card [data-block] { margin-top: 10px !important; }
  #resume-card [data-block='core-skills'], #resume-card [data-block='tooling'] { margin-top: 8px !important; }
  /* Reduce divider margins */
  #resume-card hr { margin-block: 10px !important; }
  #resume-root button, #resume-root a[href^="http"] { text-decoration: none; }
  #resume-root button { display: none !important; }
  @page { size: A4; margin: 10mm; }
  html, body { height: auto !important; }
  /* Scale down overall to ensure single page fit if content near overflow */
  #resume-root { zoom: .82; }
}
@page { size: A4; margin: 10mm; }
@keyframes titlePulse { 0%,100% { text-shadow: 0 0 6px ${accentAlpha(0.25)}, 0 0 14px ${accentAlpha(0.15)};} 50% { text-shadow: 0 0 10px ${accentAlpha(0.55)}, 0 0 22px ${accentAlpha(0.35)};} }
@keyframes headerGlow { 0%,100% { opacity: .40; transform: scale(1);} 50% { opacity: .65; transform: scale(1.05);} }
`;

export default Resume;

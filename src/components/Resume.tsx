import * as React from 'react';
import { Avatar, Box, Button, Chip, Divider, Link, Typography } from '@mui/joy';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import RocketLaunchOutlinedIcon from '@mui/icons-material/RocketLaunchOutlined';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import { accentAlpha, colors, fonts } from '../themeConfig';

const profile = {
  name: 'Phairat Kaewkandee',
  alias: 'PadGad',
  role: 'Senior Software Engineer',
  specialty: 'AI Platform · Backend · Cloud Infrastructure',
  email: 'phairat101039@gmail.com',
  github: 'https://github.com/padgad336',
  image: 'https://avatars.githubusercontent.com/u/67619755?v=4',
};

const experience = [
  { role: 'Senior Developer', company: 'A Dot Co., Ltd.', period: '2024 — Present', current: true },
  { role: 'Senior Developer', company: 'Stream South Technology Co., Ltd.', period: '2020 — 2024' },
  { role: 'Senior Developer', company: 'aheadall Co., Ltd.', period: '2020 — 2021' },
  { role: 'Developer', company: 'Thaidotrun', period: '2019 — 2020' },
];

const projects = [
  {
    name: 'Enterprise LLM Gateway / AIYARA Platform',
    detail: 'Multi-provider routing, OpenAI-compatible APIs, governance, PII guardrails, Docker and Nginx.',
    tags: ['LLM', 'API Platform', 'Security'],
  },
  {
    name: 'Enterprise Knowledge Management & KM Drive',
    detail: 'A permissioned document platform with ingestion pipelines, search, storage integrations and background jobs.',
    tags: ['NestJS', 'PostgreSQL', 'Redis'],
  },
  {
    name: 'Enterprise RAG & Document Retrieval Platform',
    detail: 'Document ingestion, BGE-M3 embeddings, reranking, citations and RBAC-aware retrieval.',
    tags: ['RAG', 'Qdrant', 'AI Search'],
  },
  {
    name: 'CCTV Staff Detection & Event Pipeline',
    detail: 'A real-time event pipeline built around Node.js, Kafka, Redis, Prisma and PostgreSQL.',
    tags: ['Kafka', 'Real-time', 'Computer Vision'],
  },
];

const skillGroups = [
  { title: 'Core engineering', skills: ['TypeScript', 'Node.js', 'NestJS', 'Next.js', 'React', 'Flutter', 'Python', 'GraphQL'] },
  { title: 'AI & data', skills: ['LLM Gateway', 'RAG', 'MCP', 'Qdrant', 'Weaviate', 'PostgreSQL', 'MongoDB', 'Redis'] },
  { title: 'Platform & security', skills: ['Docker', 'Kubernetes', 'GitHub Actions', 'Nginx', 'Kafka', 'RBAC', 'OAuth', 'AI Guardrails'] },
];

const sectionHeading = (label: string, Icon: React.ElementType) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
    <Box
      sx={{
        width: 30,
        height: 30,
        display: 'grid',
        placeItems: 'center',
        borderRadius: '9px',
        color: colors.accentDeep,
        bgcolor: accentAlpha(0.09),
      }}
    >
      <Icon sx={{ fontSize: 17 }} />
    </Box>
    <Typography sx={sectionTitleSx}>{label}</Typography>
  </Box>
);

export const Resume: React.FC = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const reveal = (delay = 0) => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 650ms ease ${delay}ms, transform 650ms cubic-bezier(.2,.8,.2,1) ${delay}ms`,
  });

  return (
    <Box id='resume-root' sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 1.5, sm: 3, lg: 4 }, py: { xs: 2, md: 4 } }}>
      <Box id='resume-sheet' sx={{ ...reveal(), overflow: 'hidden', border: `1px solid ${colors.border}`, borderRadius: { xs: 18, md: 24 }, bgcolor: colors.surfaceSolid, boxShadow: '0 30px 70px -50px rgba(17, 78, 48, .45)' }}>
        <Box
          id='resume-hero'
          sx={{
            position: 'relative', overflow: 'hidden', px: { xs: 2.5, sm: 4.5, md: 6 }, pt: { xs: 3.5, md: 5 }, pb: { xs: 3, md: 4 },
            background: 'linear-gradient(120deg, #f8fcf8 0%, #eff8f1 50%, #e1f1e5 100%)',
            '&::after': { content: '""', position: 'absolute', width: 400, height: 400, borderRadius: '50%', right: -150, top: -250, bgcolor: accentAlpha(.1), boxShadow: `0 0 0 60px ${accentAlpha(.045)}, 0 0 0 120px ${accentAlpha(.025)}` },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { sm: 'center' }, gap: { xs: 2, sm: 3 } }}>
            <Avatar src={profile.image} alt={profile.name} sx={{ '--Avatar-size': { xs: '82px', sm: '100px' }, borderRadius: '22px', border: '4px solid white', boxShadow: '0 12px 28px -14px rgba(16, 91, 54, .45)' }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: fonts.mono, color: colors.accent, fontSize: 12, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', mb: .75 }}>
                Hello, I’m {profile.alias}
              </Typography>
              <Typography level='h1' sx={{ fontSize: { xs: 32, sm: 42, md: 48 }, lineHeight: 1.05, letterSpacing: '-1.8px', color: colors.text, fontFamily: fonts.display, fontWeight: 750 }}>
                {profile.name}
              </Typography>
              <Typography sx={{ mt: 1.1, fontSize: { xs: 16, sm: 18 }, color: colors.textBody, fontWeight: 650 }}>
                {profile.role}
              </Typography>
              <Typography sx={{ mt: .2, fontSize: 14, color: colors.accentDeep }}>{profile.specialty}</Typography>
            </Box>
            <Button className='print-button' variant='outlined' size='sm' startDecorator={<PrintRoundedIcon />} onClick={() => window.print()} sx={{ alignSelf: { xs: 'flex-start', sm: 'center' }, borderColor: accentAlpha(.35), color: colors.accentDeep, bgcolor: 'rgba(255,255,255,.55)' }}>
              Print / Save PDF
            </Button>
          </Box>
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2.5 }, mt: 3, pt: 2.25, borderTop: `1px solid ${accentAlpha(.15)}` }}>
            <Link href={`mailto:${profile.email}`} sx={contactSx}><EmailRoundedIcon sx={{ fontSize: 16 }} />{profile.email}</Link>
            <Link href={profile.github} target='_blank' rel='noreferrer' sx={contactSx}><GitHubIcon sx={{ fontSize: 16 }} />github.com/padgad336 <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} /></Link>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.55fr) minmax(270px, .8fr)' } }}>
          <Box component='main' sx={{ px: { xs: 2.5, sm: 4.5, md: 6 }, py: { xs: 3.5, md: 5 }, minWidth: 0 }}>
            <Box component='section' sx={reveal(80)}>
              {sectionHeading('Profile', CodeRoundedIcon)}
              <Typography sx={{ color: colors.textBody, fontFamily: fonts.body, fontSize: { xs: 15, md: 16 }, lineHeight: 1.75, maxWidth: 760 }}>
                Senior software engineer who turns complex operational needs into dependable platforms. I work across backend systems, cloud infrastructure and AI products—from real-time integrations and secure enterprise deployments to retrieval-augmented knowledge systems.
              </Typography>
            </Box>

            <Divider sx={dividerSx} />

            <Box component='section' sx={reveal(150)}>
              {sectionHeading('Experience', WorkOutlineRoundedIcon)}
              <Box sx={{ display: 'grid', gap: 0 }}>
                {experience.map((item, index) => (
                  <Box key={`${item.company}-${item.period}`} sx={{ display: 'grid', gridTemplateColumns: '18px minmax(0, 1fr)', gap: 1.5, pb: index === experience.length - 1 ? 0 : 2.4, position: 'relative' }}>
                    <Box sx={{ position: 'relative', pt: .65, '&::before': { content: '""', display: 'block', width: 9, height: 9, borderRadius: '50%', bgcolor: item.current ? colors.accent : '#b7cbbd', boxShadow: item.current ? `0 0 0 5px ${accentAlpha(.12)}` : 'none' }, '&::after': index === experience.length - 1 ? {} : { content: '""', position: 'absolute', top: 17, left: 4, width: 1, height: 'calc(100% - 7px)', bgcolor: '#d9e7dd' } }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'baseline' }}>
                      <Box>
                        <Typography sx={{ color: colors.text, fontWeight: 700, fontSize: 15 }}>{item.role}</Typography>
                        <Typography sx={{ color: colors.textBody, fontSize: 14, mt: .15 }}>{item.company}</Typography>
                      </Box>
                      <Typography sx={{ flex: '0 0 auto', color: item.current ? colors.accentDeep : colors.textMuted, fontFamily: fonts.mono, fontSize: 11, whiteSpace: 'nowrap' }}>{item.period}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={dividerSx} />

            <Box component='section' sx={reveal(220)}>
              {sectionHeading('Selected work', RocketLaunchOutlinedIcon)}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' }, gap: 1.5 }}>
                {projects.map((project) => (
                  <Box key={project.name} sx={{ p: 2, border: `1px solid ${colors.borderLight}`, borderRadius: 14, bgcolor: '#f9fbfa', transition: 'transform .2s ease, border-color .2s ease, box-shadow .2s ease', '&:hover': { transform: 'translateY(-3px)', borderColor: accentAlpha(.3), boxShadow: '0 12px 22px -20px rgba(17,78,48,.75)' } }}>
                    <Typography sx={{ color: colors.text, fontSize: 14, fontWeight: 700, lineHeight: 1.35 }}>{project.name}</Typography>
                    <Typography sx={{ color: colors.textBody, fontFamily: fonts.body, fontSize: 13.5, lineHeight: 1.65, mt: .75 }}>{project.detail}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .6, mt: 1.25 }}>
                      {project.tags.map((tag) => <Chip key={tag} size='sm' variant='soft' sx={tagSx}>{tag}</Chip>)}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box component='aside' sx={{ px: { xs: 2.5, sm: 4.5, md: 3.5 }, py: { xs: 3.5, md: 5 }, borderTop: { xs: `1px solid ${colors.borderLight}`, md: 'none' }, borderLeft: { md: `1px solid ${colors.borderLight}` }, bgcolor: '#f4f8f5' }}>
            <Box component='section' sx={reveal(120)}>
              {sectionHeading('Expertise', CodeRoundedIcon)}
              <Box sx={{ display: 'grid', gap: 2.25 }}>
                {skillGroups.map((group) => (
                  <Box key={group.title}>
                    <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11.5, fontWeight: 700, letterSpacing: '.7px', textTransform: 'uppercase', mb: .9 }}>{group.title}</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .65 }}>
                      {group.skills.map((skill) => <Chip key={skill} size='sm' variant='outlined' sx={skillSx}>{skill}</Chip>)}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Divider sx={dividerSx} />

            <Box component='section' sx={reveal(190)}>
              {sectionHeading('Education', SchoolOutlinedIcon)}
              <Typography sx={{ color: colors.text, fontSize: 14, fontWeight: 700, lineHeight: 1.45 }}>Computer Science / Information Technology</Typography>
              <Typography sx={{ color: colors.textBody, fontSize: 13, mt: .4 }}>Prince of Songkla University (PSU)</Typography>
            </Box>

            <Divider sx={dividerSx} />

            <Box component='section' sx={reveal(250)}>
              <Typography sx={{ fontFamily: fonts.mono, color: colors.accent, fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>Languages</Typography>
              <Box sx={{ display: 'grid', gap: .75, mt: 1.25 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography sx={languageSx}>Thai</Typography><Typography sx={proficiencySx}>Native</Typography></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}><Typography sx={languageSx}>English</Typography><Typography sx={proficiencySx}>Working proficiency</Typography></Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Typography className='updated-label' sx={{ color: colors.textDim, fontFamily: fonts.mono, fontSize: 10, textAlign: 'center', mt: 1.75 }}>LAST UPDATED · {new Date().toLocaleDateString()}</Typography>
      <style>{printStyles}</style>
    </Box>
  );
};

const sectionTitleSx = { color: colors.text, fontSize: 15, fontFamily: fonts.mono, fontWeight: 700, letterSpacing: '.4px', textTransform: 'uppercase' };
const contactSx = { display: 'inline-flex', alignItems: 'center', gap: .65, color: colors.textBody, fontSize: 14, fontWeight: 600, '&:hover': { color: colors.accent } };
const dividerSx = { my: { xs: 3, md: 4 }, borderColor: colors.borderLight };
const tagSx = { '--Chip-radius': '6px', bgcolor: accentAlpha(.09), color: colors.accentDeep, fontFamily: fonts.mono, fontSize: 11, fontWeight: 600 };
const skillSx = { '--Chip-radius': '7px', borderColor: colors.borderMedium, color: colors.textBody, bgcolor: '#fff', fontSize: 12, '&:hover': { borderColor: colors.borderHover, bgcolor: accentAlpha(.07) } };
const languageSx = { color: colors.text, fontSize: 13, fontWeight: 650 };
const proficiencySx = { color: colors.textMuted, fontSize: 12, textAlign: 'right' };

const printStyles = `
@media print {
  @page { size: A4; margin: 10mm; }
  body, #root, #resume-root { background: #fff !important; }
  #resume-root { max-width: none !important; padding: 0 !important; }
  #resume-sheet { border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
  #resume-hero { padding: 16px 20px !important; }
  .print-button, .updated-label { display: none !important; }
  #resume-sheet main, #resume-sheet aside { padding: 20px !important; }
  #resume-sheet aside { border-left: 1px solid #d9e7dd !important; }
  #resume-sheet section, #resume-sheet > div { break-inside: avoid; page-break-inside: avoid; }
  #resume-sheet .MuiChip-root { font-size: 9px !important; min-height: 20px !important; }
  #resume-sheet .MuiDivider-root { margin-block: 16px !important; }
  a { color: inherit !important; text-decoration: none !important; }
}
`;

export default Resume;

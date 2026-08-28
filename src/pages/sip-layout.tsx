import * as React from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { colors, fonts, accentAlpha } from '../themeConfig';

/* ─── Types ──────────────────────────────────────────── */
interface SipMessage {
  raw: string;
  type: 'request' | 'response';
  method: string | null;
  uri: string | null;
  statusCode: number | null;
  statusText: string | null;
  headers: Record<string, string>;
  body: string;
  sdp: SdpInfo | null;
  index: number;
  _inSdp?: boolean;
}

interface SdpInfo {
  codecs: { pt: string; name: string }[];
  candidates: IceCandidate[];
  iceUfrag: string | null;
  icePwd: string | null;
  fingerprint: string | null;
  connection: string | null;
  mediaPort: string | null;
  rtpProfile: string | null;
  ssrc: string[];
  direction: string | null;
  ptime: string | null;
  payloadTypes?: string[];
}

interface IceCandidate {
  foundation?: string;
  component?: string;
  protocol?: string;
  priority?: string;
  ip?: string;
  port?: string;
  type?: string;
  raddr?: string;
  rport?: string;
  raw: string;
}

interface RegisterInfo {
  ext: string;
  domain: string;
  ua: string;
  ok: boolean;
  auth: boolean;
  serverVersion: string;
  natIp: string | null;
  natPort: string | null;
  expires: string | null;
  callId: string;
}

interface CallInfo {
  from: string;
  to: string;
  calledNumber: string;
  callerName: string;
  isIncoming: boolean;
  ua: string;
  codecs: { pt: string; name: string }[];
  status: string;
  displayPai: string;
  byeReason: string;
  callId: string;
  sdpInfo: SdpInfo | null;
  flow: SipMessage[];
}

interface NatInfo {
  natIps: Record<string, number>;
  candidates: IceCandidate[];
  iceInfo: {
    ufrag: string | null;
    pwd: string | null;
    fingerprint: string | null;
    from: string;
    direction: string | null;
  }[];
}

interface ServerInfo {
  servers: string[];
  domains: string[];
  ips: string[];
}

interface CodecSession {
  from: string;
  codecs: { pt: string; name: string }[];
  connection: string | null;
  port: string | null;
  profile: string | null;
  direction: string | null;
  ptime: string | null;
  fingerprint: string | null;
  ssrc: string[];
  method: string;
  type: string;
}

/* ─── CSS-in-JS Styles ───────────────────────────────── */
const sx = {
  root: {
    p: { xs: 2, md: 3 },
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.text,
    minHeight: 'calc(100vh - 56px)',
  },
  title: { color: colors.text, mb: 0.75, fontSize: { xs: 23, md: 28 }, fontWeight: 700, fontFamily: fonts.mono },
  subtitle: { color: colors.textMuted, mb: 2.5, fontSize: 14, lineHeight: 1.65, fontFamily: fonts.body },
  fileInput: {
    mb: 2.5,
    '& input': {
      background: colors.surfaceSolid,
      border: `1px dashed ${accentAlpha(0.2)}`,
      color: colors.text,
      p: '12px 20px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: 14,
      fontFamily: fonts.mono,
      '&:hover': { borderColor: colors.accent },
    },
  },
  tabs: { display: 'flex', gap: '2px', flexWrap: 'wrap', mb: 0 },
  tab: {
    px: 2,
    py: 1.15,
    background: colors.surfaceSolid,
    border: `1px solid ${accentAlpha(0.12)}`,
    borderBottom: 'none',
    borderRadius: '6px 6px 0 0',
    cursor: 'pointer',
    color: colors.textMuted,
    fontSize: 13,
    fontFamily: fonts.mono,
    transition: 'all 0.15s',
    '&:hover': { color: colors.text, background: colors.surface },
  },
  tabActive: {
    background: colors.surfaceSolid,
    color: colors.accent,
    borderColor: colors.accent,
    fontWeight: 'bold',
  },
  badge: {
    background: accentAlpha(0.15),
    color: colors.textMuted,
    px: '6px',
    py: '1px',
    borderRadius: '10px',
    fontSize: 11,
    ml: 0.5,
    display: 'inline-block',
  },
  badgeActive: { background: colors.accentDeep, color: '#fff' },
  tabContent: {
    background: colors.surfaceSolid,
    border: `1px solid ${colors.border}`,
    borderRadius: '0 10px 10px 10px',
    p: { xs: 1.5, md: 2.5 },
    mb: 2.5,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: fonts.mono,
    mb: 1.5,
    pb: 0.8,
    borderBottom: `1px solid ${accentAlpha(0.12)}`,
  },
  card: {
    background: colors.surfaceSolid,
    border: `1px solid ${colors.borderLight}`,
    borderRadius: '10px',
    p: 2,
    mb: 1,
    '&:hover': { borderColor: accentAlpha(0.25) },
  },
  label: { color: colors.textMuted, fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  value: { color: colors.text, mt: 0.4, fontSize: 13.5, lineHeight: 1.55, wordBreak: 'break-all' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1.2 },
  tag: {
    display: 'inline-block',
    px: 1,
    py: '2px',
    borderRadius: '12px',
    fontSize: 12,
    fontWeight: 'bold',
    m: '2px',
    fontFamily: fonts.mono,
  },
  empty: { color: colors.textDim, fontSize: 13, fontStyle: 'italic', p: 2.5, textAlign: 'center' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    fontFamily: fonts.mono,
    '& th': {
      textAlign: 'left',
      p: '8px 10px',
      background: colors.surfaceSolid,
      color: colors.textMuted,
      borderBottom: `1px solid ${accentAlpha(0.12)}`,
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: 12,
      letterSpacing: '0.5px',
    },
    '& td': { p: '6px 10px', borderBottom: `1px solid ${accentAlpha(0.08)}`, verticalAlign: 'top' },
    '& tr:hover td': { background: colors.surfaceSolid },
  },
} as const;

/* tag colors matching theme */
const tagColors = {
  green: { bg: 'rgba(36,122,66,0.12)', color: '#247a42', border: '1px solid rgba(36,122,66,0.32)' },
  red: { bg: 'rgba(180,35,24,0.08)', color: '#b42318', border: '1px solid rgba(180,35,24,0.25)' },
  yellow: { bg: 'rgba(153,107,0,0.10)', color: '#805b00', border: '1px solid rgba(153,107,0,0.28)' },
  blue: { bg: accentAlpha(0.12), color: colors.accent, border: `1px solid ${accentAlpha(0.3)}` },
  purple: { bg: accentAlpha(0.10), color: colors.accentDeep, border: `1px solid ${accentAlpha(0.28)}` },
  cyan: { bg: 'rgba(63,127,91,0.10)', color: colors.secondary, border: '1px solid rgba(63,127,91,0.28)' },
  orange: { bg: 'rgba(165,82,22,0.09)', color: '#a55216', border: '1px solid rgba(165,82,22,0.25)' },
};

const Tag: React.FC<{ color: keyof typeof tagColors; children: React.ReactNode }> = ({ color, children }) => (
  <Box
    component='span'
    sx={{ ...sx.tag, background: tagColors[color].bg, color: tagColors[color].color, border: tagColors[color].border }}
  >
    {children}
  </Box>
);

/* ─── Parser Helpers (ported from vanilla JS) ────────── */
function parseSipMessages(text: string): SipMessage[] {
  const lines = text.split('\n');
  const messages: SipMessage[] = [];
  let current: SipMessage | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const reqMatch = line.match(
      /^(REGISTER|INVITE|ACK|BYE|CANCEL|OPTIONS|NOTIFY|INFO|REFER|SUBSCRIBE|PUBLISH|UPDATE|PRACK|MESSAGE)\s+(sip:\S+)\s+SIP\/2\.0\s*$/,
    );
    const resMatch = line.match(/^SIP\/2\.0\s+(\d+)\s+(.+)$/);

    if (reqMatch || resMatch) {
      if (current) messages.push(current);
      current = {
        raw: line + '\n',
        type: reqMatch ? 'request' : 'response',
        method: reqMatch ? reqMatch[1] : null,
        uri: reqMatch ? reqMatch[2] : null,
        statusCode: resMatch ? parseInt(resMatch[1]) : null,
        statusText: resMatch ? resMatch[2].trim() : null,
        headers: {},
        body: '',
        sdp: null,
        index: messages.length,
      };
    } else if (current) {
      current.raw += line + '\n';
      const hdr = line.match(/^([A-Za-z][A-Za-z0-9-]*)\s*:\s*(.*)$/);
      if (hdr) {
        const key = hdr[1].toLowerCase();
        current.headers[key] = current.headers[key] ? current.headers[key] + '\n' + hdr[2] : hdr[2];
      }
      if (line.startsWith('v=0')) {
        current.body += line + '\n';
        current._inSdp = true;
      } else if (current._inSdp) {
        if (line.trim() === '' && !lines[i + 1]?.match(/^[a-z]=/)) {
          current._inSdp = false;
          current.sdp = parseSdp(current.body);
        } else {
          current.body += line + '\n';
        }
      }
    }
  }
  if (current) {
    if (current._inSdp && current.body) current.sdp = parseSdp(current.body);
    messages.push(current);
  }
  messages.forEach((m) => {
    if (m.type === 'response' && m.headers['cseq']) {
      const cs = m.headers['cseq'].match(/\d+\s+(\w+)/);
      if (cs) m.method = cs[1];
    }
  });
  return messages;
}

function parseSdp(body: string): SdpInfo {
  const sdp: SdpInfo = {
    codecs: [],
    candidates: [],
    iceUfrag: null,
    icePwd: null,
    fingerprint: null,
    connection: null,
    mediaPort: null,
    rtpProfile: null,
    ssrc: [],
    direction: null,
    ptime: null,
  };
  body.split('\n').forEach((line) => {
    const l = line.trim();
    if (l.startsWith('c=')) {
      const m = l.match(/IN\s+IP[46]\s+(\S+)/);
      if (m) sdp.connection = m[1];
    }
    if (l.startsWith('m=audio')) {
      const m = l.match(/m=audio\s+(\d+)\s+(\S+)\s+(.*)/);
      if (m) {
        sdp.mediaPort = m[1];
        sdp.rtpProfile = m[2];
        sdp.payloadTypes = m[3].split(/\s+/);
      }
    }
    if (l.startsWith('a=rtpmap:')) {
      const m = l.match(/a=rtpmap:(\d+)\s+(.+)/);
      if (m) sdp.codecs.push({ pt: m[1], name: m[2] });
    }
    if (l.startsWith('a=candidate:')) sdp.candidates.push(parseCandidate(l));
    if (l.startsWith('a=ice-ufrag:')) sdp.iceUfrag = l.split(':')[1];
    if (l.startsWith('a=ice-pwd:')) sdp.icePwd = l.split(':').slice(1).join(':');
    if (l.startsWith('a=fingerprint:')) sdp.fingerprint = l.substring('a=fingerprint:'.length);
    if (l.startsWith('a=ssrc:')) sdp.ssrc.push(l.substring('a=ssrc:'.length));
    if (l.match(/^a=(sendrecv|sendonly|recvonly|inactive)$/)) sdp.direction = l.substring(2);
    if (l.startsWith('a=ptime:')) sdp.ptime = l.split(':')[1];
  });
  return sdp;
}

function parseCandidate(line: string): IceCandidate {
  const m = line.match(/a=candidate:(\S+)\s+(\d+)\s+(\w+)\s+(\d+)\s+(\S+)\s+(\d+)\s+typ\s+(\w+)(.*)/);
  if (!m) return { raw: line };
  const c: IceCandidate = {
    foundation: m[1],
    component: m[2],
    protocol: m[3],
    priority: m[4],
    ip: m[5],
    port: m[6],
    type: m[7],
    raw: line,
  };
  const raddr = m[8]?.match(/raddr\s+(\S+)/);
  const rport = m[8]?.match(/rport\s+(\d+)/);
  if (raddr) c.raddr = raddr[1];
  if (rport) c.rport = rport[1];
  return c;
}

const getFromUser = (m: SipMessage) => (m.headers['from'] || '').match(/<sip:([^@>]+)@/)?.[1] || '';
const getToUser = (m: SipMessage) => (m.headers['to'] || '').match(/<sip:([^@>]+)@/)?.[1] || '';
const getCallId = (m: SipMessage) => m.headers['call-id'] || '';

/* ─── Extractors ─────────────────────────────────────── */
function extractRegisters(messages: SipMessage[]): RegisterInfo[] {
  const regs: RegisterInfo[] = [];
  const callIds = new Set<string>();
  messages.forEach((m) => {
    if (m.method === 'REGISTER') {
      const cid = getCallId(m);
      if (callIds.has(cid)) return;
      const ext = getFromUser(m);
      const domain = (m.headers['from'] || '').match(/@([^>;]+)/)?.[1] || '';
      const ua = m.headers['user-agent'] || '';
      const responses = messages.filter(
        (r) => r.type === 'response' && r.method === 'REGISTER' && getCallId(r) === cid,
      );
      const ok = responses.find((r) => r.statusCode === 200);
      const auth = responses.find((r) => r.statusCode === 401);
      const serverVersion = responses.map((r) => r.headers['server']).find(Boolean) || '';
      let natIp: string | null = null,
        natPort: string | null = null;
      responses.forEach((r) => {
        const via = r.headers['via'] || '';
        const recv = via.match(/received=([^;,\s]+)/);
        const rp = via.match(/rport=(\d+)/);
        if (recv) natIp = recv[1];
        if (rp) natPort = rp[1];
      });
      let expires: string | null = null;
      if (ok) {
        const exp = (ok.headers['contact'] || '').match(/expires=(\d+)/);
        if (exp) expires = exp[1];
      }
      callIds.add(cid);
      regs.push({ ext, domain, ua, ok: !!ok, auth: !!auth, serverVersion, natIp, natPort, expires, callId: cid });
    }
  });
  return regs;
}

function extractCalls(messages: SipMessage[]): CallInfo[] {
  const calls: CallInfo[] = [];
  const seen = new Set<string>();
  messages.forEach((m) => {
    if (m.method === 'INVITE' && m.type === 'request') {
      const cid = getCallId(m);
      if (seen.has(cid)) return;
      seen.add(cid);
      const from = getFromUser(m);
      const to = getToUser(m);
      const uri = m.uri || '';
      const calledNumber = uri.match(/sip:([^@]+)@/)?.[1] || to;
      const ua = m.headers['user-agent'] || '';
      const isIncoming = ua.includes('FPBX') || ua.includes('Asterisk');
      const pai = m.headers['p-asserted-identity'] || '';
      const callerName = (m.headers['from'] || '').match(/"([^"]+)"/)?.[1] || from;
      const paiName = pai.match(/"([^"]+)"/)?.[1] || '';
      const paiNumber = pai.match(/sip:([^@>]+)@/)?.[1] || '';
      const flow = messages.filter((r) => getCallId(r) === cid);
      const ringing = flow.find((r) => r.statusCode === 180);
      const progress = flow.find((r) => r.statusCode === 183);
      const trying = flow.find((r) => r.statusCode === 100);
      const ok200 = flow.find((r) => r.statusCode === 200 && r.method === 'INVITE');
      const bye = flow.find((r) => r.method === 'BYE');
      const cancel = flow.find((r) => r.method === 'CANCEL');
      const err = flow.find((r) => r.type === 'response' && (r.statusCode ?? 0) >= 400 && r.method === 'INVITE');
      let codecs: { pt: string; name: string }[] = [];
      let sdpInfo: SdpInfo | null = null;
      flow.forEach((r) => {
        if (r.sdp && r.sdp.codecs.length > 0) {
          codecs = [...codecs, ...r.sdp.codecs];
          if (!sdpInfo) sdpInfo = r.sdp;
        }
      });
      const codecMap: Record<string, string> = {};
      codecs.forEach((c) => {
        codecMap[c.pt] = c.name;
      });
      codecs = Object.entries(codecMap).map(([pt, name]) => ({ pt, name }));
      let displayPai = paiName || paiNumber;
      if (!displayPai) {
        flow.forEach((r) => {
          const rp = r.headers['p-asserted-identity'] || '';
          if (rp) {
            const n = rp.match(/"([^"]+)"/)?.[1] || '';
            const num = rp.match(/sip:([^@>]+)@/)?.[1] || '';
            if (n || num) displayPai = n ? `${n} <${num}>` : num;
          }
        });
      }
      const byeReason = bye ? bye.headers['reason'] || '' : '';
      let status = 'unknown';
      if (ok200) status = 'answered';
      else if (cancel) status = 'cancelled';
      else if (err) status = `error (${err.statusCode})`;
      else if (ringing || trying || progress) status = 'ringing';
      calls.push({
        from,
        to,
        calledNumber,
        callerName,
        isIncoming,
        ua,
        codecs,
        status,
        displayPai,
        byeReason,
        callId: cid,
        sdpInfo,
        flow,
      });
    }
  });
  return calls;
}

function extractNatInfo(messages: SipMessage[]): NatInfo {
  const natIps: Record<string, number> = {};
  const candidates: IceCandidate[] = [];
  const iceInfo: NatInfo['iceInfo'] = [];
  messages.forEach((m) => {
    const via = m.headers['via'] || '';
    const recv = via.match(/received=([^;,\s]+)/);
    const rp = via.match(/rport=(\d+)/);
    if (recv) {
      const key = recv[1] + ':' + (rp?.[1] || '?');
      natIps[key] = (natIps[key] || 0) + 1;
    }
    if (m.sdp) {
      m.sdp.candidates.forEach((c) => {
        if (c.ip) candidates.push(c);
      });
      if (m.sdp.iceUfrag)
        iceInfo.push({
          ufrag: m.sdp.iceUfrag,
          pwd: m.sdp.icePwd,
          fingerprint: m.sdp.fingerprint,
          from: getFromUser(m) || 'server',
          direction: m.sdp.direction,
        });
    }
  });
  return { natIps, candidates, iceInfo };
}

function extractServerInfo(messages: SipMessage[]): ServerInfo {
  const servers = new Set<string>();
  const domains = new Set<string>();
  const ips = new Set<string>();
  messages.forEach((m) => {
    if (m.headers['server']) servers.add(m.headers['server']);
    if (m.headers['user-agent']) servers.add(m.headers['user-agent']);
    const via = m.headers['via'] || '';
    const viaIp = via.match(/SIP\/2\.0\/\w+\s+([^;,\s:]+)/);
    if (viaIp) ips.add(viaIp[1]);
    if (m.uri) {
      const d = m.uri.match(/@([^:;>]+)/);
      if (d) domains.add(d[1]);
    }
    const contact = m.headers['contact'] || '';
    const cIp = contact.match(/sip:[^@]*@([^:;>]+)/);
    if (cIp) domains.add(cIp[1]);
  });
  return { servers: Array.from(servers), domains: Array.from(domains), ips: Array.from(ips) };
}

function extractCodecInfo(messages: SipMessage[]): CodecSession[] {
  const codecSessions: CodecSession[] = [];
  messages.forEach((m) => {
    if (m.sdp && m.sdp.codecs.length > 0) {
      codecSessions.push({
        from: getFromUser(m) || 'unknown',
        codecs: m.sdp.codecs,
        connection: m.sdp.connection,
        port: m.sdp.mediaPort,
        profile: m.sdp.rtpProfile,
        direction: m.sdp.direction,
        ptime: m.sdp.ptime,
        fingerprint: m.sdp.fingerprint,
        ssrc: m.sdp.ssrc,
        method: m.method || '?',
        type: m.type,
      });
    }
  });
  return codecSessions;
}

/* ─── Sub-components ─────────────────────────────────── */
const RawToggle: React.FC<{ raw: string }> = ({ raw }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Box
        component='button'
        onClick={() => setOpen(!open)}
        sx={{
          background: accentAlpha(0.08),
          color: colors.textMuted,
          border: `1px solid ${accentAlpha(0.12)}`,
          p: '4px 10px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: 11,
          fontFamily: fonts.mono,
          mt: 0.8,
          '&:hover': { color: colors.text, borderColor: accentAlpha(0.25) },
        }}
      >
        {open ? '▾ Hide Raw' : '▸ Show Raw'}
      </Box>
      {open && (
        <Box
          component='pre'
          sx={{
            mt: 1,
            background: colors.surfaceDarkest,
            border: `1px solid ${accentAlpha(0.08)}`,
            borderRadius: '4px',
            p: 1.2,
            whiteSpace: 'pre-wrap',
            fontSize: 11,
            color: colors.textMuted,
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          {raw}
        </Box>
      )}
    </>
  );
};

/* ─── Tabs content renderers ─────────────────────────── */

function OverviewTab({
  registers,
  calls,
  natInfo,
  serverInfo,
  codecInfo,
  messages,
  fileName,
}: {
  registers: RegisterInfo[];
  calls: CallInfo[];
  natInfo: NatInfo;
  serverInfo: ServerInfo;
  codecInfo: CodecSession[];
  messages: SipMessage[];
  fileName: string;
}) {
  const allCodecs: Record<string, boolean> = {};
  codecInfo.forEach((s) =>
    s.codecs.forEach((c) => {
      allCodecs[c.name] = true;
    }),
  );
  const candByType: Record<string, Set<string>> = {};
  natInfo.candidates.forEach((c) => {
    const t = c.type || 'unknown';
    if (!candByType[t]) candByType[t] = new Set();
    candByType[t].add(c.ip + ':' + c.port);
  });

  return (
    <Box>
      <Typography sx={sx.sectionTitle}>File: {fileName}</Typography>
      <Box sx={sx.grid}>
        <Box sx={sx.card}>
          <Box sx={sx.label}>Total SIP Messages</Box>
          <Box sx={{ ...sx.value, fontSize: 24, color: colors.accent }}>{messages.length}</Box>
        </Box>
        <Box sx={sx.card}>
          <Box sx={sx.label}>Servers</Box>
          <Box sx={sx.value}>
            {serverInfo.servers.map((s) => (
              <Tag key={s} color='purple'>
                {s}
              </Tag>
            ))}
          </Box>
        </Box>
        <Box sx={sx.card}>
          <Box sx={sx.label}>Domains / PBX</Box>
          <Box sx={sx.value}>
            {serverInfo.domains.map((d) => (
              <Tag key={d} color='blue'>
                {d}
              </Tag>
            ))}
          </Box>
        </Box>
        <Box sx={sx.card}>
          <Box sx={sx.label}>Codecs Used</Box>
          <Box sx={sx.value}>
            {Object.keys(allCodecs).length
              ? Object.keys(allCodecs).map((c) => (
                  <Tag key={c} color='cyan'>
                    {c}
                  </Tag>
                ))
              : 'N/A'}
          </Box>
        </Box>
      </Box>

      <Typography sx={{ ...sx.sectionTitle, mt: 2.5 }}>Registration Status</Typography>
      {registers.length === 0 ? (
        <Box sx={sx.empty}>No REGISTER found</Box>
      ) : (
        registers.map((r) => (
          <Box key={r.callId} sx={sx.card}>
            <Box sx={{ mb: 1 }}>
              <Tag color={r.ok ? 'green' : 'red'}>
                {r.ext} {r.ok ? '✓ Registered' : '✗ Failed'}
              </Tag>
            </Box>
            <Box sx={sx.grid}>
              <Box>
                <Box sx={sx.label}>Extension</Box>
                <Box sx={{ ...sx.value, fontSize: 18, color: colors.accent, fontWeight: 'bold' }}>{r.ext}</Box>
              </Box>
              <Box>
                <Box sx={sx.label}>Domain</Box>
                <Box sx={sx.value}>{r.domain}</Box>
              </Box>
              <Box>
                <Box sx={sx.label}>Status</Box>
                <Box sx={sx.value}>
                  <Tag color={r.ok ? 'green' : 'red'}>{r.ok ? '200 OK' : 'FAILED'}</Tag>
                </Box>
              </Box>
              <Box>
                <Box sx={sx.label}>Auth Challenge</Box>
                <Box sx={sx.value}>{r.auth ? <Tag color='yellow'>401 → Re-auth ✓</Tag> : 'No'}</Box>
              </Box>
              <Box>
                <Box sx={sx.label}>PBX Server</Box>
                <Box sx={sx.value}>{r.serverVersion}</Box>
              </Box>
              <Box>
                <Box sx={sx.label}>NAT IP</Box>
                <Box sx={sx.value}>
                  {r.natIp ? (
                    <Tag color='orange'>
                      {r.natIp}:{r.natPort}
                    </Tag>
                  ) : (
                    'N/A'
                  )}
                </Box>
              </Box>
              <Box>
                <Box sx={sx.label}>Expires</Box>
                <Box sx={sx.value}>{r.expires ? `${r.expires}s` : 'N/A'}</Box>
              </Box>
            </Box>
          </Box>
        ))
      )}

      <Typography sx={{ ...sx.sectionTitle, mt: 2.5 }}>Calls</Typography>
      {calls.length === 0 ? (
        <Box sx={sx.empty}>No INVITE found</Box>
      ) : (
        calls.map((c) => {
          const dir = c.isIncoming ? '📥 Incoming' : '📤 Outgoing';
          const stColor: keyof typeof tagColors =
            c.status === 'answered'
              ? 'green'
              : c.status === 'cancelled'
                ? 'yellow'
                : c.status.startsWith('error')
                  ? 'red'
                  : 'blue';
          return (
            <Box key={c.callId} sx={sx.card}>
              <Box sx={{ fontWeight: 'bold', mb: 0.8, fontSize: 13 }}>
                {dir}: {c.callerName || c.from} → {c.calledNumber}
              </Box>
              <Tag color={stColor}>{c.status}</Tag>
              {c.displayPai && <Tag color='purple'>PAI: {c.displayPai}</Tag>}
              {c.codecs.map((cd) => (
                <Tag key={cd.pt} color='cyan'>
                  {cd.name}
                </Tag>
              ))}
              {c.byeReason && (
                <Box sx={{ color: colors.textMuted, fontSize: 12, mt: 0.5 }}>BYE Reason: {c.byeReason}</Box>
              )}
            </Box>
          );
        })
      )}

      <Typography sx={{ ...sx.sectionTitle, mt: 2.5 }}>NAT / Public IP</Typography>
      <Box sx={sx.card}>
        <Box sx={sx.label}>Public IP (from Via received=)</Box>
        <Box sx={sx.value}>
          {Object.keys(natInfo.natIps).length ? (
            Object.keys(natInfo.natIps).map((k) => {
              const [ip, port] = k.split(':');
              return (
                <Box
                  key={k}
                  component='span'
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: colors.surfaceDarkest,
                    p: '3px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${accentAlpha(0.08)}`,
                    m: '2px',
                    fontSize: 12,
                  }}
                >
                  {ip}
                  <Box component='span' sx={{ fontSize: 11, color: colors.textMuted }}>
                    :{port}
                  </Box>
                </Box>
              );
            })
          ) : (
            <Box sx={sx.empty}>N/A</Box>
          )}
        </Box>
      </Box>
      <Box sx={sx.card}>
        <Box sx={sx.label}>ICE Candidates</Box>
        <Box sx={sx.value}>
          {Object.keys(candByType).length ? (
            Object.entries(candByType).map(([type, ips]) => {
              const tc: keyof typeof tagColors = type === 'host' ? 'blue' : type === 'srflx' ? 'orange' : 'purple';
              return Array.from(ips).map((ip) => (
                <Tag key={ip} color={tc}>
                  {type}: {ip}
                </Tag>
              ));
            })
          ) : (
            <Box sx={sx.empty}>N/A</Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

function RegisterTab({ registers }: { registers: RegisterInfo[] }) {
  if (!registers.length) return <Box sx={sx.empty}>No REGISTER messages found</Box>;
  return (
    <>
      {registers.map((r) => (
        <Box key={r.callId} sx={sx.card}>
          <Box sx={{ fontSize: 16, fontWeight: 'bold', mb: 1 }}>
            <Tag color={r.ok ? 'green' : 'red'}>{r.ok ? '✓' : '✗'}</Tag> Extension: {r.ext}
          </Box>
          <Box sx={sx.grid}>
            <Box>
              <Box sx={sx.label}>Extension</Box>
              <Box sx={{ ...sx.value, fontSize: 20, color: colors.accent, fontWeight: 'bold' }}>{r.ext}</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>SIP Domain</Box>
              <Box sx={sx.value}>{r.domain}</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Register Result</Box>
              <Box sx={sx.value}>
                <Tag color={r.ok ? 'green' : 'red'}>{r.ok ? '200 OK - Registered' : 'FAILED'}</Tag>
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Auth (401 Challenge)</Box>
              <Box sx={sx.value}>
                {r.auth ? (
                  <Tag color='yellow'>401 → Re-sent with Digest ✓</Tag>
                ) : (
                  <Tag color='green'>No challenge needed</Tag>
                )}
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>PBX / Server</Box>
              <Box sx={sx.value}>
                <Tag color='purple'>{r.serverVersion}</Tag>
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Client User-Agent</Box>
              <Box sx={sx.value}>{r.ua}</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>NAT Public IP</Box>
              <Box sx={sx.value}>
                {r.natIp ? (
                  <>
                    <Tag color='orange'>{r.natIp}</Tag>
                    <Box component='span' sx={{ color: colors.textMuted }}>
                      {' '}
                      port {r.natPort}
                    </Box>
                  </>
                ) : (
                  'N/A'
                )}
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Contact Expires</Box>
              <Box sx={sx.value}>{r.expires || 'N/A'} seconds</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Call-ID</Box>
              <Box sx={{ ...sx.value, fontSize: 12 }}>{r.callId}</Box>
            </Box>
          </Box>
        </Box>
      ))}
    </>
  );
}

function CallsTab({ calls }: { calls: CallInfo[] }) {
  if (!calls.length) return <Box sx={sx.empty}>No INVITE / call messages found</Box>;
  return (
    <>
      {calls.map((c) => {
        const dir = c.isIncoming ? '📥 Incoming (รับสาย)' : '📤 Outgoing (โทรออก)';
        const stColor: keyof typeof tagColors =
          c.status === 'answered'
            ? 'green'
            : c.status === 'cancelled'
              ? 'yellow'
              : c.status.startsWith('error')
                ? 'red'
                : 'blue';
        return (
          <Box key={c.callId} sx={sx.card}>
            <Box sx={{ fontSize: 15, fontWeight: 'bold', mb: 1 }}>{dir}</Box>
            <Box sx={sx.grid}>
              <Box>
                <Box sx={sx.label}>From (โทรจาก)</Box>
                <Box sx={{ ...sx.value, fontSize: 18, color: colors.accent, fontWeight: 'bold' }}>
                  {c.callerName || c.from}
                </Box>
              </Box>
              <Box>
                <Box sx={sx.label}>To (โทรไป)</Box>
                <Box sx={{ ...sx.value, fontSize: 18, color: '#934a12', fontWeight: 'bold' }}>{c.calledNumber}</Box>
              </Box>
              <Box>
                <Box sx={sx.label}>Status</Box>
                <Box sx={sx.value}>
                  <Tag color={stColor}>{c.status.toUpperCase()}</Tag>
                </Box>
              </Box>
              <Box>
                <Box sx={sx.label}>P-Asserted-Identity</Box>
                <Box sx={sx.value}>{c.displayPai ? <Tag color='purple'>{c.displayPai}</Tag> : 'N/A'}</Box>
              </Box>
              <Box>
                <Box sx={sx.label}>Codecs</Box>
                <Box sx={sx.value}>
                  {c.codecs.length
                    ? c.codecs.map((cd) => (
                        <Tag key={cd.pt} color='cyan'>
                          {cd.name} (PT:{cd.pt})
                        </Tag>
                      ))
                    : 'N/A'}
                </Box>
              </Box>
              <Box>
                <Box sx={sx.label}>User-Agent</Box>
                <Box sx={sx.value}>{c.ua}</Box>
              </Box>
              {c.byeReason && (
                <Box>
                  <Box sx={sx.label}>BYE Reason</Box>
                  <Box sx={sx.value}>
                    <Tag color='red'>{c.byeReason}</Tag>
                  </Box>
                </Box>
              )}
              {c.sdpInfo && (
                <>
                  <Box>
                    <Box sx={sx.label}>Media Direction</Box>
                    <Box sx={sx.value}>{c.sdpInfo.direction || 'N/A'}</Box>
                  </Box>
                  <Box>
                    <Box sx={sx.label}>Media IP</Box>
                    <Box sx={sx.value}>{c.sdpInfo.connection || 'N/A'}</Box>
                  </Box>
                  <Box>
                    <Box sx={sx.label}>RTP Port</Box>
                    <Box sx={sx.value}>{c.sdpInfo.mediaPort || 'N/A'}</Box>
                  </Box>
                  <Box>
                    <Box sx={sx.label}>DTLS Fingerprint</Box>
                    <Box sx={{ ...sx.value, fontSize: 11 }}>{c.sdpInfo.fingerprint || 'N/A'}</Box>
                  </Box>
                </>
              )}
              <Box>
                <Box sx={sx.label}>Call-ID</Box>
                <Box sx={{ ...sx.value, fontSize: 12 }}>{c.callId}</Box>
              </Box>
            </Box>
            <Box sx={{ mt: 1.5 }}>
              <Box sx={sx.label}>Call Flow / Timeline</Box>
              <Box sx={{ pl: 2, mt: 1 }}>
                {c.flow.map((m, i) => {
                  const isReq = m.type === 'request';
                  const dotColor = isReq
                    ? colors.accentDeep
                    : (m.statusCode ?? 0) >= 200 && (m.statusCode ?? 0) < 300
                      ? '#238636'
                      : (m.statusCode ?? 0) >= 400
                        ? '#da3633'
                        : '#9e6a03';
                  const label = isReq ? `→ ${m.method}` : `← ${m.statusCode} ${m.statusText}`;
                  return (
                    <Box
                      key={i}
                      sx={{
                        position: 'relative',
                        pl: 2.5,
                        pb: 1,
                        borderLeft: i === c.flow.length - 1 ? 'none' : `2px solid ${accentAlpha(0.12)}`,
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: -5,
                          top: 12,
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: dotColor,
                          border: `2px solid ${colors.surface}`,
                        },
                      }}
                    >
                      <Box sx={{ fontSize: 13, fontWeight: 'bold', color: isReq ? colors.accent : dotColor }}>
                        {label}
                      </Box>
                      {m.sdp && (
                        <Box
                          sx={{
                            fontSize: 11,
                            color: colors.textMuted,
                            mt: 0.5,
                            background: colors.surfaceDarkest,
                            p: '6px 8px',
                            borderRadius: '4px',
                            border: `1px solid ${accentAlpha(0.08)}`,
                          }}
                        >
                          SDP: {m.sdp.connection || '?'}:{m.sdp.mediaPort || '?'} | Codec:{' '}
                          {m.sdp.codecs.map((cc) => cc.name).join(', ') || 'N/A'} | {m.sdp.direction || ''}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}

function NatTab({ natInfo }: { natInfo: NatInfo }) {
  return (
    <Box>
      <Typography sx={sx.sectionTitle}>Public IP (NAT Traversal)</Typography>
      <Box sx={sx.card}>
        <Box sx={{ fontWeight: 'bold', mb: 1, fontSize: 13 }}>Via received= (Public IP ที่ Server เห็น)</Box>
        <Box component='table' sx={sx.table}>
          <thead>
            <tr>
              <th>Public IP:Port</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(natInfo.natIps).map(([k, v]) => (
              <tr key={k}>
                <td>
                  <Tag color='orange'>{k}</Tag>
                </td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
      <Box sx={sx.card}>
        <Box sx={{ fontWeight: 'bold', mb: 1, fontSize: 13 }}>ICE Candidates (จาก SDP)</Box>
        {natInfo.candidates.length === 0 ? (
          <Box sx={sx.empty}>No ICE candidates found</Box>
        ) : (
          <Box component='table' sx={sx.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Protocol</th>
                <th>IP</th>
                <th>Port</th>
                <th>Priority</th>
                <th>Related</th>
              </tr>
            </thead>
            <tbody>
              {natInfo.candidates.map((c, i) => {
                const tc: keyof typeof tagColors =
                  c.type === 'host' ? 'blue' : c.type === 'srflx' ? 'orange' : c.type === 'relay' ? 'green' : 'purple';
                const tl =
                  c.type === 'host'
                    ? 'host (LAN)'
                    : c.type === 'srflx'
                      ? 'srflx (NAT/STUN)'
                      : c.type === 'relay'
                        ? 'relay (TURN)'
                        : c.type || '';
                return (
                  <tr key={i}>
                    <td>
                      <Tag color={tc}>{tl}</Tag>
                    </td>
                    <td>{c.protocol || '?'}</td>
                    <td>
                      <strong>{c.ip || '?'}</strong>
                    </td>
                    <td>{c.port || '?'}</td>
                    <td style={{ color: colors.textMuted as string }}>{c.priority || '?'}</td>
                    <td>{c.raddr ? `${c.raddr}:${c.rport || '?'}` : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </Box>
        )}
      </Box>
      <Box sx={sx.card}>
        <Box sx={{ fontWeight: 'bold', mb: 1, fontSize: 13 }}>ICE Credentials</Box>
        {natInfo.iceInfo.length === 0 ? (
          <Box sx={sx.empty}>No ICE info</Box>
        ) : (
          <Box component='table' sx={sx.table}>
            <thead>
              <tr>
                <th>From</th>
                <th>Direction</th>
                <th>ice-ufrag</th>
                <th>ice-pwd</th>
                <th>Fingerprint</th>
              </tr>
            </thead>
            <tbody>
              {natInfo.iceInfo.map((ice, i) => (
                <tr key={i}>
                  <td>{ice.from}</td>
                  <td>{ice.direction || 'N/A'}</td>
                  <td style={{ fontSize: 12 }}>{ice.ufrag || ''}</td>
                  <td style={{ fontSize: 12 }}>{ice.pwd || ''}</td>
                  <td style={{ fontSize: 11, wordBreak: 'break-all' }}>{ice.fingerprint || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function CodecTab({ codecInfo }: { codecInfo: CodecSession[] }) {
  if (!codecInfo.length) return <Box sx={sx.empty}>No SDP / codec info found</Box>;
  return (
    <Box>
      <Typography sx={sx.sectionTitle}>Codec & Media Sessions</Typography>
      {codecInfo.map((s, i) => (
        <Box key={i} sx={sx.card}>
          <Box sx={{ fontWeight: 'bold', mb: 1, fontSize: 13 }}>
            #{i + 1} {s.type === 'request' ? '→ Request' : '← Response'} ({s.method})
          </Box>
          <Box sx={sx.grid}>
            <Box>
              <Box sx={sx.label}>Codecs</Box>
              <Box sx={sx.value}>
                {s.codecs.map((c) => (
                  <Tag key={c.pt} color='cyan'>
                    {c.name} (PT:{c.pt})
                  </Tag>
                ))}
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Media IP</Box>
              <Box sx={sx.value}>
                <strong>{s.connection || 'N/A'}</strong>
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>RTP Port</Box>
              <Box sx={sx.value}>{s.port || 'N/A'}</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Profile</Box>
              <Box sx={sx.value}>
                <Tag color='blue'>{s.profile || 'N/A'}</Tag>
              </Box>
            </Box>
            <Box>
              <Box sx={sx.label}>Direction</Box>
              <Box sx={sx.value}>{s.direction || 'N/A'}</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>ptime</Box>
              <Box sx={sx.value}>{s.ptime || 'N/A'} ms</Box>
            </Box>
            <Box>
              <Box sx={sx.label}>DTLS Fingerprint</Box>
              <Box sx={{ ...sx.value, fontSize: 11 }}>{s.fingerprint || 'N/A'}</Box>
            </Box>
            {s.ssrc.length > 0 && (
              <Box>
                <Box sx={sx.label}>SSRC</Box>
                <Box sx={{ ...sx.value, fontSize: 12 }}>{s.ssrc.join(', ')}</Box>
              </Box>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function TimelineTab({ messages }: { messages: SipMessage[] }) {
  const [filter, setFilter] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState<Set<string>>(new Set());
  const filterBtns = ['REGISTER', 'INVITE', 'BYE', 'OPTIONS', 'ACK', 'INFO', 'NOTIFY', '100-199', '200', '4xx+'];

  const toggleFilter = (f: string) => {
    setActiveFilters((prev) => {
      const n = new Set(prev);
      if (n.has(f)) n.delete(f);
      else n.add(f);
      return n;
    });
  };

  const visible = messages.filter((m) => {
    const text = m.raw.substring(0, 200).toLowerCase();
    const method = m.method || '';
    const status = m.statusCode || 0;
    if (filter && !text.includes(filter.toLowerCase()) && !method.toLowerCase().includes(filter.toLowerCase()))
      return false;
    if (activeFilters.size === 0) return true;
    let show = false;
    activeFilters.forEach((f) => {
      if (f === '100-199' && status >= 100 && status < 200) show = true;
      else if (f === '200' && status === 200) show = true;
      else if (f === '4xx+' && status >= 400) show = true;
      else if (method === f) show = true;
    });
    return show;
  });

  return (
    <Box>
      <Typography sx={sx.sectionTitle}>Full SIP Message Timeline</Typography>
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Box
          component='input'
          placeholder='Filter messages...'
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
          sx={{
            background: colors.surfaceDarkest,
            border: `1px solid ${accentAlpha(0.12)}`,
            color: colors.text,
            p: '6px 10px',
            borderRadius: '4px',
            fontFamily: fonts.mono,
            fontSize: 12,
            width: 200,
          }}
        />
        {filterBtns.map((f) => (
          <Box
            key={f}
            component='button'
            onClick={() => toggleFilter(f)}
            sx={{
              p: '4px 10px',
              borderRadius: '4px',
              border: `1px solid ${activeFilters.has(f) ? colors.accentDeep : accentAlpha(0.12)}`,
              background: activeFilters.has(f) ? colors.accentDeep : colors.surfaceSolid,
              color: activeFilters.has(f) ? '#fff' : colors.textMuted,
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: fonts.mono,
              '&:hover': { background: colors.accentDeep, color: '#fff', borderColor: colors.accentDeep },
            }}
          >
            {f}
          </Box>
        ))}
      </Box>
      <Box sx={{ pl: 3 }}>
        {visible.map((m, i) => {
          const isReq = m.type === 'request';
          const dotColor = isReq
            ? colors.accentDeep
            : (m.statusCode ?? 0) >= 200 && (m.statusCode ?? 0) < 300
              ? '#238636'
              : (m.statusCode ?? 0) >= 400
                ? '#da3633'
                : '#9e6a03';
          const label = isReq ? `→ ${m.method}` : `← ${m.statusCode} ${m.statusText}`;
          const from = getFromUser(m);
          const to = getToUser(m);
          const cid = getCallId(m);
          const detail = `${from ? 'From:' + from : ''} ${to ? '→ To:' + to : ''} ${cid ? '| Call-ID:' + cid.substring(0, 12) + '...' : ''}`;
          return (
            <Box
              key={m.index}
              sx={{
                position: 'relative',
                pl: 2.5,
                pb: 1,
                borderLeft: i === visible.length - 1 ? 'none' : `2px solid ${accentAlpha(0.12)}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: -5,
                  top: 12,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: dotColor,
                  border: `2px solid ${colors.surface}`,
                },
              }}
            >
              <Box sx={{ fontSize: 13, fontWeight: 'bold', color: isReq ? colors.accent : dotColor }}>
                #{m.index + 1} {label}{' '}
                <Box component='span' sx={{ color: colors.textMuted, fontWeight: 'normal', fontSize: 11 }}>
                  [{m.method || '?'}]
                </Box>
              </Box>
              <Box sx={{ fontSize: 11, color: colors.textMuted, mt: 0.3 }}>{detail}</Box>
              <RawToggle raw={m.raw} />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

function RawTab({ messages }: { messages: SipMessage[] }) {
  return (
    <Box>
      <Typography sx={sx.sectionTitle}>All Raw SIP Messages</Typography>
      {messages.map((m, i) => {
        const label = m.type === 'request' ? `→ ${m.method}` : `← ${m.statusCode} ${m.statusText}`;
        const borderColor =
          m.type === 'request' ? colors.accentDeep : (m.statusCode ?? 0) >= 400 ? '#da3633' : '#238636';
        return (
          <Box key={i} sx={{ ...sx.card, borderLeft: `3px solid ${borderColor}` }}>
            <Box sx={{ fontWeight: 'bold', mb: 0.5, fontSize: 13 }}>
              #{i + 1} {label}
            </Box>
            <Box
              component='pre'
              sx={{
                whiteSpace: 'pre-wrap',
                fontSize: 11,
                color: colors.textMuted,
                m: 0,
                maxHeight: 400,
                overflow: 'auto',
              }}
            >
              {m.raw}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

/* ─── Main Component ─────────────────────────────────── */
export const SipAnalyzerLayout: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [data, setData] = React.useState<{
    fileName: string;
    messages: SipMessage[];
    registers: RegisterInfo[];
    calls: CallInfo[];
    natInfo: NatInfo;
    serverInfo: ServerInfo;
    codecInfo: CodecSession[];
  } | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const messages = parseSipMessages(text);
    setData({
      fileName: file.name,
      messages,
      registers: extractRegisters(messages),
      calls: extractCalls(messages),
      natInfo: extractNatInfo(messages),
      serverInfo: extractServerInfo(messages),
      codecInfo: extractCodecInfo(messages),
    });
    setActiveTab('overview');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', badge: '' },
    { id: 'register', label: 'Register', badge: data?.registers.length || 0 },
    { id: 'calls', label: 'Calls', badge: data?.calls.length || 0 },
    { id: 'nat', label: 'NAT/Network', badge: data?.natInfo.candidates.length || 0 },
    { id: 'codec', label: 'Codec/Media', badge: data?.codecInfo.length || 0 },
    { id: 'timeline', label: 'Timeline', badge: data?.messages.length || 0 },
    { id: 'raw', label: 'Raw Messages', badge: data?.messages.length || 0 },
  ];

  return (
    <Box sx={sx.root}>
      <Typography sx={sx.title}>📡 SIP Debug Analyzer</Typography>
      <Typography sx={sx.subtitle}>
        โหลดไฟล์ .sip เพื่อวิเคราะห์ REGISTER, INVITE, Codec, NAT, Server, ICE Candidates
      </Typography>

      <Box sx={sx.fileInput}>
        <input type='file' accept='.sip,.txt,.log' onChange={handleFile} />
      </Box>

      {data && (
        <>
          <Box sx={sx.tabs}>
            {tabs.map((t) => (
              <Box
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                sx={{ ...sx.tab, ...(activeTab === t.id ? sx.tabActive : {}) }}
              >
                {t.label}
                {t.badge !== '' && (
                  <Box component='span' sx={{ ...sx.badge, ...(activeTab === t.id ? sx.badgeActive : {}) }}>
                    {t.badge}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
          <Box sx={sx.tabContent}>
            {activeTab === 'overview' && <OverviewTab {...data} />}
            {activeTab === 'register' && <RegisterTab registers={data.registers} />}
            {activeTab === 'calls' && <CallsTab calls={data.calls} />}
            {activeTab === 'nat' && <NatTab natInfo={data.natInfo} />}
            {activeTab === 'codec' && <CodecTab codecInfo={data.codecInfo} />}
            {activeTab === 'timeline' && <TimelineTab messages={data.messages} />}
            {activeTab === 'raw' && <RawTab messages={data.messages} />}
          </Box>
        </>
      )}
    </Box>
  );
};

export default SipAnalyzerLayout;

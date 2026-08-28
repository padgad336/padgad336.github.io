import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Input,
  Sheet,
  Textarea,
  Typography,
} from '@mui/joy';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import FingerprintRoundedIcon from '@mui/icons-material/FingerprintRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import QrCode2RoundedIcon from '@mui/icons-material/QrCode2Rounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import CompareArrowsRoundedIcon from '@mui/icons-material/CompareArrowsRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import RuleRoundedIcon from '@mui/icons-material/RuleRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import QRCode from 'qrcode';
import { accentAlpha, colors, fonts, gradients } from '../themeConfig';

type ToolKey =
  | 'json' | 'base64' | 'jwt' | 'uuid' | 'hash' | 'timestamp' | 'url' | 'regex'
  | 'diff' | 'cron' | 'yaml' | 'sql' | 'markdown' | 'qr' | 'color' | 'cidr';

type ToolCategory = 'Data' | 'Text & Code' | 'Security' | 'Network';

type EncodedFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

const toolList: Array<{
  key: ToolKey;
  label: string;
  short: string;
  accent: string;
  icon: React.ReactNode;
  category: ToolCategory;
}> = [
  { key: 'json', label: 'JSON Formatter', short: 'Format, minify & validate', accent: '#16794a', icon: <DataObjectRoundedIcon />, category: 'Data' },
  { key: 'base64', label: 'Base64', short: 'Files & text codec', accent: '#317c50', icon: <AttachFileRoundedIcon />, category: 'Text & Code' },
  { key: 'jwt', label: 'JWT Decoder', short: 'Inspect token payload', accent: '#4b8f61', icon: <VpnKeyRoundedIcon />, category: 'Security' },
  { key: 'uuid', label: 'UUID Generator', short: 'Generate secure v4 IDs', accent: '#236d44', icon: <KeyRoundedIcon />, category: 'Security' },
  { key: 'hash', label: 'Hash Generator', short: 'SHA-256 checksum', accent: '#5b936d', icon: <FingerprintRoundedIcon />, category: 'Security' },
  { key: 'timestamp', label: 'Timestamp', short: 'Unix time ↔ date', accent: '#0f6840', icon: <AccessTimeRoundedIcon />, category: 'Data' },
  { key: 'url', label: 'URL Codec', short: 'Encode & decode', accent: '#317c50', icon: <InsertLinkRoundedIcon />, category: 'Text & Code' },
  { key: 'regex', label: 'Regex Tester', short: 'Test patterns & matches', accent: '#4b8f61', icon: <RuleRoundedIcon />, category: 'Text & Code' },
  { key: 'diff', label: 'Text Diff', short: 'Compare two texts', accent: '#236d44', icon: <CompareArrowsRoundedIcon />, category: 'Text & Code' },
  { key: 'cron', label: 'Cron Generator', short: 'Build schedules', accent: '#5b936d', icon: <ScheduleRoundedIcon />, category: 'Network' },
  { key: 'yaml', label: 'YAML ↔ JSON', short: 'Convert config formats', accent: '#0f6840', icon: <CodeRoundedIcon />, category: 'Data' },
  { key: 'sql', label: 'SQL Formatter', short: 'Format SQL queries', accent: '#317c50', icon: <DataObjectRoundedIcon />, category: 'Data' },
  { key: 'markdown', label: 'Markdown Preview', short: 'Write & preview docs', accent: '#4b8f61', icon: <CodeRoundedIcon />, category: 'Text & Code' },
  { key: 'qr', label: 'QR Generator', short: 'Text, links & Wi-Fi', accent: '#236d44', icon: <QrCode2RoundedIcon />, category: 'Data' },
  { key: 'color', label: 'Color Converter', short: 'HEX · RGB · HSL', accent: '#5b936d', icon: <PaletteOutlinedIcon />, category: 'Text & Code' },
  { key: 'cidr', label: 'CIDR / IP', short: 'Calculate IP ranges', accent: '#0f6840', icon: <PublicRoundedIcon />, category: 'Network' },
];

const textAreaSx = {
  '--Textarea-focusedThickness': '1px',
  fontFamily: fonts.mono,
  fontSize: 14,
  lineHeight: 1.6,
  color: colors.textBody,
  background: 'rgba(255, 255, 255, .92)',
  borderColor: colors.borderMedium,
  borderRadius: '9px',
  '&:hover': { borderColor: colors.borderHover },
  '&:focus-within': { borderColor: colors.accent },
};

const actionButtonSx = {
  fontFamily: fonts.mono,
  fontSize: 12.5,
  borderRadius: '8px',
  minHeight: 38,
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / 1024 ** index).toFixed(index ? 1 : 0)} ${units[index]}`;
};

const downloadText = (content: string, filename: string, type = 'text/plain') => {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

const PanelHeader = ({ title, description }: { title: string; description: string }) => (
  <Box sx={{ mb: 3 }}>
    <Typography sx={{ fontFamily: fonts.mono, fontSize: { xs: 20, md: 24 }, fontWeight: 700, color: colors.text }}>
      {title}
    </Typography>
    <Typography sx={{ mt: .75, color: colors.textMuted, fontFamily: fonts.body, fontSize: 14, lineHeight: 1.7 }}>
      {description}
    </Typography>
  </Box>
);

const ToolShell = ({ children }: { children: React.ReactNode }) => (
  <Card
    variant='plain'
    sx={{
      p: { xs: 2, sm: 3, md: 4 },
      minHeight: 540,
      borderRadius: '14px',
      background: gradients.surface,
      border: `1px solid ${colors.border}`,
    }}
  >
    {children}
  </Card>
);

const Base64Tool = ({ notify }: { notify: (message: string) => void }) => {
  const [files, setFiles] = React.useState<EncodedFile[]>([]);
  const [decodeInput, setDecodeInput] = React.useState('');
  const [dragging, setDragging] = React.useState(false);
  const [error, setError] = React.useState('');

  const readFiles = React.useCallback(async (selected: FileList | File[]) => {
    setError('');
    const incoming = Array.from(selected);
    if (!incoming.length) return;

    const oversized = incoming.find((file) => file.size > 25 * 1024 * 1024);
    if (oversized) {
      setError(`${oversized.name} มีขนาดเกิน 25 MB`);
      return;
    }

    const encoded = await Promise.all(
      incoming.map(
        (file) =>
          new Promise<EncodedFile>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({
                id: `${file.name}-${file.size}-${file.lastModified}`,
                name: file.name,
                type: file.type || 'application/octet-stream',
                size: file.size,
                dataUrl: String(reader.result),
              });
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
          }),
      ),
    );
    setFiles(encoded);
  }, []);

  const decodeAndDownload = () => {
    try {
      const cleaned = decodeInput.trim();
      if (!cleaned) throw new Error('กรุณาวาง Base64 ก่อน');
      const match = cleaned.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,([\s\S]+)$/);
      const mime = match?.[1] || 'application/octet-stream';
      const payload = (match?.[2] || cleaned).replace(/\s/g, '');
      const binary = atob(payload);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `decoded.${mime.split('/')[1]?.split('+')[0] || 'bin'}`;
      anchor.click();
      URL.revokeObjectURL(url);
      setError('');
      notify('ดาวน์โหลดไฟล์ที่ถอดรหัสแล้ว');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Base64 ไม่ถูกต้อง');
    }
  };

  return (
    <ToolShell>
      <PanelHeader title='Files ↔ Base64' description='รองรับรูปภาพ, PDF, เอกสาร, เสียง, วิดีโอ และไฟล์ทั่วไป ข้อมูลไม่ถูกอัปโหลดออกจากอุปกรณ์ของคุณ' />
      <Box
        component='label'
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void readFiles(event.dataTransfer.files);
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 150,
          px: 2,
          border: `1px dashed ${dragging ? colors.accent : colors.borderHover}`,
          background: dragging ? accentAlpha(.08) : 'rgba(248, 251, 249, .9)',
          cursor: 'pointer',
          transition: 'all .2s ease',
          '&:hover': { borderColor: colors.accent, background: accentAlpha(.05) },
        }}
      >
        <UploadFileRoundedIcon sx={{ color: colors.accent, fontSize: 36, mb: 1 }} />
        <Typography sx={{ fontFamily: fonts.mono, color: colors.textBody, fontSize: 13, textAlign: 'center' }}>
          วางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์
        </Typography>
        <Typography sx={{ color: colors.textDim, fontSize: 12, mt: .75 }}>เลือกได้หลายไฟล์ · สูงสุด 25 MB ต่อไฟล์</Typography>
        <input hidden type='file' multiple onChange={(event) => event.target.files && void readFiles(event.target.files)} />
      </Box>

      {error && <Typography sx={{ color: '#b42318', fontSize: 13, mt: 1.5 }}>{error}</Typography>}

      {files.length > 0 && (
        <Box sx={{ display: 'grid', gap: 1.25, mt: 2 }}>
          {files.map((file) => (
            <Sheet key={file.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, background: colors.surfaceDark, border: `1px solid ${colors.borderLight}` }}>
              <AttachFileRoundedIcon sx={{ color: colors.accent, fontSize: 20 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontFamily: fonts.mono, color: colors.textBody, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                <Typography sx={{ color: colors.textDim, fontSize: 11 }}>{file.type} · {formatBytes(file.size)}</Typography>
              </Box>
              <Button size='sm' variant='plain' startDecorator={<ContentCopyRoundedIcon />} onClick={() => { void navigator.clipboard.writeText(file.dataUrl); notify(`คัดลอก ${file.name} แล้ว`); }} sx={actionButtonSx}>Copy</Button>
              <Button size='sm' variant='plain' startDecorator={<DownloadRoundedIcon />} onClick={() => downloadText(file.dataUrl, `${file.name}.base64.txt`)} sx={{ ...actionButtonSx, display: { xs: 'none', sm: 'inline-flex' } }}>Save</Button>
            </Sheet>
          ))}
          <Button size='sm' variant='plain' onClick={() => setFiles([])} sx={{ ...actionButtonSx, justifySelf: 'start', color: colors.textMuted }}>ล้างรายการ</Button>
        </Box>
      )}

      <Divider sx={{ my: 3, borderColor: colors.borderLight }}>decode</Divider>
      <Textarea minRows={4} value={decodeInput} onChange={(event) => setDecodeInput(event.target.value)} placeholder='วาง Base64 หรือ Data URL เพื่อแปลงกลับเป็นไฟล์…' sx={textAreaSx} />
      <Button onClick={decodeAndDownload} startDecorator={<DownloadRoundedIcon />} sx={{ ...actionButtonSx, mt: 1.5 }}>Decode & download</Button>
    </ToolShell>
  );
};

const QrTool = ({ notify }: { notify: (message: string) => void }) => {
  const [value, setValue] = React.useState('https://padgad336.github.io');
  const [size, setSize] = React.useState(320);
  const [dataUrl, setDataUrl] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!value.trim()) {
        setDataUrl('');
        setError('กรุณากรอกข้อความหรือลิงก์');
        return;
      }
      QRCode.toDataURL(value, { width: size, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#11111b', light: '#ffffff' } })
        .then((url) => { setDataUrl(url); setError(''); })
        .catch(() => setError('ไม่สามารถสร้าง QR Code จากข้อมูลนี้ได้'));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [value, size]);

  return (
    <ToolShell>
      <PanelHeader title='QR Code Generator' description='สร้าง QR Code จาก URL, ข้อความ, เบอร์โทร หรือข้อมูล Wi-Fi พร้อมดาวน์โหลดเป็น PNG' />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 300px' }, gap: 3 }}>
        <Box>
          <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12, mb: .75 }}>CONTENT</Typography>
          <Textarea minRows={7} value={value} onChange={(event) => setValue(event.target.value)} placeholder='https://example.com' sx={textAreaSx} />
          <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12, mt: 2, mb: .75 }}>SIZE · {size}px</Typography>
          <input aria-label='QR Code size' type='range' min='180' max='600' step='20' value={size} onChange={(event) => setSize(Number(event.target.value))} style={{ width: '100%', accentColor: colors.accentDeep }} />
          {error && <Typography sx={{ color: '#b42318', fontSize: 13, mt: 1 }}>{error}</Typography>}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: '100%', aspectRatio: '1', p: 2, display: 'grid', placeItems: 'center', bgcolor: '#fff', borderRadius: '8px' }}>
            {dataUrl ? <Box component='img' src={dataUrl} alt='QR Code preview' sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <QrCode2RoundedIcon sx={{ color: '#d5d2df', fontSize: 92 }} />}
          </Box>
          <Button
            fullWidth
            disabled={!dataUrl}
            startDecorator={<DownloadRoundedIcon />}
            onClick={() => {
              const anchor = document.createElement('a');
              anchor.href = dataUrl;
              anchor.download = 'qr-code.png';
              anchor.click();
              notify('ดาวน์โหลด QR Code แล้ว');
            }}
            sx={actionButtonSx}
          >
            Download PNG
          </Button>
        </Box>
      </Box>
    </ToolShell>
  );
};

const JsonTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('{\n  "hello": "world",\n  "tools": ["format", "minify", "validate"]\n}');
  const [output, setOutput] = React.useState('');
  const [status, setStatus] = React.useState('พร้อมตรวจสอบ');

  const transform = (compact: boolean) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, compact ? 0 : 2));
      setStatus('✓ Valid JSON');
    } catch (caught) {
      setOutput('');
      setStatus(`✕ ${caught instanceof Error ? caught.message : 'Invalid JSON'}`);
    }
  };

  return (
    <ToolShell>
      <PanelHeader title='JSON Formatter' description='ตรวจสอบความถูกต้อง จัดรูปแบบ และย่อ JSON โดยไม่ส่งข้อมูลไปยังเซิร์ฟเวอร์' />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        <Button onClick={() => transform(false)} sx={actionButtonSx}>Format</Button>
        <Button variant='outlined' onClick={() => transform(true)} sx={actionButtonSx}>Minify</Button>
        <Button variant='plain' disabled={!output} startDecorator={<ContentCopyRoundedIcon />} onClick={() => { void navigator.clipboard.writeText(output); notify('คัดลอก JSON แล้ว'); }} sx={actionButtonSx}>Copy result</Button>
        <Chip size='sm' variant='soft' color={status.startsWith('✓') ? 'success' : status.startsWith('✕') ? 'danger' : 'neutral'} sx={{ ml: { sm: 'auto' }, fontFamily: fonts.mono, fontSize: 10 }}>{status}</Chip>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <Textarea minRows={18} value={input} onChange={(event) => setInput(event.target.value)} placeholder='วาง JSON ที่นี่…' sx={textAreaSx} />
        <Textarea minRows={18} value={output} readOnly placeholder='ผลลัพธ์จะแสดงที่นี่…' sx={textAreaSx} />
      </Box>
    </ToolShell>
  );
};

const UrlTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('https://example.com/search?q=hello world&lang=th');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');

  const transform = (mode: 'encode' | 'decode') => {
    try {
      setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input));
      setError('');
    } catch {
      setOutput('');
      setError('ข้อมูล URL encoding ไม่ถูกต้อง');
    }
  };

  return (
    <ToolShell>
      <PanelHeader title='URL Encoder / Decoder' description='เข้ารหัสอักขระพิเศษสำหรับ query string หรือถอดค่าที่ถูก percent-encode กลับมาอ่านง่าย' />
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12, mb: .75 }}>INPUT</Typography>
      <Textarea minRows={7} value={input} onChange={(event) => setInput(event.target.value)} sx={textAreaSx} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1.5 }}>
        <Button onClick={() => transform('encode')} sx={actionButtonSx}>Encode component</Button>
        <Button variant='outlined' onClick={() => transform('decode')} sx={actionButtonSx}>Decode component</Button>
      </Box>
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12, mb: .75 }}>OUTPUT</Typography>
      <Textarea minRows={7} readOnly value={output} sx={textAreaSx} />
      {error && <Typography sx={{ color: '#b42318', fontSize: 13, mt: 1 }}>{error}</Typography>}
      <Button variant='plain' disabled={!output} startDecorator={<ContentCopyRoundedIcon />} onClick={() => { void navigator.clipboard.writeText(output); notify('คัดลอกผลลัพธ์แล้ว'); }} sx={{ ...actionButtonSx, mt: 1 }}>Copy result</Button>
    </ToolShell>
  );
};

const HashTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('');
  const [hash, setHash] = React.useState('');

  React.useEffect(() => {
    let active = true;
    if (!input) {
      setHash('');
      return () => { active = false; };
    }
    crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)).then((buffer) => {
      if (active) setHash(Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, '0')).join(''));
    });
    return () => { active = false; };
  }, [input]);

  return (
    <ToolShell>
      <PanelHeader title='SHA-256 Hash' description='สร้างค่าแฮช SHA-256 แบบ one-way สำหรับตรวจสอบข้อมูล ไม่ใช่การเข้ารหัสและไม่สามารถถอดกลับได้' />
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12, mb: .75 }}>TEXT TO HASH</Typography>
      <Textarea minRows={9} value={input} onChange={(event) => setInput(event.target.value)} placeholder='พิมพ์ข้อความ…' sx={textAreaSx} />
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12, mt: 2, mb: .75 }}>SHA-256</Typography>
      <Sheet sx={{ p: 2, minHeight: 72, background: colors.surfaceDark, border: `1px solid ${colors.borderMedium}`, borderRadius: '8px' }}>
        <Typography sx={{ fontFamily: fonts.mono, color: hash ? colors.accent : colors.textDim, fontSize: 13, wordBreak: 'break-all', lineHeight: 1.7 }}>{hash || 'ผลลัพธ์ 64 ตัวอักษรจะแสดงที่นี่'}</Typography>
      </Sheet>
      <Button variant='plain' disabled={!hash} startDecorator={<ContentCopyRoundedIcon />} onClick={() => { void navigator.clipboard.writeText(hash); notify('คัดลอก SHA-256 แล้ว'); }} sx={{ ...actionButtonSx, mt: 1 }}>Copy hash</Button>
    </ToolShell>
  );
};

const UUIDTool = ({ notify }: { notify: (message: string) => void }) => {
  const makeUuids = React.useCallback((count = 5) => Array.from({ length: count }, () => crypto.randomUUID()), []);
  const [uuids, setUuids] = React.useState<string[]>(() => makeUuids());

  return (
    <ToolShell>
      <PanelHeader title='UUID v4 Generator' description='สร้าง UUID เวอร์ชัน 4 ด้วย cryptographically secure random values จากเบราว์เซอร์' />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {[1, 5, 10, 25].map((count) => <Button key={count} variant={count === 5 ? 'solid' : 'outlined'} onClick={() => setUuids(makeUuids(count))} sx={actionButtonSx}>Generate {count}</Button>)}
        <Button variant='plain' startDecorator={<RefreshRoundedIcon />} onClick={() => setUuids(makeUuids(uuids.length))} sx={actionButtonSx}>Refresh</Button>
      </Box>
      <Sheet sx={{ background: colors.surfaceDark, border: `1px solid ${colors.borderMedium}`, borderRadius: '8px', overflow: 'hidden' }}>
        {uuids.map((uuid, index) => (
          <Box key={uuid} sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1.2, borderBottom: index < uuids.length - 1 ? `1px solid ${colors.borderLight}` : 'none' }}>
            <Typography sx={{ width: 24, color: colors.textDim, fontFamily: fonts.mono, fontSize: 10 }}>{String(index + 1).padStart(2, '0')}</Typography>
            <Typography sx={{ flex: 1, minWidth: 0, color: colors.textBody, fontFamily: fonts.mono, fontSize: { xs: 10.5, sm: 13 }, overflowWrap: 'anywhere' }}>{uuid}</Typography>
            <Button size='sm' variant='plain' aria-label={`Copy UUID ${index + 1}`} onClick={() => { void navigator.clipboard.writeText(uuid); notify('คัดลอก UUID แล้ว'); }} sx={{ ...actionButtonSx, minWidth: 32, px: .5 }}><ContentCopyRoundedIcon sx={{ fontSize: 16 }} /></Button>
          </Box>
        ))}
      </Sheet>
      <Button variant='outlined' startDecorator={<ContentCopyRoundedIcon />} onClick={() => { void navigator.clipboard.writeText(uuids.join('\n')); notify(`คัดลอก UUID ${uuids.length} รายการแล้ว`); }} sx={{ ...actionButtonSx, mt: 2 }}>Copy all</Button>
    </ToolShell>
  );
};

const CopyButton = ({ value, notify }: { value: string; notify: (message: string) => void }) => (
  <Button variant='plain' size='sm' disabled={!value} startDecorator={<ContentCopyRoundedIcon />} onClick={() => { void navigator.clipboard.writeText(value); notify('คัดลอกผลลัพธ์แล้ว'); }} sx={actionButtonSx}>Copy</Button>
);

const JwtTool = ({ notify }: { notify: (message: string) => void }) => {
  const [token, setToken] = React.useState('');
  const [result, setResult] = React.useState('');
  const decode = () => {
    try {
      const parts = token.trim().split('.');
      if (parts.length < 2) throw new Error('JWT ต้องมีอย่างน้อย 2 ส่วน');
      const read = (part: string) => JSON.parse(decodeURIComponent(Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/'))).map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
      setResult(JSON.stringify({ header: read(parts[0]), payload: read(parts[1]) }, null, 2));
    } catch (error) { setResult(`Error: ${error instanceof Error ? error.message : 'Invalid JWT'}`); }
  };
  return <ToolShell><PanelHeader title='JWT Decoder' description='อ่านข้อความ header และ payload ของ JSON Web Token เท่านั้น — ไม่ตรวจลายเซ็นและไม่ส่ง token ออกไป' />
    <Textarea minRows={7} value={token} onChange={(event) => setToken(event.target.value)} placeholder='eyJhbGciOi... (วาง JWT ที่นี่)' sx={textAreaSx} />
    <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><Button onClick={decode} sx={actionButtonSx}>Decode token</Button><CopyButton value={result} notify={notify} /></Box>
    <Textarea minRows={13} readOnly value={result} placeholder='Header และ payload จะแสดงที่นี่…' sx={textAreaSx} />
  </ToolShell>;
};

const TimestampTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState(String(Math.floor(Date.now() / 1000)));
  const [output, setOutput] = React.useState('');
  const convert = () => {
    const numeric = Number(input);
    const date = Number.isFinite(numeric) ? new Date(numeric < 100000000000 ? numeric * 1000 : numeric) : new Date(input);
    setOutput(Number.isNaN(date.getTime()) ? 'วันที่หรือ timestamp ไม่ถูกต้อง' : `ISO 8601  ${date.toISOString()}\nLocal     ${date.toLocaleString()}\nUnix sec  ${Math.floor(date.getTime() / 1000)}\nUnix ms   ${date.getTime()}`);
  };
  return <ToolShell><PanelHeader title='Timestamp Converter' description='แปลง Unix timestamp (วินาทีหรือมิลลิวินาที), ISO date และวันที่ทั่วไปไปมาระหว่างรูปแบบ' />
    <Textarea minRows={4} value={input} onChange={(event) => setInput(event.target.value)} placeholder='1716192000 หรือ 2024-05-20T00:00:00Z' sx={textAreaSx} />
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1.5 }}><Button onClick={convert} sx={actionButtonSx}>Convert</Button><Button variant='outlined' onClick={() => setInput(String(Math.floor(Date.now() / 1000)))} sx={actionButtonSx}>Use current time</Button><CopyButton value={output} notify={notify} /></Box>
    <Textarea minRows={7} readOnly value={output} placeholder='ผลลัพธ์จะแสดงที่นี่…' sx={textAreaSx} />
  </ToolShell>;
};

const RegexTool = ({ notify }: { notify: (message: string) => void }) => {
  const [pattern, setPattern] = React.useState('\\b\\w+@\\w+\\.\\w+\\b');
  const [flags, setFlags] = React.useState('gi');
  const [text, setText] = React.useState('Contact hello@example.com or team@padgad.dev');
  const [result, setResult] = React.useState('');
  const test = () => { try { const matches = Array.from(text.matchAll(new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`))); setResult(matches.length ? matches.map((match, index) => `${index + 1}. “${match[0]}”  · index ${match.index}`).join('\n') : 'ไม่พบข้อความที่ตรงกัน'); } catch (error) { setResult(`Pattern error: ${error instanceof Error ? error.message : 'Invalid regex'}`); } };
  return <ToolShell><PanelHeader title='Regex Tester' description='ทดสอบ Regular Expression แบบทันที พร้อมดูรายการ match และตำแหน่งในข้อความ' />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'minmax(0, 1fr) 110px' }, gap: 1 }}><Textarea minRows={2} value={pattern} onChange={(event) => setPattern(event.target.value)} placeholder='Pattern' sx={textAreaSx} /><Textarea minRows={2} value={flags} onChange={(event) => setFlags(event.target.value)} placeholder='flags เช่น gi' sx={textAreaSx} /></Box>
    <Textarea minRows={8} value={text} onChange={(event) => setText(event.target.value)} placeholder='ข้อความสำหรับทดสอบ…' sx={{ ...textAreaSx, mt: 1.5 }} />
    <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><Button onClick={test} sx={actionButtonSx}>Test pattern</Button><CopyButton value={result} notify={notify} /></Box>
    <Textarea minRows={7} readOnly value={result} placeholder='Matches จะแสดงที่นี่…' sx={textAreaSx} />
  </ToolShell>;
};

const DiffTool = ({ notify }: { notify: (message: string) => void }) => {
  const [left, setLeft] = React.useState('name: PadGad\nrole: Developer\nstatus: active');
  const [right, setRight] = React.useState('name: PadGad\nrole: Senior Developer\nstatus: active\nlocation: Thailand');
  const [result, setResult] = React.useState('');
  const compare = () => {
    const a = left.split('\n'); const b = right.split('\n'); const max = Math.max(a.length, b.length);
    setResult(Array.from({ length: max }, (_, index) => a[index] === b[index] ? `  ${a[index] || ''}` : `- ${a[index] || ''}\n+ ${b[index] || ''}`).join('\n'));
  };
  return <ToolShell><PanelHeader title='Text Diff' description='เปรียบเทียบข้อความแบบบรรทัดต่อบรรทัด โดย - คือข้อความเดิม และ + คือข้อความใหม่' />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}><Textarea minRows={11} value={left} onChange={(event) => setLeft(event.target.value)} placeholder='Original text' sx={textAreaSx} /><Textarea minRows={11} value={right} onChange={(event) => setRight(event.target.value)} placeholder='Changed text' sx={textAreaSx} /></Box>
    <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><Button onClick={compare} sx={actionButtonSx}>Compare text</Button><CopyButton value={result} notify={notify} /></Box>
    <Textarea minRows={10} readOnly value={result} placeholder='ผลเปรียบเทียบจะแสดงที่นี่…' sx={textAreaSx} />
  </ToolShell>;
};

const CronTool = ({ notify }: { notify: (message: string) => void }) => {
  const presets = [{ label: 'Every minute', value: '* * * * *' }, { label: 'Every hour', value: '0 * * * *' }, { label: 'Daily 09:00', value: '0 9 * * *' }, { label: 'Every Monday', value: '0 9 * * 1' }];
  const [cron, setCron] = React.useState('0 9 * * 1-5');
  const explain = (value: string) => {
    const [min = '*', hour = '*', day = '*', month = '*', week = '*'] = value.trim().split(/\s+/);
    return `Minute: ${min}\nHour: ${hour}\nDay of month: ${day}\nMonth: ${month}\nDay of week: ${week}\n\nFormat: minute hour day-of-month month day-of-week`;
  };
  return <ToolShell><PanelHeader title='Cron Generator' description='สร้างและอ่าน cron expression แบบ 5 ช่อง สำหรับ task scheduler, Linux crontab และ CI jobs' />
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>{presets.map((preset) => <Button key={preset.label} size='sm' variant='outlined' onClick={() => setCron(preset.value)} sx={actionButtonSx}>{preset.label}</Button>)}</Box>
    <Textarea minRows={2} value={cron} onChange={(event) => setCron(event.target.value)} placeholder='* * * * *' sx={textAreaSx} />
    <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><CopyButton value={cron} notify={notify} /></Box>
    <Textarea minRows={8} readOnly value={explain(cron)} sx={textAreaSx} />
  </ToolShell>;
};

const jsonToYaml = (value: unknown, depth = 0): string => {
  const indent = '  '.repeat(depth);
  if (Array.isArray(value)) return value.map((item) => typeof item === 'object' && item !== null ? `${indent}-\n${jsonToYaml(item, depth + 1)}` : `${indent}- ${String(item)}`).join('\n');
  if (value && typeof value === 'object') return Object.entries(value as Record<string, unknown>).map(([key, item]) => typeof item === 'object' && item !== null ? `${indent}${key}:\n${jsonToYaml(item, depth + 1)}` : `${indent}${key}: ${typeof item === 'string' ? JSON.stringify(item) : String(item)}`).join('\n');
  return `${indent}${String(value)}`;
};

const YamlTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('{\n  "name": "PadGad",\n  "skills": ["TypeScript", "Node.js"]\n}');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const convert = (to: 'yaml' | 'json') => {
    try {
      if (to === 'yaml') setOutput(jsonToYaml(JSON.parse(input)));
      else {
        const result: Record<string, unknown> = {}; let listKey = '';
        input.split('\n').filter((line) => line.trim() && !line.trim().startsWith('#')).forEach((line) => { const list = line.match(/^\s*-\s+(.+)$/); const pair = line.match(/^\s*([^:#]+):\s*(.*)$/); if (list && listKey) { const current = result[listKey]; if (Array.isArray(current)) current.push(JSON.parse(list[1])); } else if (pair) { listKey = pair[1].trim(); result[listKey] = pair[2] ? JSON.parse(pair[2]) : []; } });
        setOutput(JSON.stringify(result, null, 2));
      }
      setError('');
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'แปลงข้อมูลไม่สำเร็จ'); setOutput(''); }
  };
  return <ToolShell><PanelHeader title='YAML ↔ JSON' description='แปลง JSON และ YAML สำหรับ configuration ที่มี object, array และ primitive values' />
    <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}><Button onClick={() => convert('yaml')} sx={actionButtonSx}>JSON → YAML</Button><Button variant='outlined' onClick={() => convert('json')} sx={actionButtonSx}>YAML → JSON</Button><CopyButton value={output} notify={notify} /></Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}><Textarea minRows={18} value={input} onChange={(event) => setInput(event.target.value)} placeholder='วาง JSON หรือ YAML…' sx={textAreaSx} /><Textarea minRows={18} readOnly value={output} placeholder='ผลลัพธ์…' sx={textAreaSx} /></Box>
    {error && <Typography sx={{ color: '#ba263f', fontSize: 12, mt: 1 }}>{error}</Typography>}
  </ToolShell>;
};

const SqlTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('select id,name,email from users where status = \'active\' order by created_at desc limit 20;');
  const [output, setOutput] = React.useState('');
  const format = () => setOutput(input.trim().replace(/\s+/g, ' ').replace(/\b(select|from|where|left join|right join|inner join|join|order by|group by|having|limit|insert into|values|update|set|delete from)\b/gi, (keyword) => `\n${keyword.toUpperCase()}`).replace(/\s*,\s*/g, ',\n  ').replace(/^\n/, '').trim());
  return <ToolShell><PanelHeader title='SQL Formatter' description='จัดบรรทัด SQL query ให้สแกนง่าย โดยคงข้อความและค่าของ query เดิมไว้' />
    <Textarea minRows={9} value={input} onChange={(event) => setInput(event.target.value)} placeholder='SELECT …' sx={textAreaSx} />
    <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><Button onClick={format} sx={actionButtonSx}>Format SQL</Button><CopyButton value={output} notify={notify} /></Box>
    <Textarea minRows={12} readOnly value={output} placeholder='Formatted SQL…' sx={textAreaSx} />
  </ToolShell>;
};

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MarkdownTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('# Hello, PadGad\n\nWrite **Markdown** and see a live preview.\n\n- Fast\n- Local-first\n- Useful');
  const html = escapeHtml(input).replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/^[-*] (.*)$/gm, '• $1').replace(/\n/g, '<br />');
  return <ToolShell><PanelHeader title='Markdown Preview' description='เขียน Markdown และดูตัวอย่างทันทีในเบราว์เซอร์ รองรับ heading, bold, code และ list' />
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}><Textarea minRows={19} value={input} onChange={(event) => setInput(event.target.value)} sx={textAreaSx} /><Sheet sx={{ p: 2.5, minHeight: 400, border: `1px solid ${colors.borderMedium}`, bgcolor: 'rgba(255,255,255,.75)', overflowWrap: 'anywhere', '& h1': { fontSize: 27, mt: 0 }, '& h2': { fontSize: 22 }, '& h3': { fontSize: 18 }, '& code': { px: .5, py: .15, borderRadius: 4, bgcolor: accentAlpha(.1), fontFamily: fonts.mono, fontSize: 12 } }}><Box dangerouslySetInnerHTML={{ __html: html }} /></Sheet></Box>
    <CopyButton value={input} notify={notify} />
  </ToolShell>;
};

const ColorTool = ({ notify }: { notify: (message: string) => void }) => {
  const [value, setValue] = React.useState('#16794a');
  const [result, setResult] = React.useState('');
  const convert = () => { const match = value.trim().match(/^#?([\da-f]{3}|[\da-f]{6})$/i); if (!match) { setResult('กรุณาใส่ HEX เช่น #16794a'); return; } const hex = match[1].length === 3 ? match[1].split('').map((item) => item + item).join('') : match[1]; const rgb = [0, 2, 4].map((index) => Number.parseInt(hex.slice(index, index + 2), 16)); setResult(`HEX  #${hex.toUpperCase()}\nRGB  rgb(${rgb.join(', ')})\nCSS  rgba(${rgb.join(', ')}, 1)`); };
  return <ToolShell><PanelHeader title='Color Converter' description='ตรวจและแปลงสี HEX เป็น RGB/CSS พร้อม preview สี' />
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}><Box sx={{ width: 58, height: 58, borderRadius: 10, border: `1px solid ${colors.borderMedium}`, bgcolor: /^#?[\da-f]{3,6}$/i.test(value) ? value : '#fff' }} /><Textarea minRows={2} value={value} onChange={(event) => setValue(event.target.value)} placeholder='#16794a' sx={{ ...textAreaSx, flex: 1 }} /></Box>
    <Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><Button onClick={convert} sx={actionButtonSx}>Convert color</Button><CopyButton value={result} notify={notify} /></Box><Textarea minRows={6} readOnly value={result} sx={textAreaSx} />
  </ToolShell>;
};

const CidrTool = ({ notify }: { notify: (message: string) => void }) => {
  const [input, setInput] = React.useState('192.168.1.50/24'); const [result, setResult] = React.useState('');
  const calculate = () => { const match = input.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d|[12]\d|3[0-2])$/); if (!match) { setResult('กรุณาใส่ IPv4/CIDR เช่น 192.168.1.50/24'); return; } const octets = match[1].split('.').map(Number); if (octets.some((item) => item > 255)) { setResult('IPv4 ไม่ถูกต้อง'); return; } const bits = Number(match[2]); const ip = octets.reduce((sum, item) => (sum << 8) + item, 0) >>> 0; const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0; const network = (ip & mask) >>> 0; const broadcast = (network | ~mask) >>> 0; const text = (num: number) => [24, 16, 8, 0].map((shift) => (num >>> shift) & 255).join('.'); const hosts = bits >= 31 ? Math.max(0, 2 ** (32 - bits) - (bits === 31 ? 0 : 1)) : 2 ** (32 - bits) - 2; setResult(`Network    ${text(network)}/${bits}\nNetmask    ${text(mask)}\nBroadcast  ${text(broadcast)}\nHost range ${bits >= 31 ? 'N/A' : `${text(network + 1)} – ${text(broadcast - 1)}`}\nUsable IPs ${hosts.toLocaleString()}`); };
  return <ToolShell><PanelHeader title='CIDR / IP Calculator' description='คำนวณ network, subnet mask, broadcast address, ช่วง host และจำนวน usable IP สำหรับ IPv4' />
    <Textarea minRows={2} value={input} onChange={(event) => setInput(event.target.value)} placeholder='192.168.1.50/24' sx={textAreaSx} /><Box sx={{ display: 'flex', gap: 1, my: 1.5 }}><Button onClick={calculate} sx={actionButtonSx}>Calculate subnet</Button><CopyButton value={result} notify={notify} /></Box><Textarea minRows={8} readOnly value={result} sx={textAreaSx} />
  </ToolShell>;
};

export const ToolsLayout = () => {
  const [activeTool, setActiveTool] = React.useState<ToolKey>('json');
  const [activeCategory, setActiveCategory] = React.useState<ToolCategory>('Data');
  const [search, setSearch] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const visibleTools = toolList.filter((tool) => {
    const term = search.trim().toLowerCase();
    return term ? `${tool.label} ${tool.short}`.toLowerCase().includes(term) : tool.category === activeCategory;
  });

  const notify = React.useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  }, []);

  const renderTool = () => {
    if (activeTool === 'json') return <JsonTool notify={notify} />;
    if (activeTool === 'base64') return <Base64Tool notify={notify} />;
    if (activeTool === 'jwt') return <JwtTool notify={notify} />;
    if (activeTool === 'uuid') return <UUIDTool notify={notify} />;
    if (activeTool === 'hash') return <HashTool notify={notify} />;
    if (activeTool === 'timestamp') return <TimestampTool notify={notify} />;
    if (activeTool === 'url') return <UrlTool notify={notify} />;
    if (activeTool === 'regex') return <RegexTool notify={notify} />;
    if (activeTool === 'diff') return <DiffTool notify={notify} />;
    if (activeTool === 'cron') return <CronTool notify={notify} />;
    if (activeTool === 'yaml') return <YamlTool notify={notify} />;
    if (activeTool === 'sql') return <SqlTool notify={notify} />;
    if (activeTool === 'markdown') return <MarkdownTool notify={notify} />;
    if (activeTool === 'qr') return <QrTool notify={notify} />;
    if (activeTool === 'color') return <ColorTool notify={notify} />;
    return <CidrTool notify={notify} />;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1240, mx: 'auto', px: { xs: 2, sm: 4, lg: 6 }, py: { xs: 4, md: 7 } }}>
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Chip size='sm' variant='outlined' sx={{ mb: 1.5, fontFamily: fonts.mono, color: colors.secondary, borderColor: colors.borderMedium, background: accentAlpha(.05) }}>LOCAL-FIRST UTILITIES</Chip>
        <Typography sx={{ fontFamily: fonts.mono, fontSize: { xs: 30, sm: 40, md: 48 }, fontWeight: 700, lineHeight: 1.12, color: colors.text }}>
          Developer <Box component='span' sx={{ color: colors.accent }}>Toolbox</Box>
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 680, color: colors.textMuted, fontFamily: fonts.body, fontSize: { xs: 14, sm: 15 }, lineHeight: 1.75 }}>
          เครื่องมือเล็ก ๆ สำหรับงานประจำวันของ developer — เร็ว เป็นส่วนตัว และทำงานบนเบราว์เซอร์โดยตรง
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5 }}>
        <Box
          component='nav'
          aria-label='Developer tools'
          sx={{
            position: 'sticky',
            top: 62,
            zIndex: 10,
            mx: { xs: -2, sm: -4, lg: -6 },
            px: { xs: 2, sm: 4, lg: 6 },
            py: 1.5,
            background: 'rgba(248, 252, 249, .9)',
            backdropFilter: 'blur(16px)',
            borderTop: `1px solid ${colors.borderLight}`,
            borderBottom: `1px solid ${colors.borderLight}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mb: 1.25 }}>
            <Box role='tablist' aria-label='Tool categories' sx={{ display: 'flex', gap: .5, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {(['Data', 'Text & Code', 'Security', 'Network'] as ToolCategory[]).map((category) => {
                const active = activeCategory === category && !search;
                return <Button key={category} role='tab' aria-selected={active} variant={active ? 'solid' : 'plain'} size='sm' onClick={() => { setActiveCategory(category); setSearch(''); }} sx={{ flex: '0 0 auto', fontFamily: fonts.mono, fontSize: 12.5, borderRadius: '8px', color: active ? '#fff' : colors.textMuted, '&:hover': { bgcolor: active ? colors.accentDeep : accentAlpha(.07) } }}>{category}</Button>;
              })}
            </Box>
            <Input
              size='sm'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              startDecorator={<SearchRoundedIcon sx={{ color: colors.textDim, fontSize: 17 }} />}
              placeholder='Search tools…'
              sx={{ width: { xs: 42, sm: 210 }, flex: '0 1 210px', bgcolor: '#fff', borderColor: colors.borderMedium, '& input': { fontFamily: fonts.mono, fontSize: 12.5 }, '& input::placeholder': { color: colors.textDim, opacity: { xs: 0, sm: 1 } }, '&:focus-within': { width: { xs: 160, sm: 230 }, borderColor: colors.accent } }}
            />
          </Box>
          <Box role='tablist' aria-label='Developer tools' sx={{ display: 'flex', flexWrap: 'wrap', gap: .75 }}>
            {visibleTools.map((tool) => {
              const active = activeTool === tool.key;
              return (
                <Sheet
                  component='button'
                  role='tab'
                  aria-selected={active}
                  key={tool.key}
                  type='button'
                  onClick={() => { setActiveTool(tool.key); setActiveCategory(tool.category); }}
                  sx={{
                    appearance: 'none',
                    px: 1.25,
                    py: .85,
                    display: 'flex',
                    alignItems: 'center',
                    gap: .75,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: active ? `linear-gradient(110deg, ${tool.accent}18, #fff)` : '#fff',
                    border: `1px solid ${active ? `${tool.accent}65` : colors.borderLight}`,
                    borderRadius: '9px',
                    boxShadow: active ? '0 4px 14px -12px rgba(17, 78, 48, .7)' : 'none',
                    transition: 'background .2s ease, border-color .2s ease, transform .2s ease',
                    '&:hover': { borderColor: `${tool.accent}55`, transform: 'translateY(-1px)' },
                  }}
                >
                  <Box sx={{ color: active ? tool.accent : colors.textDim, display: 'grid', placeItems: 'center', '& svg': { fontSize: 17 } }}>{tool.icon}</Box>
                  <Typography sx={{ fontFamily: fonts.mono, color: active ? colors.text : colors.textBody, fontSize: 12.5, fontWeight: active ? 700 : 600 }}>{tool.label}</Typography>
                </Sheet>
              );
            })}
            {visibleTools.length === 0 && <Typography sx={{ color: colors.textMuted, fontFamily: fonts.mono, fontSize: 12, py: .85 }}>No tools found.</Typography>}
          </Box>
        </Box>

        <Box role='tabpanel'>{renderTool()}</Box>
      </Box>

      <Box
        role='status'
        aria-live='polite'
        sx={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          zIndex: 1200,
          px: 2,
          py: 1.1,
          pointerEvents: 'none',
          opacity: notice ? 1 : 0,
          transform: notice ? 'translateY(0)' : 'translateY(10px)',
          transition: 'all .2s ease',
          background: 'rgba(255,255,255,.98)',
          border: `1px solid ${accentAlpha(.3)}`,
          boxShadow: '0 14px 36px rgba(20,65,42,.16)',
        }}
      >
        <Typography sx={{ fontFamily: fonts.mono, color: colors.secondary, fontSize: 11 }}>{notice}</Typography>
      </Box>
    </Box>
  );
};

import * as React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
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
import QRCode from 'qrcode';
import { accentAlpha, colors, fonts, gradients } from '../themeConfig';

type ToolKey = 'base64' | 'qr' | 'json' | 'url' | 'hash' | 'uuid';

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
}> = [
  { key: 'base64', label: 'Base64', short: 'Files ↔ Base64', accent: '#c4a0ff', icon: <AttachFileRoundedIcon /> },
  { key: 'qr', label: 'QR Code', short: 'Text & links', accent: '#6fe7ff', icon: <QrCode2RoundedIcon /> },
  { key: 'json', label: 'JSON', short: 'Format & minify', accent: '#7be0c8', icon: <DataObjectRoundedIcon /> },
  { key: 'url', label: 'URL Codec', short: 'Encode & decode', accent: '#f0b45c', icon: <InsertLinkRoundedIcon /> },
  { key: 'hash', label: 'SHA-256', short: 'Secure hash', accent: '#ff7ab6', icon: <FingerprintRoundedIcon /> },
  { key: 'uuid', label: 'UUID', short: 'Generate v4', accent: '#a8e063', icon: <KeyRoundedIcon /> },
];

const textAreaSx = {
  '--Textarea-focusedThickness': '1px',
  fontFamily: fonts.mono,
  fontSize: 13,
  color: colors.textBody,
  background: 'rgba(7, 7, 14, .56)',
  borderColor: colors.borderMedium,
  borderRadius: '6px',
  '&:hover': { borderColor: colors.borderHover },
  '&:focus-within': { borderColor: colors.accent },
};

const actionButtonSx = {
  fontFamily: fonts.mono,
  fontSize: 12,
  borderRadius: '5px',
  minHeight: 34,
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
    <Typography sx={{ mt: .75, color: colors.textMuted, fontSize: 13, lineHeight: 1.7 }}>
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
      borderRadius: '10px',
      background: `linear-gradient(145deg, rgba(30, 28, 45, .72), ${colors.surfaceSolid})`,
      border: `1px solid ${colors.borderMedium}`,
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
          background: dragging ? accentAlpha(.08) : 'rgba(7, 7, 14, .35)',
          cursor: 'pointer',
          transition: 'all .2s ease',
          '&:hover': { borderColor: colors.accent, background: accentAlpha(.05) },
        }}
      >
        <UploadFileRoundedIcon sx={{ color: colors.accent, fontSize: 36, mb: 1 }} />
        <Typography sx={{ fontFamily: fonts.mono, color: colors.textBody, fontSize: 13, textAlign: 'center' }}>
          วางไฟล์ที่นี่ หรือคลิกเพื่อเลือกไฟล์
        </Typography>
        <Typography sx={{ color: colors.textDim, fontSize: 11, mt: .75 }}>เลือกได้หลายไฟล์ · สูงสุด 25 MB ต่อไฟล์</Typography>
        <input hidden type='file' multiple onChange={(event) => event.target.files && void readFiles(event.target.files)} />
      </Box>

      {error && <Typography sx={{ color: '#ff8797', fontSize: 12, mt: 1.5 }}>{error}</Typography>}

      {files.length > 0 && (
        <Box sx={{ display: 'grid', gap: 1.25, mt: 2 }}>
          {files.map((file) => (
            <Sheet key={file.id} sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.5, background: 'rgba(7,7,14,.42)', border: `1px solid ${colors.borderLight}` }}>
              <AttachFileRoundedIcon sx={{ color: colors.accent, fontSize: 20 }} />
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography sx={{ fontFamily: fonts.mono, color: colors.textBody, fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                <Typography sx={{ color: colors.textDim, fontSize: 10 }}>{file.type} · {formatBytes(file.size)}</Typography>
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
          <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11, mb: .75 }}>CONTENT</Typography>
          <Textarea minRows={7} value={value} onChange={(event) => setValue(event.target.value)} placeholder='https://example.com' sx={textAreaSx} />
          <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11, mt: 2, mb: .75 }}>SIZE · {size}px</Typography>
          <input aria-label='QR Code size' type='range' min='180' max='600' step='20' value={size} onChange={(event) => setSize(Number(event.target.value))} style={{ width: '100%', accentColor: colors.accentDeep }} />
          {error && <Typography sx={{ color: '#ff8797', fontSize: 12, mt: 1 }}>{error}</Typography>}
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
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11, mb: .75 }}>INPUT</Typography>
      <Textarea minRows={7} value={input} onChange={(event) => setInput(event.target.value)} sx={textAreaSx} />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1.5 }}>
        <Button onClick={() => transform('encode')} sx={actionButtonSx}>Encode component</Button>
        <Button variant='outlined' onClick={() => transform('decode')} sx={actionButtonSx}>Decode component</Button>
      </Box>
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11, mb: .75 }}>OUTPUT</Typography>
      <Textarea minRows={7} readOnly value={output} sx={textAreaSx} />
      {error && <Typography sx={{ color: '#ff8797', fontSize: 12, mt: 1 }}>{error}</Typography>}
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
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11, mb: .75 }}>TEXT TO HASH</Typography>
      <Textarea minRows={9} value={input} onChange={(event) => setInput(event.target.value)} placeholder='พิมพ์ข้อความ…' sx={textAreaSx} />
      <Typography sx={{ fontFamily: fonts.mono, color: colors.textMuted, fontSize: 11, mt: 2, mb: .75 }}>SHA-256</Typography>
      <Sheet sx={{ p: 2, minHeight: 72, background: 'rgba(7,7,14,.55)', border: `1px solid ${colors.borderMedium}`, borderRadius: '6px' }}>
        <Typography sx={{ fontFamily: fonts.mono, color: hash ? '#7be0c8' : colors.textDim, fontSize: 13, wordBreak: 'break-all', lineHeight: 1.7 }}>{hash || 'ผลลัพธ์ 64 ตัวอักษรจะแสดงที่นี่'}</Typography>
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
      <Sheet sx={{ background: 'rgba(7,7,14,.5)', border: `1px solid ${colors.borderMedium}`, borderRadius: '6px', overflow: 'hidden' }}>
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

export const ToolsLayout = () => {
  const [activeTool, setActiveTool] = React.useState<ToolKey>('base64');
  const [notice, setNotice] = React.useState('');

  const notify = React.useCallback((message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 1800);
  }, []);

  const renderTool = () => {
    if (activeTool === 'base64') return <Base64Tool notify={notify} />;
    if (activeTool === 'qr') return <QrTool notify={notify} />;
    if (activeTool === 'json') return <JsonTool notify={notify} />;
    if (activeTool === 'url') return <UrlTool notify={notify} />;
    if (activeTool === 'hash') return <HashTool notify={notify} />;
    return <UUIDTool notify={notify} />;
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1240, mx: 'auto', px: { xs: 2, sm: 4, lg: 6 }, py: { xs: 4, md: 7 } }}>
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Chip size='sm' variant='outlined' sx={{ mb: 1.5, fontFamily: fonts.mono, color: colors.secondary, borderColor: 'rgba(123,224,200,.25)' }}>LOCAL-FIRST UTILITIES</Chip>
        <Typography sx={{ fontFamily: fonts.mono, fontSize: { xs: 30, sm: 40, md: 48 }, fontWeight: 700, lineHeight: 1.12, color: colors.text }}>
          Developer <Box component='span' sx={{ color: colors.accent }}>Toolbox</Box>
        </Typography>
        <Typography sx={{ mt: 1.5, maxWidth: 650, color: colors.textMuted, fontSize: { xs: 13, sm: 14 }, lineHeight: 1.8 }}>
          เครื่องมือเล็ก ๆ สำหรับงานประจำวันของ developer — เร็ว เป็นส่วนตัว และทำงานบนเบราว์เซอร์โดยตรง
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '230px minmax(0, 1fr)' }, gap: 2.5, alignItems: 'start' }}>
        <Box
          component='nav'
          aria-label='Developer tools'
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: '1fr' },
            gap: 1,
            position: { md: 'sticky' },
            top: { md: 86 },
          }}
        >
          {toolList.map((tool) => {
            const active = activeTool === tool.key;
            return (
              <Sheet
                component='button'
                key={tool.key}
                type='button'
                onClick={() => setActiveTool(tool.key)}
                sx={{
                  appearance: 'none',
                  width: '100%',
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.2,
                  textAlign: 'left',
                  cursor: 'pointer',
                  background: active ? `linear-gradient(110deg, ${tool.accent}18, rgba(17,17,27,.78))` : 'rgba(17,17,27,.5)',
                  border: `1px solid ${active ? `${tool.accent}55` : colors.borderLight}`,
                  borderRadius: '7px',
                  transition: 'border-color .2s ease, transform .2s ease',
                  '&:hover': { borderColor: `${tool.accent}55`, transform: 'translateX(2px)' },
                }}
              >
                <Box sx={{ color: active ? tool.accent : colors.textDim, display: 'grid', placeItems: 'center', '& svg': { fontSize: 20 } }}>{tool.icon}</Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontFamily: fonts.mono, color: active ? colors.text : colors.textBody, fontSize: 12, fontWeight: 700 }}>{tool.label}</Typography>
                  <Typography sx={{ display: { xs: 'none', sm: 'block' }, color: colors.textDim, fontSize: 10, mt: .15 }}>{tool.short}</Typography>
                </Box>
              </Sheet>
            );
          })}
          <Sheet sx={{ display: { xs: 'none', md: 'block' }, mt: 1.5, p: 1.5, background: gradients.surface, border: `1px solid ${colors.borderLight}` }}>
            <Typography sx={{ color: colors.textDim, fontSize: 10.5, lineHeight: 1.6 }}>
              🔒 ไฟล์และข้อความทั้งหมดประมวลผลภายในอุปกรณ์ของคุณ
            </Typography>
          </Sheet>
        </Box>

        <Box>{renderTool()}</Box>
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
          background: 'rgba(17,17,27,.96)',
          border: `1px solid ${accentAlpha(.3)}`,
          boxShadow: '0 12px 35px rgba(0,0,0,.35)',
        }}
      >
        <Typography sx={{ fontFamily: fonts.mono, color: colors.secondary, fontSize: 11 }}>{notice}</Typography>
      </Box>
    </Box>
  );
};

import * as React from 'react';
import { Box, Typography, Button, Input, Textarea } from '@mui/joy';
import { colors, fonts, accentAlpha } from '../themeConfig';

interface HarEntry {
  request?: { headers?: { name: string; value: string }[] };
  _webSocketMessages?: { data: string }[];
}

interface HarFile {
  log?: { entries?: HarEntry[] };
}

const sx = {
  root: {
    p: { xs: 2, md: 3 },
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.text,
    minHeight: 'calc(100vh - 56px)',
    maxWidth: 900,
    mx: 'auto',
  },
  title: { color: colors.accent, mb: 0.5, fontSize: 22, fontWeight: 700, fontFamily: fonts.mono },
  subtitle: { color: colors.textMuted, mb: 3, fontSize: 12, fontFamily: fonts.mono },
  card: {
    background: colors.surfaceSolid,
    border: `1px solid ${accentAlpha(0.12)}`,
    borderRadius: '8px',
    p: 2.5,
    mb: 2,
  },
  label: {
    color: colors.accent,
    fontSize: 12,
    fontFamily: fonts.mono,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    mb: 1,
  },
  hint: { color: colors.textMuted, fontSize: 11, mt: 0.5, fontFamily: fonts.mono },
  resultBox: {
    mt: 2,
    background: colors.surfaceDarkest,
    border: `1px solid ${accentAlpha(0.12)}`,
    borderRadius: '6px',
    p: 2,
    maxHeight: 400,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    fontSize: 11,
    fontFamily: fonts.mono,
    color: colors.textBody,
  },
  stat: {
    display: 'inline-block',
    px: 1,
    py: '2px',
    borderRadius: '12px',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: fonts.mono,
    m: '2px',
  },
} as const;

export const HarToSipLayout: React.FC = () => {
  const [harData, setHarData] = React.useState<HarFile | null>(null);
  const [fileName, setFileName] = React.useState('');
  const [wsKey, setWsKey] = React.useState('');
  const [result, setResult] = React.useState('');
  const [availableKeys, setAvailableKeys] = React.useState<{ key: string; count: number }[]>([]);
  const [error, setError] = React.useState('');
  const [inputMode, setInputMode] = React.useState<'file' | 'paste'>('file');
  const [pasteText, setPasteText] = React.useState('');

  const parseHar = (text: string, name: string) => {
    setError('');
    setResult('');
    setFileName(name);
    try {
      const parsed: HarFile = JSON.parse(text);
      setHarData(parsed);

      const keyMap: Record<string, number> = {};
      (parsed.log?.entries || []).forEach((entry) => {
        if (entry._webSocketMessages && entry._webSocketMessages.length > 0) {
          const headers = entry.request?.headers || [];
          const keyHeader = headers.find((h) => h.name.toLowerCase() === 'sec-websocket-key');
          if (keyHeader) {
            keyMap[keyHeader.value] = (keyMap[keyHeader.value] || 0) + entry._webSocketMessages.length;
          }
        }
      });
      const keys = Object.entries(keyMap)
        .map(([key, count]) => ({ key, count }))
        .sort((a, b) => b.count - a.count);
      setAvailableKeys(keys);
      if (keys.length === 1) setWsKey(keys[0].key);
    } catch {
      setError('ไม่สามารถอ่าน HAR ได้ — ตรวจสอบว่าเป็น JSON ที่ถูกต้อง');
      setHarData(null);
      setAvailableKeys([]);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    parseHar(text, file.name);
  };

  const handlePaste = () => {
    if (!pasteText.trim()) return;
    parseHar(pasteText, 'pasted-data');
  };

  const convert = () => {
    if (!harData) return;
    setError('');

    const entries = harData.log?.entries || [];
    const lines: string[] = [];

    entries.forEach((entry) => {
      if (!entry._webSocketMessages) return;

      // If key is provided, filter by it
      if (wsKey.trim()) {
        const headers = entry.request?.headers || [];
        const keyHeader = headers.find((h) => h.name.toLowerCase() === 'sec-websocket-key');
        if (!keyHeader || keyHeader.value !== wsKey.trim()) return;
      }

      entry._webSocketMessages.forEach((msg) => {
        // Convert \r\n to \n (same as gsub in the shell script)
        const cleaned = (msg.data || '').replace(/\r\n/g, '\n');
        lines.push(cleaned);
      });
    });

    if (lines.length === 0) {
      setError('ไม่พบ WebSocket messages ที่ตรงกับ key ที่ระบุ');
      setResult('');
      return;
    }

    setResult(lines.join('\n'));
  };

  const download = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const baseName = fileName.replace(/\.har$/i, '') || 'output';
    a.download = `${baseName}.sip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const messageCount = result
    ? result.split('\n').filter((l) => l.match(/^(REGISTER|INVITE|ACK|BYE|CANCEL|OPTIONS|NOTIFY|INFO|SIP\/2\.0)/))
        .length
    : 0;

  return (
    <Box sx={sx.root}>
      <Typography sx={sx.title}>🔄 HAR → SIP Converter</Typography>
      <Typography sx={sx.subtitle}>แปลง WebSocket SIP messages จากไฟล์ .har (Chrome DevTools) เป็นไฟล์ .sip</Typography>

      {/* Step 1: Input */}
      <Box sx={sx.card}>
        <Typography sx={sx.label}>1. ใส่ข้อมูล HAR</Typography>
        <Box sx={{ display: 'flex', gap: '2px', mb: 1.5 }}>
          {(['file', 'paste'] as const).map((mode) => (
            <Box
              key={mode}
              onClick={() => setInputMode(mode)}
              sx={{
                px: 1.5,
                py: 0.6,
                borderRadius: '4px',
                fontSize: 12,
                fontFamily: fonts.mono,
                cursor: 'pointer',
                transition: 'all 0.15s',
                background: inputMode === mode ? colors.accentDeep : 'transparent',
                color: inputMode === mode ? '#fff' : colors.textMuted,
                border: `1px solid ${inputMode === mode ? colors.accentDeep : accentAlpha(0.12)}`,
                '&:hover': { background: inputMode === mode ? colors.accentDeep : accentAlpha(0.1) },
              }}
            >
              {mode === 'file' ? '📁 เลือกไฟล์' : '📋 วางข้อมูล'}
            </Box>
          ))}
        </Box>

        {inputMode === 'file' ? (
          <>
            <Box
              sx={{
                '& input': {
                  background: colors.surface,
                  border: `1px dashed ${accentAlpha(0.2)}`,
                  color: colors.text,
                  p: '12px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontFamily: fonts.mono,
                  width: '100%',
                  '&:hover': { borderColor: colors.accent },
                },
              }}
            >
              <input type='file' accept='.har,.json' onChange={handleFile} />
            </Box>
            <Typography sx={sx.hint}>
              Export จาก Chrome DevTools → Network tab → คลิกขวา → Save all as HAR with content
            </Typography>
          </>
        ) : (
          <>
            <Textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder='วาง HAR JSON ที่นี่...'
              minRows={6}
              maxRows={12}
              sx={{
                fontFamily: fonts.mono,
                fontSize: 12,
                background: colors.surface,
                border: `1px solid ${accentAlpha(0.12)}`,
                color: colors.text,
                '--Textarea-focusedHighlight': colors.accent,
              }}
            />
            <Button
              onClick={handlePaste}
              disabled={!pasteText.trim()}
              size='sm'
              sx={{
                mt: 1,
                fontFamily: fonts.mono,
                fontSize: 12,
                background: colors.accentDeep,
                color: '#fff',
                '&:hover': { background: colors.accent },
                '&:disabled': { background: accentAlpha(0.1), color: colors.textDim },
              }}
            >
              ✓ Parse JSON
            </Button>
          </>
        )}

        {harData && (
          <Typography sx={{ color: colors.secondary, fontSize: 12, mt: 1, fontFamily: fonts.mono }}>
            ✓ โหลดสำเร็จ: {fileName} ({(harData.log?.entries || []).length} entries)
          </Typography>
        )}
      </Box>

      {/* Step 2: WebSocket Key */}
      <Box sx={sx.card}>
        <Typography sx={sx.label}>2. Sec-WebSocket-Key (optional)</Typography>
        <Input
          value={wsKey}
          onChange={(e) => setWsKey(e.target.value)}
          placeholder='เว้นว่างเพื่อดึงทุก WebSocket messages'
          sx={{
            fontFamily: fonts.mono,
            fontSize: 13,
            background: colors.surface,
            border: `1px solid ${accentAlpha(0.12)}`,
            color: colors.text,
            '--Input-focusedHighlight': colors.accent,
          }}
        />
        <Typography sx={sx.hint}>
          ใส่ key เพื่อ filter เฉพาะ WebSocket connection ที่ต้องการ — เว้นว่างจะดึงทั้งหมด
        </Typography>

        {availableKeys.length > 0 && (
          <Box sx={{ mt: 1.5 }}>
            <Typography sx={{ ...sx.hint, color: colors.textBody, mb: 0.8 }}>
              พบ WebSocket Keys ในไฟล์ ({availableKeys.length} keys):
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {availableKeys.map((k) => (
                <Box
                  key={k.key}
                  onClick={() => setWsKey(k.key)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: '6px 10px',
                    borderRadius: '4px',
                    background: wsKey === k.key ? accentAlpha(0.15) : 'transparent',
                    border: `1px solid ${wsKey === k.key ? accentAlpha(0.3) : 'transparent'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': { background: accentAlpha(0.1), border: `1px solid ${accentAlpha(0.2)}` },
                  }}
                >
                  <Box
                    component='span'
                    sx={{
                      fontSize: 12,
                      fontFamily: fonts.mono,
                      color: wsKey === k.key ? colors.accent : colors.text,
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {k.key}
                  </Box>
                  <Box
                    component='span'
                    sx={{
                      ...sx.stat,
                      background: accentAlpha(0.12),
                      color: colors.secondary,
                      border: `1px solid rgba(123,224,200,0.3)`,
                    }}
                  >
                    {k.count} msgs
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Step 3: Convert */}
      <Box sx={sx.card}>
        <Typography sx={sx.label}>3. แปลงและดาวน์โหลด</Typography>
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
          <Button
            onClick={convert}
            disabled={!harData}
            sx={{
              fontFamily: fonts.mono,
              background: colors.accentDeep,
              color: '#fff',
              '&:hover': { background: colors.accent },
              '&:disabled': { background: accentAlpha(0.1), color: colors.textDim },
            }}
          >
            🔄 Convert
          </Button>
          <Button
            onClick={download}
            disabled={!result}
            variant='outlined'
            sx={{
              fontFamily: fonts.mono,
              borderColor: accentAlpha(0.3),
              color: colors.accent,
              '&:hover': { background: accentAlpha(0.1), borderColor: colors.accent },
              '&:disabled': { borderColor: accentAlpha(0.08), color: colors.textDim },
            }}
          >
            💾 Download .sip
          </Button>
        </Box>

        {error && (
          <Typography sx={{ color: '#f85149', fontSize: 12, mt: 1.5, fontFamily: fonts.mono }}>✗ {error}</Typography>
        )}

        {result && (
          <>
            <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Box
                component='span'
                sx={{
                  ...sx.stat,
                  background: accentAlpha(0.12),
                  color: colors.accent,
                  border: `1px solid ${accentAlpha(0.3)}`,
                }}
              >
                {result.split('\n').length} lines
              </Box>
              <Box
                component='span'
                sx={{
                  ...sx.stat,
                  background: 'rgba(123,224,200,0.12)',
                  color: colors.secondary,
                  border: '1px solid rgba(123,224,200,0.3)',
                }}
              >
                {messageCount} SIP messages
              </Box>
              <Box
                component='span'
                sx={{
                  ...sx.stat,
                  background: 'rgba(240,136,62,0.12)',
                  color: '#f0883e',
                  border: '1px solid rgba(240,136,62,0.3)',
                }}
              >
                {(new Blob([result]).size / 1024).toFixed(1)} KB
              </Box>
            </Box>
            <Box sx={sx.resultBox}>
              {result.length > 10000
                ? result.substring(0, 10000) + '\n\n... (truncated preview — download for full file)'
                : result}
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default HarToSipLayout;

import * as React from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  Input,
  Option,
  Select,
  Sheet,
  Textarea,
  Typography,
} from '@mui/joy';
import CenterFocusStrongRoundedIcon from '@mui/icons-material/CenterFocusStrongRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import FileOpenRoundedIcon from '@mui/icons-material/FileOpenRounded';
import GridOnRoundedIcon from '@mui/icons-material/GridOnRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import { accentAlpha, colors, fonts, gradients } from '../themeConfig';

type SvgStudioProps = {
  notify: (message: string) => void;
};

type SanitizedSvg = {
  svg: string;
  error: string;
  removed: number;
};

type SvgMeta = {
  width: string;
  height: string;
  viewBox: [string, string, string, string];
  elements: number;
  colors: string[];
  bytes: number;
};

const SAMPLE_SVG = `<svg width="420" height="280" viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="420" height="280" rx="32" fill="#F2F8F4"/>
  <circle cx="210" cy="140" r="88" fill="#0F6F42"/>
  <path d="M168 145L198 175L258 105" stroke="#FFFFFF" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="326" cy="58" r="20" fill="#F4B942"/>
</svg>`;

const textAreaSx = {
  '--Textarea-focusedThickness': '1px',
  fontFamily: fonts.mono,
  fontSize: 13,
  lineHeight: 1.65,
  color: colors.textBody,
  background: '#fff',
  borderColor: colors.borderMedium,
  borderRadius: '9px',
  '&:hover': { borderColor: colors.borderHover },
  '&:focus-within': { borderColor: colors.accent },
};

const compactButtonSx = {
  minHeight: 34,
  borderRadius: '8px',
  fontFamily: fonts.mono,
  fontSize: 11.5,
};

const fieldLabelSx = {
  mb: .65,
  fontFamily: fonts.mono,
  color: colors.textMuted,
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '.06em',
};

const parseNumber = (value: string) => {
  const match = value.match(/-?\d*\.?\d+/);
  return match ? Number(match[0]) : 0;
};

const sanitizeSvg = (source: string): SanitizedSvg => {
  if (!source.trim()) return { svg: '', error: 'วางโค้ด SVG หรือเปิดไฟล์เพื่อเริ่มต้น', removed: 0 };

  const parser = new DOMParser();
  const documentNode = parser.parseFromString(source, 'image/svg+xml');
  const parserError = documentNode.querySelector('parsererror');
  if (parserError) {
    const detail = parserError.textContent?.split('\n')[0]?.trim();
    return { svg: '', error: detail || 'โครงสร้าง SVG ไม่ถูกต้อง', removed: 0 };
  }

  const root = documentNode.documentElement;
  if (root.localName.toLowerCase() !== 'svg') {
    return { svg: '', error: 'เอกสารต้องเริ่มต้นด้วยแท็ก <svg>', removed: 0 };
  }

  let removed = 0;
  const blockedTags = ['script', 'foreignObject', 'iframe', 'object', 'embed', 'audio', 'video', 'canvas'];
  root.querySelectorAll(blockedTags.join(',')).forEach((node) => {
    node.remove();
    removed += 1;
  });

  [root, ...Array.from(root.querySelectorAll('*'))].forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      const isEvent = name.startsWith('on');
      const isLink = name === 'href' || name === 'xlink:href' || name === 'src';
      const safeLink = value.startsWith('#') || value.startsWith('data:image/');
      const hasExternalCss = /@import|url\s*\(\s*["']?\s*(?:https?:|\/\/)/i.test(value);
      if (isEvent || (isLink && !safeLink) || hasExternalCss) {
        element.removeAttribute(attribute.name);
        removed += 1;
      }
    });
  });

  root.querySelectorAll('style').forEach((style) => {
    if (/@import|url\s*\(\s*["']?\s*(?:https?:|\/\/)/i.test(style.textContent || '')) {
      style.remove();
      removed += 1;
    }
  });

  if (!root.getAttribute('xmlns')) root.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  return { svg: new XMLSerializer().serializeToString(root), error: '', removed };
};

const readMeta = (svg: string): SvgMeta => {
  if (!svg) return { width: '', height: '', viewBox: ['0', '0', '512', '512'], elements: 0, colors: [], bytes: 0 };
  const root = new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement;
  const viewBox = (root.getAttribute('viewBox') || '').trim().split(/[\s,]+/);
  const colors = new Set<string>();
  const colorAttributes = ['fill', 'stroke', 'stop-color', 'flood-color', 'lighting-color', 'color'];

  [root, ...Array.from(root.querySelectorAll('*'))].forEach((element) => {
    colorAttributes.forEach((name) => {
      const value = element.getAttribute(name)?.trim();
      if (value && !['none', 'inherit', 'currentcolor', 'transparent'].includes(value.toLowerCase()) && !value.startsWith('url(')) colors.add(value);
    });
    const style = element.getAttribute('style') || '';
    Array.from(style.matchAll(/(?:fill|stroke|stop-color|color)\s*:\s*([^;]+)/gi)).forEach((match) => {
      const value = match[1].trim();
      if (!['none', 'inherit', 'currentcolor', 'transparent'].includes(value.toLowerCase()) && !value.startsWith('url(')) colors.add(value);
    });
  });

  const width = root.getAttribute('width') || '';
  const height = root.getAttribute('height') || '';
  return {
    width,
    height,
    viewBox: viewBox.length === 4
      ? [viewBox[0], viewBox[1], viewBox[2], viewBox[3]]
      : ['0', '0', String(parseNumber(width) || 512), String(parseNumber(height) || 512)],
    elements: root.querySelectorAll('*').length,
    colors: Array.from(colors).slice(0, 18),
    bytes: new TextEncoder().encode(svg).length,
  };
};

const updateRootAttribute = (source: string, name: string, value: string) => {
  const parsed = sanitizeSvg(source);
  if (!parsed.svg) return source;
  const documentNode = new DOMParser().parseFromString(parsed.svg, 'image/svg+xml');
  const root = documentNode.documentElement;
  if (value.trim()) root.setAttribute(name, value.trim());
  else root.removeAttribute(name);
  return new XMLSerializer().serializeToString(root);
};

const formatSvg = (source: string) => {
  const parsed = sanitizeSvg(source);
  if (!parsed.svg) return source;
  let depth = 0;
  return parsed.svg
    .replace(/></g, '>\n<')
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (/^<\//.test(trimmed)) depth = Math.max(0, depth - 1);
      const formatted = `${'  '.repeat(depth)}${trimmed}`;
      if (/^<[^!?/][^>]*[^/]>/i.test(trimmed) && !/<\/[^>]+>$/.test(trimmed)) depth += 1;
      return formatted;
    })
    .join('\n');
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

const formatBytes = (bytes: number) => bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

export const SvgStudio = ({ notify }: SvgStudioProps) => {
  const [source, setSource] = React.useState(SAMPLE_SVG);
  const [viewBoxDraft, setViewBoxDraft] = React.useState<[string, string, string, string]>(['0', '0', '420', '280']);
  const [zoom, setZoom] = React.useState(100);
  const [rotation, setRotation] = React.useState(0);
  const [background, setBackground] = React.useState<'grid' | 'white' | 'dark'>('grid');
  const [pngScale, setPngScale] = React.useState(2);
  const [findColor, setFindColor] = React.useState('#0F6F42');
  const [replaceColor, setReplaceColor] = React.useState('#2563EB');
  const [dragging, setDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const parsed = React.useMemo(() => sanitizeSvg(source), [source]);
  const meta = React.useMemo(() => readMeta(parsed.svg), [parsed.svg]);
  const viewBoxSignature = meta.viewBox.join(' ');
  const previewUrl = React.useMemo(
    () => parsed.svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(parsed.svg)}` : '',
    [parsed.svg],
  );

  React.useEffect(() => {
    setViewBoxDraft(viewBoxSignature.split(' ') as [string, string, string, string]);
  }, [viewBoxSignature]);

  const replaceEveryColor = () => {
    if (!findColor.trim() || !parsed.svg) return;
    const escaped = findColor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const next = parsed.svg.replace(new RegExp(escaped, 'gi'), replaceColor);
    setSource(formatSvg(next));
    notify(`เปลี่ยน ${findColor} เป็น ${replaceColor} แล้ว`);
  };

  const setViewBoxPart = (index: number, value: string) => {
    const parts = [...viewBoxDraft] as [string, string, string, string];
    parts[index] = value;
    setViewBoxDraft(parts);
    if (parts.every((part) => part.trim() !== '' && Number.isFinite(Number(part)))) {
      setSource(updateRootAttribute(source, 'viewBox', parts.join(' ')));
    }
  };

  const loadFile = React.useCallback((file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.svg') && file.type !== 'image/svg+xml') {
      notify('รองรับไฟล์ .svg เท่านั้น');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify('ไฟล์ SVG ต้องมีขนาดไม่เกิน 5 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSource(String(reader.result || ''));
      setZoom(100);
      setRotation(0);
      notify(`เปิด ${file.name} แล้ว`);
    };
    reader.readAsText(file);
  }, [notify]);

  const copy = async (value: string, message: string) => {
    await navigator.clipboard.writeText(value);
    notify(message);
  };

  const exportPng = () => {
    if (!parsed.svg) return;
    const width = Math.max(1, parseNumber(meta.width) || Number(meta.viewBox[2]) || 512);
    const height = Math.max(1, parseNumber(meta.height) || Number(meta.viewBox[3]) || 512);
    const targetWidth = Math.round(width * pngScale);
    const targetHeight = Math.round(height * pngScale);
    if (targetWidth > 8192 || targetHeight > 8192) {
      notify('PNG ต้องมีด้านยาวไม่เกิน 8,192 px — ลองลดขนาดหรือ scale');
      return;
    }
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const context = canvas.getContext('2d');
      if (!context) return;
      context.drawImage(image, 0, 0, targetWidth, targetHeight);
      canvas.toBlob((blob) => {
        if (blob) {
          downloadBlob(blob, `artwork@${pngScale}x.png`);
          notify(`ดาวน์โหลด PNG ${targetWidth}×${targetHeight} แล้ว`);
        }
      }, 'image/png');
    };
    image.onerror = () => notify('แปลง PNG ไม่สำเร็จ กรุณาตรวจ SVG อีกครั้ง');
    image.src = previewUrl;
  };

  const canvasBackground = background === 'grid'
    ? {
        backgroundColor: '#f8faf9',
        backgroundImage: 'linear-gradient(45deg, #e3eae5 25%, transparent 25%), linear-gradient(-45deg, #e3eae5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e3eae5 75%), linear-gradient(-45deg, transparent 75%, #e3eae5 75%)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
      }
    : { backgroundColor: background === 'dark' ? '#17211c' : '#ffffff' };

  return (
    <Sheet
      variant='plain'
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        minHeight: 720,
        borderRadius: '14px',
        background: gradients.surface,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2.5 }}>
        <Box>
          <Typography sx={{ fontFamily: fonts.mono, fontSize: { xs: 20, md: 24 }, fontWeight: 700, color: colors.text }}>
            SVG Studio
          </Typography>
          <Typography sx={{ mt: .65, color: colors.textMuted, fontSize: 14, lineHeight: 1.65 }}>
            เปิด แก้ และตรวจ SVG แบบสด ๆ พร้อมจัดโค้ด เปลี่ยนสี และส่งออก SVG / PNG — ทำงานในเบราว์เซอร์ทั้งหมด
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .75 }}>
          <input ref={fileInputRef} hidden type='file' accept='.svg,image/svg+xml' onChange={(event) => { loadFile(event.target.files?.[0]); event.target.value = ''; }} />
          <Button variant='outlined' startDecorator={<FileOpenRoundedIcon />} onClick={() => fileInputRef.current?.click()} sx={compactButtonSx}>Open SVG</Button>
          <Button variant='outlined' startDecorator={<ContentCopyRoundedIcon />} disabled={!parsed.svg} onClick={() => void copy(parsed.svg, 'คัดลอก SVG แล้ว')} sx={compactButtonSx}>Copy</Button>
          <Button startDecorator={<DownloadRoundedIcon />} disabled={!parsed.svg} onClick={() => { downloadBlob(new Blob([parsed.svg], { type: 'image/svg+xml;charset=utf-8' }), 'artwork.svg'); notify('ดาวน์โหลด SVG แล้ว'); }} sx={compactButtonSx}>Save SVG</Button>
        </Box>
      </Box>

      <Box
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); loadFile(event.dataTransfer.files[0]); }}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(330px, .88fr) minmax(420px, 1.12fr)' },
          border: `1px solid ${dragging ? colors.accent : colors.borderMedium}`,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: dragging ? `0 0 0 3px ${accentAlpha(.12)}` : 'none',
          transition: 'border-color .15s ease, box-shadow .15s ease',
        }}
      >
        <Box sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0, background: '#fbfdfb', borderRight: { lg: `1px solid ${colors.borderMedium}` }, borderBottom: { xs: `1px solid ${colors.borderMedium}`, lg: 'none' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: .75 }}>
              <CodeRoundedIcon sx={{ fontSize: 17, color: colors.accent }} />
              <Typography sx={{ fontFamily: fonts.mono, color: colors.textBody, fontWeight: 700, fontSize: 12 }}>SVG SOURCE</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: .5 }}>
              <Button size='sm' variant='plain' onClick={() => setSource(formatSvg(source))} sx={compactButtonSx}>Format</Button>
              <Button size='sm' variant='plain' onClick={() => setSource(parsed.svg.replace(/>\s+</g, '><').replace(/<!--([\s\S]*?)-->/g, ''))} disabled={!parsed.svg} sx={compactButtonSx}>Minify</Button>
              <Button size='sm' variant='plain' startDecorator={<RefreshRoundedIcon />} onClick={() => setSource(SAMPLE_SVG)} sx={compactButtonSx}>Reset</Button>
            </Box>
          </Box>
          <Textarea
            aria-label='SVG source code'
            minRows={24}
            maxRows={24}
            value={source}
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
            placeholder='<svg viewBox="0 0 24 24">…</svg>'
            sx={{ ...textAreaSx, '& textarea': { whiteSpace: 'pre', overflow: 'auto' } }}
          />
          <Box sx={{ mt: 1.25, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: .75 }}>
            <Chip size='sm' color={parsed.error ? 'danger' : 'success'} variant='soft' sx={{ fontFamily: fonts.mono, fontSize: 10.5 }}>
              {parsed.error ? 'INVALID SVG' : 'VALID SVG'}
            </Chip>
            {parsed.removed > 0 && <Chip size='sm' color='warning' variant='soft' sx={{ fontFamily: fonts.mono, fontSize: 10.5 }}>ซ่อนเนื้อหาที่ไม่ปลอดภัย {parsed.removed} จุด</Chip>}
            <Typography sx={{ color: parsed.error ? '#b42318' : colors.textDim, fontSize: 11.5, overflowWrap: 'anywhere' }}>
              {parsed.error || `${meta.elements} elements · ${meta.colors.length} colors · ${formatBytes(meta.bytes)}`}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 1.5, sm: 2 }, minWidth: 0, background: '#fff' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: .5, mb: 1.25 }}>
            <Button aria-label='Zoom out' size='sm' variant='plain' onClick={() => setZoom((value) => Math.max(25, value - 25))} sx={{ ...compactButtonSx, minWidth: 34, px: .5 }}><ZoomOutRoundedIcon /></Button>
            <Typography sx={{ width: 48, textAlign: 'center', fontFamily: fonts.mono, fontSize: 11.5, color: colors.textBody }}>{zoom}%</Typography>
            <Button aria-label='Zoom in' size='sm' variant='plain' onClick={() => setZoom((value) => Math.min(400, value + 25))} sx={{ ...compactButtonSx, minWidth: 34, px: .5 }}><ZoomInRoundedIcon /></Button>
            <Button size='sm' variant='plain' startDecorator={<CenterFocusStrongRoundedIcon />} onClick={() => { setZoom(100); setRotation(0); }} sx={compactButtonSx}>Fit</Button>
            <Button size='sm' variant='plain' startDecorator={<RotateRightRoundedIcon />} onClick={() => setRotation((value) => (value + 90) % 360)} sx={compactButtonSx}>{rotation}°</Button>
            <Select size='sm' value={background} onChange={(_, value) => value && setBackground(value)} startDecorator={<GridOnRoundedIcon />} sx={{ ml: { sm: 'auto' }, minWidth: 128, fontFamily: fonts.mono, fontSize: 11.5, borderColor: colors.borderMedium }}>
              <Option value='grid'>Transparent</Option>
              <Option value='white'>White</Option>
              <Option value='dark'>Dark</Option>
            </Select>
          </Box>

          <Sheet
            sx={{
              ...canvasBackground,
              position: 'relative',
              display: 'grid',
              placeItems: 'center',
              height: { xs: 390, md: 470 },
              overflow: 'auto',
              border: `1px solid ${colors.borderMedium}`,
              borderRadius: '9px',
            }}
          >
            {parsed.svg ? (
              <Box sx={{ display: 'grid', placeItems: 'center', minWidth: `${Math.max(100, zoom)}%`, minHeight: `${Math.max(100, zoom)}%`, p: 3 }}>
                <Box component='img' src={previewUrl} alt='SVG preview' sx={{ display: 'block', maxWidth: zoom <= 100 ? `${zoom}%` : 'none', width: zoom > 100 ? `${zoom}%` : 'auto', maxHeight: zoom <= 100 ? `${zoom}%` : 'none', transform: `rotate(${rotation}deg)`, transformOrigin: 'center', transition: 'transform .18s ease' }} />
              </Box>
            ) : (
              <Box sx={{ px: 3, textAlign: 'center' }}>
                <ImageRoundedIcon sx={{ fontSize: 42, color: colors.borderHover }} />
                <Typography sx={{ mt: 1, fontFamily: fonts.mono, color: colors.textMuted, fontSize: 12 }}>Preview จะแสดงเมื่อ SVG ถูกต้อง</Typography>
                <Typography sx={{ mt: .5, color: colors.textDim, fontSize: 11.5 }}>วางไฟล์ลงตรงนี้ได้ด้วย</Typography>
              </Box>
            )}
          </Sheet>
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', xl: '1.1fr 1fr 1fr' }, gap: 2, mt: 2 }}>
        <Sheet sx={{ p: 2, border: `1px solid ${colors.borderLight}`, borderRadius: '10px', background: colors.surfaceDark }}>
          <Typography sx={{ fontFamily: fonts.mono, color: colors.text, fontSize: 12.5, fontWeight: 700 }}>Canvas & viewBox</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.5 }}>
            <Box><Typography sx={fieldLabelSx}>WIDTH</Typography><Input size='sm' value={meta.width} placeholder='auto' onChange={(event) => setSource(updateRootAttribute(source, 'width', event.target.value))} sx={{ fontFamily: fonts.mono }} /></Box>
            <Box><Typography sx={fieldLabelSx}>HEIGHT</Typography><Input size='sm' value={meta.height} placeholder='auto' onChange={(event) => setSource(updateRootAttribute(source, 'height', event.target.value))} sx={{ fontFamily: fonts.mono }} /></Box>
          </Box>
          <Typography sx={{ ...fieldLabelSx, mt: 1.5 }}>VIEWBOX · X / Y / W / H</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: .75 }}>
            {viewBoxDraft.map((value, index) => <Input key={index} size='sm' value={value} aria-label={`ViewBox ${['x', 'y', 'width', 'height'][index]}`} onChange={(event) => setViewBoxPart(index, event.target.value)} sx={{ minWidth: 0, fontFamily: fonts.mono, '& input': { px: .75 } }} />)}
          </Box>
        </Sheet>

        <Sheet sx={{ p: 2, border: `1px solid ${colors.borderLight}`, borderRadius: '10px', background: colors.surfaceDark }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: .75 }}><PaletteOutlinedIcon sx={{ fontSize: 17, color: colors.accent }} /><Typography sx={{ fontFamily: fonts.mono, color: colors.text, fontSize: 12.5, fontWeight: 700 }}>Colors</Typography></Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .7, mt: 1.3, minHeight: 27 }}>
            {meta.colors.map((color) => (
              <Box component='button' type='button' key={color} title={`เลือก ${color}`} onClick={() => setFindColor(color)} sx={{ width: 25, height: 25, borderRadius: '50%', bgcolor: color, border: `2px solid ${findColor.toLowerCase() === color.toLowerCase() ? colors.accent : '#fff'}`, boxShadow: `0 0 0 1px ${colors.borderMedium}`, cursor: 'pointer' }} />
            ))}
            {!meta.colors.length && <Typography sx={{ color: colors.textDim, fontSize: 11.5 }}>ยังไม่พบค่าสีใน SVG</Typography>}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 34px 1fr', alignItems: 'end', gap: .75, mt: 1.4 }}>
            <Box><Typography sx={fieldLabelSx}>FIND</Typography><Input size='sm' value={findColor} onChange={(event) => setFindColor(event.target.value)} sx={{ fontFamily: fonts.mono }} /></Box>
            <Typography sx={{ pb: .8, textAlign: 'center', color: colors.textDim }}>→</Typography>
            <Box><Typography sx={fieldLabelSx}>REPLACE</Typography><Input size='sm' value={replaceColor} onChange={(event) => setReplaceColor(event.target.value)} endDecorator={<Box component='input' aria-label='Pick replacement color' type='color' value={/^#[0-9a-f]{6}$/i.test(replaceColor) ? replaceColor : '#2563eb'} onChange={(event: React.ChangeEvent<HTMLInputElement>) => setReplaceColor(event.target.value.toUpperCase())} sx={{ width: 20, height: 20, p: 0, border: 0, bgcolor: 'transparent', cursor: 'pointer' }} />} sx={{ fontFamily: fonts.mono }} /></Box>
          </Box>
          <Button variant='outlined' size='sm' onClick={replaceEveryColor} disabled={!parsed.svg || !findColor} sx={{ ...compactButtonSx, mt: 1.2 }}>Replace all</Button>
        </Sheet>

        <Sheet sx={{ p: 2, border: `1px solid ${colors.borderLight}`, borderRadius: '10px', background: colors.surfaceDark, gridColumn: { md: '1 / -1', xl: 'auto' } }}>
          <Typography sx={{ fontFamily: fonts.mono, color: colors.text, fontSize: 12.5, fontWeight: 700 }}>Export</Typography>
          <Typography sx={{ mt: .75, color: colors.textMuted, fontSize: 11.5, lineHeight: 1.55 }}>SVG จะคงความคมชัดทุกขนาด ส่วน PNG เลือกความละเอียดได้สูงสุด 4×</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .65, mt: 1.25 }}>
            {[1, 2, 3, 4].map((scale) => <Button key={scale} size='sm' variant={pngScale === scale ? 'solid' : 'outlined'} onClick={() => setPngScale(scale)} sx={{ ...compactButtonSx, minWidth: 43 }}>{scale}×</Button>)}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: .75, mt: 1.25 }}>
            <Button size='sm' startDecorator={<ImageRoundedIcon />} onClick={exportPng} disabled={!parsed.svg} sx={compactButtonSx}>Download PNG</Button>
            <Button size='sm' variant='plain' startDecorator={<ContentCopyRoundedIcon />} onClick={() => void copy(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(parsed.svg)}`, 'คัดลอก Data URI แล้ว')} disabled={!parsed.svg} sx={compactButtonSx}>Data URI</Button>
          </Box>
        </Sheet>
      </Box>

      <Divider sx={{ my: 2.25, borderColor: colors.borderLight }} />
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Chip size='sm' variant='outlined' sx={{ fontFamily: fonts.mono, fontSize: 10.5 }}>LOCAL ONLY</Chip>
        <Typography sx={{ color: colors.textDim, fontSize: 11.5, lineHeight: 1.6 }}>ไฟล์ไม่ถูกอัปโหลดออกจากอุปกรณ์ · ตัวอย่างจะตัด script, event handler และลิงก์ภายนอกออกเพื่อความปลอดภัย</Typography>
      </Box>
    </Sheet>
  );
};

/**
 * Centralized theme configuration.
 * Change colors / fonts here to update the entire app in one place.
 */

// ── Colors ──────────────────────────────────────────────
export const colors = {
  /** Primary green — buttons, links, active states */
  accent: '#0f6f42',
  /** Deeper green — icons, brand elements */
  accentDeep: '#0b5d37',
  /** Softer green — alternate card accents */
  secondary: '#356f50',

  /** Main text color */
  text: '#14291f',
  /** Body / paragraph text */
  textBody: '#2b4436',
  /** Muted text */
  textMuted: '#465e51',
  /** Even more muted text */
  textDim: '#566b60',

  /** Dark surface / background base */
  surface: 'rgba(255, 255, 255, 0.985)',
  surfaceSolid: '#ffffff',
  surfaceDark: '#f5f8f6',
  surfaceDarkest: '#edf3ef',
  /** Card / panel background */
  surfaceCard: 'rgba(255, 255, 255, 0.97)',

  /** Borders */
  border: '#c5d6ca',
  borderLight: '#dce7df',
  borderMedium: '#b8cec0',
  borderHover: '#7ba88c',
  borderSubtle: '#e7eee9',

  /** Star particle colors (for SpaceBackground) */
  starWhite: 'rgba(255, 255, 255, 0.7)',
  starPurple: 'rgba(86, 153, 111, 0.22)',
  starDeepPurple: 'rgba(22, 121, 74, 0.18)',
};

// ── Fonts ───────────────────────────────────────────────
export const fonts = {
  mono: '"Fira Code", "Noto Sans Thai", "IBM Plex Mono", monospace',
  display: '"Inter", "Noto Sans Thai", var(--joy-fontFamily-fallback)',
  body: '"Inter", "Noto Sans Thai", var(--joy-fontFamily-fallback)',
};

// ── Derived helpers ─────────────────────────────────────
/** Accent color with custom opacity — e.g. accentAlpha(0.3) */
export const accentAlpha = (opacity: number) => `rgba(15, 111, 66, ${opacity})`;

/** Deep accent with custom opacity */
export const accentDeepAlpha = (opacity: number) => `rgba(11, 93, 55, ${opacity})`;

// ── Gradients ───────────────────────────────────────────
export const gradients = {
  /** Full-page body background */
  body: `linear-gradient(180deg, #ffffff 0%, ${colors.surfaceDark} 62%, ${colors.surfaceDarkest} 100%)`,
  /** Card surface */
  surface: 'linear-gradient(145deg, #ffffff, #f7faf8)',
  /** Divider / decorative line */
  line: `linear-gradient(90deg, ${accentAlpha(0.2)}, transparent)`,
  /** Vertical decorative line */
  lineVertical: `linear-gradient(180deg, ${accentAlpha(0.3)}, transparent)`,
};

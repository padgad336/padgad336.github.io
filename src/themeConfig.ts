/**
 * Centralized theme configuration.
 * Change colors / fonts here to update the entire app in one place.
 */

// ── Colors ──────────────────────────────────────────────
export const colors = {
  /** Primary accent (purple) — buttons, links, active states */
  accent: '#c4a0ff',
  /** Deeper accent — icons, brand elements */
  accentDeep: '#9a7bff',
  /** Secondary accent (teal) — used for alternate card accents */
  secondary: '#7be0c8',

  /** Main text color */
  text: '#e8e6f0',
  /** Body / paragraph text */
  textBody: '#d0cfe0',
  /** Muted text */
  textMuted: 'rgba(200, 200, 220, 0.55)',
  /** Even more muted text */
  textDim: 'rgba(200, 200, 220, 0.4)',

  /** Dark surface / background base */
  surface: 'rgba(17, 17, 27, 0.92)',
  surfaceSolid: '#11111b',
  surfaceDark: '#0d0d15',
  surfaceDarkest: '#0a0a12',
  /** Card / panel background */
  surfaceCard: 'rgba(17, 17, 27, 0.6)',

  /** Borders */
  border: `rgba(196, 160, 255, 0.12)`,
  borderLight: `rgba(196, 160, 255, 0.08)`,
  borderMedium: `rgba(196, 160, 255, 0.15)`,
  borderHover: `rgba(196, 160, 255, 0.25)`,
  borderSubtle: 'rgba(200, 200, 220, 0.06)',

  /** Star particle colors (for SpaceBackground) */
  starWhite: 'rgba(255, 255, 255, 0.5)',
  starPurple: 'rgba(196, 160, 255, 0.5)',
  starDeepPurple: 'rgba(160, 140, 255, 0.6)',
};

// ── Fonts ───────────────────────────────────────────────
export const fonts = {
  mono: '"Fira Code", "IBM Plex Mono", monospace',
  display: '"Inter", var(--joy-fontFamily-fallback)',
  body: '"Inter", var(--joy-fontFamily-fallback)',
};

// ── Derived helpers ─────────────────────────────────────
/** Accent color with custom opacity — e.g. accentAlpha(0.3) */
export const accentAlpha = (opacity: number) => `rgba(196, 160, 255, ${opacity})`;

/** Deep accent with custom opacity */
export const accentDeepAlpha = (opacity: number) => `rgba(154, 123, 255, ${opacity})`;

// ── Gradients ───────────────────────────────────────────
export const gradients = {
  /** Full-page body background */
  body: `linear-gradient(180deg, ${colors.surfaceSolid} 0%, ${colors.surfaceDark} 50%, ${colors.surfaceDarkest} 100%)`,
  /** Card surface */
  surface: `linear-gradient(145deg, rgba(30, 28, 45, 0.3), rgba(17, 17, 27, 0.5))`,
  /** Divider / decorative line */
  line: `linear-gradient(90deg, ${accentAlpha(0.2)}, transparent)`,
  /** Vertical decorative line */
  lineVertical: `linear-gradient(180deg, ${accentAlpha(0.3)}, transparent)`,
};

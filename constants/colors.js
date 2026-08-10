// ============================================================
// constants/colors.js — Sunkist Orange Soda theme
// Warm, energetic, youthful. Citrus gradient + cream canvas.
// ============================================================

// Sunkist orange soda palette
export const SUNKIST = {
  orange:       '#FF6300',
  orangeLight:  '#FF8C1A',
  amber:        '#FFB627',
  amberLight:   '#FFD060',
  cream:        '#FFF8F0',
  creamDark:    '#FFF0E0',
  deepOrange:   '#E85D04',
  burntOrange:  '#D4501C',
  white:        '#FFFFFF',
  textDark:     '#1A1A1A',
  textMid:      '#6B5B50',
  textLight:    '#9E8E83',
  positive:     '#2ECC71',
  negative:     '#E74C3C',
  border:       '#FFE4D1',
  shadowOrange: 'rgba(255,99,0,0.12)',
};

export const BRAND_COLORS = {
  primary:       SUNKIST.orange,
  primaryDark:   SUNKIST.deepOrange,
  primaryLight:  SUNKIST.orangeLight,
  primaryUltraLight: SUNKIST.amberLight,

  accent:        SUNKIST.orange,
  accentDark:    SUNKIST.deepOrange,

  // Card tiers
  tierSimple:    SUNKIST.orange,
  tierSignature: SUNKIST.burntOrange,
  tierBlack:     '#1A1A1A',
  tierBlackAccent: '#C9A84C',

  // Status
  success: SUNKIST.positive,
  warning: SUNKIST.amber,
  error:   SUNKIST.negative,
  info:    SUNKIST.orange,

  // Backgrounds
  background:     SUNKIST.cream,
  backgroundAlt:  SUNKIST.creamDark,
  backgroundCard: SUNKIST.white,

  // Text
  textPrimary:   SUNKIST.textDark,
  textSecondary: SUNKIST.textMid,
  textTertiary:  SUNKIST.textLight,
  textInverse:   SUNKIST.white,

  // Borders
  border:     SUNKIST.border,
  borderDark: '#FFCDAB',

  // Shadows
  shadowColor: SUNKIST.shadowOrange,

  // Specific UI
  inputBg: SUNKIST.white,
  inputBorder: SUNKIST.border,
  inputBorderFocus: SUNKIST.orange,
  divider: SUNKIST.border,
  tabBarBg: SUNKIST.white,
  headerBg: SUNKIST.orange,
  headerText: SUNKIST.white,
  positive: SUNKIST.positive,
  negative: SUNKIST.negative,
  neutral: SUNKIST.textMid,
  gold: '#C9A84C',
};

export const Colors = {
  // Sunkist orange — primary brand
  primary:        SUNKIST.orange,
  primaryDark:    SUNKIST.deepOrange,
  primaryLight:   SUNKIST.orangeLight,
  primaryGradient: [SUNKIST.orange, SUNKIST.amber, SUNKIST.deepOrange],

  // Accent
  accent:         SUNKIST.orange,
  accentGradient: [SUNKIST.orange, SUNKIST.deepOrange],

  // Backgrounds
  background:     SUNKIST.cream,
  backgroundDark: SUNKIST.creamDark,
  surface:        SUNKIST.white,
  surfaceDark:    SUNKIST.creamDark,

  // Text
  text:       SUNKIST.textDark,
  textLight:  SUNKIST.textMid,
  textMuted:  SUNKIST.textLight,
  textWhite:  SUNKIST.white,

  // Borders
  border:      SUNKIST.border,
  borderLight: SUNKIST.cream,

  // Status
  success:     SUNKIST.positive,
  successLight: '#E8F8ED',
  warning:     SUNKIST.amber,
  error:       SUNKIST.negative,
  info:        SUNKIST.orange,

  // Cards
  cardSimple:    SUNKIST.orange,
  cardSignature: SUNKIST.burntOrange,
  cardBlack:     '#1A1A1A',
  cardBlackGold: '#D4AF37',

  // Tab bar
  tabActive:   SUNKIST.orange,
  tabInactive: SUNKIST.textLight,
  tabBarBg:    SUNKIST.white,

  // Misc
  checkboxActive: SUNKIST.orange,
  linkBlue:       SUNKIST.orange,
  remove:         SUNKIST.negative,
  verified:       SUNKIST.positive,

  // Agentic — now orange (was purple)
  agenticPurple:      SUNKIST.orange,
  agenticPurpleDark:  SUNKIST.deepOrange,
  agenticPurpleLight: SUNKIST.amber,

  // Sunkist extras
  sunkist: SUNKIST,
};

export default BRAND_COLORS;

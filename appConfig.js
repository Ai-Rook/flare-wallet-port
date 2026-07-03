// ============================================================
// appConfig.js — CoinPayments Branding Configuration
// All brand/tier names driven from here. Rebrand to
// CoinPayments is a one-file change (swap logo + names).
// ============================================================

export const BRAND = 'CoinPayments';
export const TAGLINE = 'CoinPayments now. Live later.';

// CoinPayments logo path (swap this when rebrand is ready)
export const LOGO_PATH = null; // null = use text logo fallback

// API base URL — CoinPayments API running on VPS
export const API_BASE_URL = 'http://149.28.37.72:4000';

// Card tiers (brand names, Tokens/USDC hold amounts, limits)
export const CARD_TIERS = [
  {
    id: 'simple',
    name: 'Simple',
    brandName: 'CoinPayments Simple',
    color: '#1255D1',
    dailyLimit: 500,
    monthlyFee: 0,
    spndHold: 0,
    features: [
      'Virtual card',
      'Contactless payments',
      'USD & CAD wallets',
      'Crypto purchase',
      'ACH deposits',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    brandName: 'CoinPayments Signature',
    color: '#5B6771',
    dailyLimit: 2500,
    monthlyFee: 4.95,
    spndHold: 500,
    features: [
      'Physical + virtual card',
      'Contactless + chip',
      'All Simple features',
      'Higher purchase limits',
      'Priority support',
    ],
  },
  {
    id: 'black',
    name: 'Black',
    brandName: 'CoinPayments Black',
    color: '#1A1A1A',
    dailyLimit: 10000,
    monthlyFee: 14.95,
    spndHold: 1500,
    features: [
      'Premium physical card',
      'All Signature features',
      'ATM access',
      'Max purchase limits',
      '24/7 concierge support',
      'Metal card',
    ],
  },
];

// Bottom tab icons and labels
export const TABS = [
  { name: 'Home', label: 'Home', icon: 'home' },
  { name: 'Markets', label: 'Markets', icon: 'chart-line' },
  { name: 'Cards', label: 'Card', icon: 'credit-card' },
  { name: 'Bank', label: 'Bank', icon: 'bank' },
  { name: 'Profile', label: 'Profile', icon: 'account' },
];
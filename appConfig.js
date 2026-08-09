// ============================================================
// appConfig.js — Flare Wallet Configuration
// All brand/tier names driven from here. Rebrand to
// Rebranding is a one-file change (swap logo + names).
// ============================================================

export const BRAND = 'Flare';
export const TAGLINE = 'Interoperable assets. Decentralized prices.';

// Flare logo path (swap this when rebrand is ready)
export const LOGO_PATH = null; // null = use text logo fallback

// API base URL — previous centralized API (preserved, commented out)
// export const API_BASE_URL = 'http://149.28.37.72:4000';

// Flare network configuration
export const FLARE_RPC = 'https://coston2-api.flare.network/ext/C/rpc';
export const FLARE_CHAIN_ID = 114;
export const FLARE_NATIVE_TOKEN = 'C2FLR';
export const FLARE_EXPLORER = 'https://coston2-explorer.flare.network';
export const FLARE_MAINNET_RPC = 'https://flare-api.flare.network/ext/C/rpc';
export const FLARE_MAINNET_CHAIN_ID = 14;

// Card tiers (brand names, Tokens/USDC hold amounts, limits)
export const CARD_TIERS = [
  {
    id: 'simple',
    name: 'Simple',
    brandName: 'Flare Simple',
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
    brandName: 'Flare Signature',
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
    brandName: 'Flare Black',
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
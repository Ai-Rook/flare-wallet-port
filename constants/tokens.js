// ============================================================
// constants/tokens.js — Token list with icon paths and metadata
// ============================================================

export const TOKENS = [
  // Flare native + FAssets (interoperable)
  { id: 'flare', symbol: 'FLR', name: 'Flare', type: 'crypto', color: '#FFD700', icon: '◉', decimals: 18, flareNative: true },
  { id: 'fxrp', symbol: 'FXRP', name: 'Flare XRP', type: 'crypto', color: '#23292F', icon: '✕', decimals: 6, flareNative: true, fAsset: true, underlying: 'XRP' },
  { id: 'fbtc', symbol: 'FBTC', name: 'Flare Bitcoin', type: 'crypto', color: '#F7931A', icon: '₿', decimals: 8, flareNative: true, fAsset: true, underlying: 'BTC' },
  { id: 'fdoge', symbol: 'FDOGE', name: 'Flare Doge', type: 'crypto', color: '#C2A633', icon: 'Ð', decimals: 8, flareNative: true, fAsset: true, underlying: 'DOGE' },

  // Crypto (original)
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', type: 'crypto', color: '#F7931A', icon: '₿', decimals: 8 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', type: 'crypto', color: '#627EEA', icon: 'Ξ', decimals: 18 },
  { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', type: 'crypto', color: '#2775CA', icon: 'U$', decimals: 6 },
  { id: 'tether', symbol: 'USDT', name: 'Tether', type: 'crypto', color: '#26A17B', icon: '₮', decimals: 6 },
  { id: 'litecoin', symbol: 'LTC', name: 'Litecoin', type: 'crypto', color: '#BFBBBB', icon: 'Ł', decimals: 8 },
  { id: 'bitcoin-cash', symbol: 'BCH', name: 'Bitcoin Cash', type: 'crypto', color: '#8DC351', icon: 'BCH', decimals: 8 },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', type: 'crypto', color: '#0033AD', icon: '₳', decimals: 6 },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', type: 'crypto', color: '#E6007A', icon: '●', decimals: 10 },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', type: 'crypto', color: '#375BD2', icon: '⬡', decimals: 18 },
  { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', type: 'crypto', color: '#FF007A', icon: '🦄', decimals: 18 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', type: 'crypto', color: '#00FFA3', icon: '◎', decimals: 9 },
  { id: 'ripple', symbol: 'XRP', name: 'XRP', type: 'crypto', color: '#23292F', icon: '✕', decimals: 6 },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', type: 'crypto', color: '#C2A633', icon: 'Ð', decimals: 8 },
  { id: 'shiba-inu', symbol: 'SHIB', name: 'Shiba Inu', type: 'crypto', color: '#FF6D2C', icon: '🐕', decimals: 18 },
  { id: 'avalanche', symbol: 'AVAX', name: 'Avalanche', type: 'crypto', color: '#E84142', icon: '▲', decimals: 18 },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon', type: 'crypto', color: '#8247E5', icon: '⬡', decimals: 18 },
  { id: 'cosmos', symbol: 'ATOM', name: 'Cosmos', type: 'crypto', color: '#2E3148', icon: '⚛', decimals: 6 },
  { id: 'stellar', symbol: 'XLM', name: 'Stellar', type: 'crypto', color: '#14B6E7', icon: '✦', decimals: 7 },

  // Fiat
  { id: 'usd', symbol: 'USD', name: 'US Dollar', type: 'fiat', color: '#1A1A1A', icon: '$', decimals: 2 },
  { id: 'cad', symbol: 'CAD', name: 'Canadian Dollar', type: 'fiat', color: '#E63946', icon: 'C$', decimals: 2 },
  { id: 'eur', symbol: 'EUR', name: 'Euro', type: 'fiat', color: '#003399', icon: '€', decimals: 2 },
  { id: 'gbp', symbol: 'GBP', name: 'British Pound', type: 'fiat', color: '#00247D', icon: '£', decimals: 2 },
  { id: 'aud', symbol: 'AUD', name: 'Australian Dollar', type: 'fiat', color: '#00008B', icon: 'A$', decimals: 2 },
];

export const TOKEN_ICONS = {};
TOKENS.forEach(t => { TOKEN_ICONS[t.id] = t.icon; });

export function getTokenById(id) {
  return TOKENS.find(t => t.id === id) || null;
}

export function getTokenBySymbol(symbol) {
  return TOKENS.find(t => t.symbol.toLowerCase() === symbol.toLowerCase()) || null;
}

export function getFiatByCode(code) {
  return TOKENS.find(t => t.type === 'fiat' && t.symbol === code) || null;
}

// Card tiers — Flare Simple/Signature/Black
export const CARD_TIERS = [
  {
    id: 'simple',
    name: 'Flare Simple™',
    color: '#1255D1',
    dailyLimit: 500,
    fee: 25,
    hold: '0 USDC',
    rewards: 0.002,
    features: ['Daily limit $500', '$25 membership', 'Virtual card', 'No minimum hold'],
  },
  {
    id: 'signature',
    name: 'Flare Signature™',
    color: '#5B6771',
    dailyLimit: 10000,
    fee: 50,
    hold: '50,000 Tokens',
    rewards: 0.004,
    features: ['$10K daily limit', '$50 membership', 'Physical + Virtual', '50K Tokens hold'],
  },
  {
    id: 'black',
    name: 'Flare Black™',
    color: '#1A1A1A',
    dailyLimit: 100000,
    fee: 0,
    hold: '500,000 Tokens',
    rewards: 0.008,
    features: ['$100K daily limit', 'No membership fee', 'Premium physical card', '500K Tokens hold', 'Gold accents'],
  },
];

// Fiat currencies with flags (for wallet display)
export const FIAT_CURRENCIES = [
  { code: 'USD', name: 'United States Dollar', flag: '🇺🇸', active: true },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', active: false },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', active: false },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', active: false },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', active: false },
];

export default TOKENS;

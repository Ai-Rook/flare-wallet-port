// ============================================================
// constants/holdings.js — SINGLE SOURCE OF TRUTH for wallet balances
// Both HomeScreen and WalletScreen import from here.
// Amounts are demo data for hackathon. Prices come from FTSO/fallback.
// ============================================================

export const CRYPTO_HOLDINGS = [
  { symbol: 'FBTC', name: 'Flare Bitcoin',  amount: 0.1410,   underlying: 'BTC',  color: '#F7931A', decimals: 8 },
  { symbol: 'FETH', name: 'Flare Ethereum', amount: 1.205,    underlying: 'ETH',  color: '#627EEA', decimals: 18 },
  { symbol: 'FXRP', name: 'Flare XRP',     amount: 1840.00,  underlying: 'XRP',  color: '#23292F', decimals: 6 },
  { symbol: 'FDOGE', name: 'Flare Doge',    amount: 8500.00,  underlying: 'DOGE', color: '#C2A633', decimals: 8 },
  { symbol: 'FLR',  name: 'Flare',          amount: 1250.00,  underlying: null,   color: '#FFD700', decimals: 18 },
  { symbol: 'USDC', name: 'USD Coin',       amount: 5000.00,  underlying: null,   color: '#2775CA', decimals: 6 },
];

export const FIAT_HOLDINGS = [
  { code: 'USD', name: 'US Dollar',        flag: '🇺🇸', amount: 5000.00,  rate: 1.0 },
  { code: 'EUR', name: 'Euro',              flag: '🇪🇺', amount: 1200.00,  rate: 0.92 },
  { code: 'GBP', name: 'British Pound',    flag: '🇧🇧', amount: 850.00,   rate: 0.79 },
  { code: 'CAD', name: 'Canadian Dollar',  flag: '🇨🇦', amount: 3100.00,  rate: 1.37 },
];

// Fallback prices (realistic demo values) — used when FTSO RPC fails in browser
export const FALLBACK_PRICES = {
  BTC:   { price: 64990.00, change24h: 2.34 },
  ETH:   { price: 1918.00,  change24h: 1.87 },
  XRP:   { price: 1.03,     change24h: -0.42 },
  DOGE:  { price: 0.070,    change24h: 3.15 },
  FLR:   { price: 0.0061,   change24h: 0.82 },
  LTC:   { price: 45.38,    change24h: -1.23 },
  SOL:   { price: 76.70,   change24h: 4.56 },
  ADA:   { price: 0.197,   change24h: -0.87 },
  USDC:  { price: 1.0,      change24h: 0 },
  USDT:  { price: 1.0,      change24h: 0 },
};

// Helper: compute total portfolio value from holdings + prices
export function computePortfolioTotal(prices) {
  let total = 0;

  // Crypto holdings
  for (const h of CRYPTO_HOLDINGS) {
    const key = h.underlying || h.symbol;
    const p = prices[key];
    if (p && p.price) {
      total += h.amount * p.price;
    }
  }

  // Fiat holdings (convert to USD)
  for (const f of FIAT_HOLDINGS) {
    total += f.amount / f.rate;
  }

  return total;
}

// Helper: compute 24h change for the whole portfolio
export function computePortfolioChange(prices) {
  let totalValue = 0;
  let changeValue = 0;

  for (const h of CRYPTO_HOLDINGS) {
    const key = h.underlying || h.symbol;
    const p = prices[key];
    if (p && p.price) {
      const usdValue = h.amount * p.price;
      totalValue += usdValue;
      changeValue += usdValue * (p.change24h || 0) / 100;
    }
  }

  const changePercent = totalValue > 0 ? (changeValue / (totalValue - changeValue)) * 100 : 0;
  return {
    changeAmount: changeValue,
    changePercent: parseFloat(changePercent.toFixed(2)),
  };
}

// Helper: get individual asset USD value
export function getAssetUSDValue(holding, prices) {
  const key = holding.underlying || holding.symbol;
  const p = prices[key];
  if (p && p.price) {
    return holding.amount * p.price;
  }
  return 0;
}

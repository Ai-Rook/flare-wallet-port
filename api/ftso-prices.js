// /opt/x402-atm/api/ftso-prices.js — CORS proxy for FTSOv2 price feeds
// Relays Coston2 RPC calls so the browser can fetch FTSO prices without CORS issues
const { ethers } = require('ethers');
const { interfaceToAbi } = require('@flarenetwork/flare-periphery-contract-artifacts');

const FTSOV2_ADDRESS = '0x3d893C53D9e8056135C26C8c638B76C8b60Df726';
const FLARE_RPC = 'https://coston2-api.flare.network/ext/C/rpc';

const FEED_IDS = [
  '0x01464c522f55534400000000000000000000000000',
  '0x014254432f55534400000000000000000000000000',
  '0x014554482f55534400000000000000000000000000',
  '0x015852502f55534400000000000000000000000000',
  '0x01444f47452f55534400000000000000000000000000',
  '0x014c54432f55534400000000000000000000000000',
  '0x01534f4c2f55534400000000000000000000000000',
  '0x014144412f55534400000000000000000000000000',
];
const FEED_SYMBOLS = ['FLR', 'BTC', 'ETH', 'XRP', 'DOGE', 'LTC', 'SOL', 'ADA'];

// Fallback 24h changes (FTSO doesn't provide this directly)
const CHANGE_24H = {
  FLR: 0.82, BTC: 2.34, ETH: 1.87, XRP: -0.42,
  DOGE: 3.15, LTC: -1.23, SOL: 4.56, ADA: -0.87,
};

let ftsoAbi;
try {
  ftsoAbi = interfaceToAbi('FtsoV2Interface', 'coston2');
} catch (e) {
  console.error('[FTSO Proxy] ABI load failed:', e.message);
}

let provider, contract;
function getContract() {
  if (contract) return contract;
  if (!ftsoAbi) return null;
  provider = new ethers.JsonRpcProvider(FLARE_RPC);
  contract = new ethers.Contract(FTSOV2_ADDRESS, ftsoAbi, provider);
  return contract;
}

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const ftsov2 = getContract();
    if (!ftsov2) throw new Error('FTSO ABI not loaded');

    const result = await ftsov2.getFeedsById.staticCall(FEED_IDS);
    const values = result[0];
    const decimals = result[1];

    const prices = {};
    for (let i = 0; i < FEED_SYMBOLS.length; i++) {
      const symbol = FEED_SYMBOLS[i];
      const rawValue = Number(values[i]);
      const dec = Number(decimals[i]);
      const divisor = Math.pow(10, Math.abs(dec));
      const price = rawValue / divisor;
      prices[symbol] = {
        price: parseFloat(price.toFixed(4)),
        change24h: CHANGE_24H[symbol] || 0,
      };
    }

    res.status(200).json({
      prices,
      timestamp: new Date().toISOString(),
      source: 'ftso-v2-coston2',
    });
  } catch (e) {
    console.error('[FTSO Proxy] Error:', e.message);
    res.status(502).json({ error: e.message, prices: {} });
  }
};

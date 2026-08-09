/**
 * LivePriceService — fetches live crypto prices from Flare FTSOv2 oracle.
 * Replaces centralized price APIs with decentralized on-chain price feeds.
 *
 * FTSOv2: block-latency feeds, free to read, updates every ~1.8s.
 * Refreshes every 30 seconds for mobile efficiency.
 *
 * Usage:
 *   import { LivePriceProvider, useLivePrices } from '../../services/LivePriceService';
 *   // Wrap app in <LivePriceProvider>
 *   // In component: const { prices, lastUpdated, isLoading } = useLivePrices();
 *   // prices = { BTC: { price: 62450.00, change24h: 0 }, ... }
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import { interfaceToAbi } from '@flarenetwork/flare-periphery-contract-artifacts';

const LivePriceContext = createContext({
  prices: {},
  lastUpdated: null,
  isLoading: true,
  error: null,
  refresh: () => {},
});

// ── Flare FTSOv2 Configuration (Coston2 Testnet) ──────────────────────
const FTSOV2_ADDRESS = '0x3d893C53D9e8056135C26C8c638B76C8b60Df726';
const FLARE_RPC = 'https://coston2-api.flare.network/ext/C/rpc';

// Feed IDs (bytes21 hex) — FTSOv2 decentralized price feeds
const FEED_IDS = [
  '0x01464c522f55534400000000000000000000000000', // FLR/USD
  '0x014254432f55534400000000000000000000000000', // BTC/USD
  '0x014554482f55534400000000000000000000000000', // ETH/USD
  '0x015852502f55534400000000000000000000000000', // XRP/USD
  '0x01444f47452f55534400000000000000000000000000', // DOGE/USD
  '0x014c54432f55534400000000000000000000000000', // LTC/USD
  '0x01534f4c2f55534400000000000000000000000000', // SOL/USD
  '0x014144412f55534400000000000000000000000000', // ADA/USD
];

// Map feed index → token symbol
const FEED_SYMBOLS = ['FLR', 'BTC', 'ETH', 'XRP', 'DOGE', 'LTC', 'SOL', 'ADA'];

// ── ORIGINAL centralized API config (preserved, commented out) ──
// const CP_RATES_URL = '// centralized API (removed)
// const CG_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,solana,litecoin,binancecoin&vs_currencies=usd&include_24hr_change=true';
// const CG_PROXY_URL = 'http://149.28.37.72:3010/api/prices';
// const CG_ID_MAP = { BTC: 'bitcoin', ETH: 'ethereum', XRP: 'ripple', SOL: 'solana', LTC: 'litecoin', BNB: 'binancecoin', USDT: 'tether', ADA: 'cardano', DOGE: 'dogecoin', DOT: 'polkadot', AVAX: 'avalanche-2', MATIC: 'matic-network', LINK: 'chainlink', UNI: 'uniswap', ATOM: 'cosmos' };

const REFRESH_INTERVAL = 30000; // 30 seconds

// Load FTSOv2 ABI from Flare periphery contract artifacts
let ftsoAbi;
try {
  ftsoAbi = interfaceToAbi('FtsoV2Interface', 'coston2');
} catch (e) {
  console.warn('[FlarePriceService] Failed to load FTSOv2 ABI:', e.message);
  ftsoAbi = null;
}

export function LivePriceProvider({ children }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isFetching = useRef(false);
  const providerRef = useRef(null);
  const contractRef = useRef(null);
  const prevPricesRef = useRef({});

  // Initialize ethers provider + FTSOv2 contract
  const initContract = () => {
    if (contractRef.current) return contractRef.current;
    if (!ftsoAbi) return null;
    try {
      providerRef.current = new ethers.JsonRpcProvider(FLARE_RPC);
      contractRef.current = new ethers.Contract(FTSOV2_ADDRESS, ftsoAbi, providerRef.current);
      return contractRef.current;
    } catch (e) {
      console.error('[FlarePriceService] Contract init failed:', e.message);
      return null;
    }
  };

  const fetchPrices = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setError(null);

    const ftsov2 = initContract();
    if (!ftsov2) {
      setError('FTSOv2 contract not initialized');
      setIsLoading(false);
      isFetching.current = false;
      return;
    }

    try {
      // Call getFeedsById — returns [values[], decimals[], timestamp]
      const result = await ftsov2.getFeedsById.staticCall(FEED_IDS);
      const values = result[0];
      const decimals = result[1];
      const timestamp = result[2];

      const newPrices = {};
      const prevPrices = prevPricesRef.current;

      for (let i = 0; i < FEED_SYMBOLS.length; i++) {
        const symbol = FEED_SYMBOLS[i];
        const rawValue = Number(values[i]);
        const dec = Number(decimals[i]);

        // FTSOv2 returns values with negative decimals (e.g., -8)
        // So divide by 10^|decimals| to get the USD price
        const divisor = Math.pow(10, Math.abs(dec));
        const price = rawValue / divisor;

        // Calculate 24h change from stored previous price (approximation)
        const prevPrice = prevPrices[symbol]?.price || price;
        const change24h = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0;

        newPrices[symbol] = {
          price: parseFloat(price.toFixed(2)),
          change24h: parseFloat(change24h.toFixed(2)),
        };
      }

      // Add stablecoins at $1 (not on FTSO, but app needs them)
      newPrices.USDC = { price: 1.0, change24h: 0 };
      newPrices.USDT = { price: 1.0, change24h: 0 };

      // Store for next diff
      prevPricesRef.current = newPrices;
      setPrices(newPrices);
      setLastUpdated(new Date());
      setIsLoading(false);
      console.log('[FlarePriceService] Prices updated from FTSOv2 at', new Date().toISOString());
    } catch (e) {
      console.error('[FlarePriceService] FTSOv2 fetch failed:', e.message);
      setError('Could not fetch prices from Flare FTSOv2');
      setIsLoading(false);
    }

    isFetching.current = false;
  };

  useEffect(() => {
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <LivePriceContext.Provider value={{ prices, lastUpdated, isLoading, error, refresh: fetchPrices }}>
      {children}
    </LivePriceContext.Provider>
  );
}

export function useLivePrices() {
  return useContext(LivePriceContext);
}

export default LivePriceProvider;

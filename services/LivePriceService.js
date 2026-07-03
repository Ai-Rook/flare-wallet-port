/**
 * LivePriceService — fetches live crypto prices from CoinPayments API.
 * Public rates endpoint: https://www.coinpayments.net/api/v2/rates
 * Refreshes every 60 seconds.
 * 
 * Usage:
 *   import { LivePriceProvider, useLivePrices } from '../../services/LivePriceService';
 *   // Wrap app in <LivePriceProvider>
 *   // In component: const { prices, lastUpdated, isLoading } = useLivePrices();
 *   // prices = { BTC: { price: 62450.00, change24h: 2.48 }, ... }
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const LivePriceContext = createContext({
  prices: {},
  lastUpdated: null,
  isLoading: true,
  error: null,
  refresh: () => {},
});

// CoinPayments public rates endpoint (no auth needed for basic rates)
const CP_RATES_URL = 'https://www.coinpayments.net/api/v2/rates?accepted=1&format=json';

// Use a CORS-friendly approach — try direct, then proxy through VPS if blocked
const CG_RATES_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,solana,litecoin,binancecoin&vs_currencies=usd&include_24hr_change=true';
const CG_PROXY_URL = 'http://149.28.37.72:3010/api/prices'; // VPS proxy fallback

// Symbol → CoinGecko ID mapping (for fallback)
const CG_ID_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  XRP: 'ripple',
  SOL: 'solana',
  LTC: 'litecoin',
  BNB: 'binancecoin',
  USDT: 'tether',
  ADA: 'cardano',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  AVAX: 'avalanche-2',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  UNI: 'uniswap',
  ATOM: 'cosmos',
};

// Symbol mapping for CoinPayments rate keys
const CP_SYMBOL_MAP = {
  BTC: 'BTC',
  ETH: 'ETH',
  XRP: 'XRP',
  SOL: 'SOL',
  LTC: 'LTC',
  BNB: 'BNB',
  USDT: 'USDT',
  ADA: 'ADA',
  DOGE: 'DOGE',
  DOT: 'DOT',
  AVAX: 'AVAX',
  MATIC: 'MATIC',
  LINK: 'LINK',
  UNI: 'UNI',
  ATOM: 'ATOM',
};

const REFRESH_INTERVAL = 3600000; // 1 hour

export function LivePriceProvider({ children }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const isFetching = useRef(false);

  const fetchPrices = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setError(null);

    try {
      // Try CoinGecko directly first
      const response = await fetch(CG_RATES_URL, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'CoinPayments-RainApp/1.0' },
      });

      if (!response.ok) throw new Error(`CG returned ${response.status}`);
      const data = await response.json();
      const newPrices = {};
      Object.entries(CG_ID_MAP).forEach(([symbol, cgId]) => {
        if (data[cgId]) {
          newPrices[symbol] = {
            price: data[cgId].usd || 0,
            change24h: data[cgId].usd_24h_change || 0,
          };
        }
      });
      setPrices(newPrices);
      setLastUpdated(new Date());
      setIsLoading(false);
      isFetching.current = false;
      return;
    } catch (e) {
      console.log('CoinGecko direct failed:', e.message);
    }

    try {
      // Try VPS proxy
      const response = await fetch(CG_PROXY_URL);
      if (!response.ok) throw new Error(`Proxy returned ${response.status}`);
      const data = await response.json();
      const newPrices = {};
      Object.entries(CG_ID_MAP).forEach(([symbol, cgId]) => {
        if (data[cgId]) {
          newPrices[symbol] = {
            price: data[cgId].usd || 0,
            change24h: data[cgId].usd_24h_change || 0,
          };
        }
      });
      setPrices(newPrices);
      setLastUpdated(new Date());
      setIsLoading(false);
      isFetching.current = false;
      return;
    } catch (e) {
      console.log('Proxy fetch failed:', e.message);
    }

    try {
      // Fallback: CoinPayments API
      const response = await fetch(CP_RATES_URL, {
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error === 'ok' && data.result) {
          const newPrices = {};
          Object.entries(CP_SYMBOL_MAP).forEach(([symbol, cpKey]) => {
            const rate = data.result[cpKey];
            if (rate && rate.rate_btc) {
              // Convert from BTC to USD (if we have BTC price)
              const btcUsd = data.result.BTC?.rate_usd || 62000;
              newPrices[symbol] = {
                price: symbol === 'BTC' ? btcUsd : parseFloat(rate.rate_btc) * btcUsd,
                change24h: 0, // CP doesn't include 24h change in basic rates
              };
            }
          });
          setPrices(newPrices);
          setLastUpdated(new Date());
          setIsLoading(false);
          isFetching.current = false;
          return;
        }
      }
    } catch (e) {
      console.log('CoinPayments fetch failed:', e.message);
    }

    setError('Could not fetch prices');
    setIsLoading(false);
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

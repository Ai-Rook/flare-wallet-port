/**
 * LivePriceService — fetches live crypto prices from Flare FTSOv2 oracle.
 * Falls back to demo prices if RPC fails (browser CORS, network issues).
 * For hackathon demo, fallback prices are realistic and reconcile perfectly.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { FALLBACK_PRICES } from '../constants/holdings';

const LivePriceContext = createContext({
  prices: {},
  lastUpdated: null,
  isLoading: true,
  error: null,
  source: 'loading',
  refresh: () => {},
});

const REFRESH_INTERVAL = 30000;

export function LivePriceProvider({ children }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');

  const fetchPrices = async () => {
    // Try VPS proxy first (CORS-safe relay to Coston2 FTSOv2)
    try {
      const res = await fetch('http://149.28.37.72:3052/api/ftso-prices', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prices && Object.keys(data.prices).length > 0) {
          const newPrices = { ...data.prices };
          newPrices.USDC = { price: 1.0, change24h: 0 };
          newPrices.USDT = { price: 1.0, change24h: 0 };
          setPrices(newPrices);
          setLastUpdated(new Date());
          setIsLoading(false);
          setSource('ftso-live');
          return;
        }
      }
    } catch (e) {
      // Proxy not available, fall through
    }

    // Fallback to static demo prices (realistic, reconcile perfectly)
    const fallback = { ...FALLBACK_PRICES };
    setPrices(fallback);
    setLastUpdated(new Date());
    setIsLoading(false);
    setSource('demo');
    setError(null);
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <LivePriceContext.Provider value={{ prices, lastUpdated, isLoading, error, source, refresh: fetchPrices }}>
      {children}
    </LivePriceContext.Provider>
  );
}

export function useLivePrices() {
  return useContext(LivePriceContext);
}

export default LivePriceProvider;

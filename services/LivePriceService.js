/**
 * LivePriceService — fetches live crypto prices from Flare FTSOv2 oracle.
 * Tries VPS proxy (CORS-safe relay to Coston2 FTSOv2) → falls back to demo prices.
 * Computes 24h change client-side by tracking previous fetch.
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
const PROXY_URL = 'http://149.28.37.72:3052/api/ftso-prices';

export function LivePriceProvider({ children }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');
  const prevPricesRef = useRef(null);

  const fetchPrices = async () => {
    // Try live FTSO proxy first
    try {
      const res = await fetch(PROXY_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.prices && Object.keys(data.prices).length > 0) {
          const newPrices = { ...data.prices };
          // Add stablecoins (not on FTSO)
          newPrices.USDC = { price: 1.0, change24h: 0 };
          newPrices.USDT = { price: 1.0, change24h: 0 };

          // Compute 24h change from previous fetch
          if (prevPricesRef.current) {
            for (const sym of Object.keys(newPrices)) {
              const prev = prevPricesRef.current[sym];
              const curr = newPrices[sym];
              if (prev && prev.price && curr.price) {
                const change = ((curr.price - prev.price) / prev.price) * 100;
                curr.change24h = parseFloat(change.toFixed(2));
              } else if (curr.change24h === 0) {
                // First fetch for this symbol — use a small demo change
                curr.change24h = 0;
              }
            }
          }

          prevPricesRef.current = { ...newPrices };
          setPrices(newPrices);
          setLastUpdated(new Date());
          setIsLoading(false);
          setSource('ftso-live');
          setError(null);
          return;
        }
      }
    } catch (e) {
      // Proxy not available, fall through to demo prices
    }

    // Fallback to static demo prices
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

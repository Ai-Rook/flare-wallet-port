/**
 * LivePriceService — fetches live crypto prices from Flare FTSOv2 oracle.
 * Also provides on-chain balances, block scanner, and transaction history.
 * Tries VPS proxy (CORS-safe relay to Coston2) → falls back to demo data.
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
const BALANCE_URL = 'http://149.28.37.72:3052/api/balance';
const SCANNER_URL = 'http://149.28.37.72:3052/api/blockscanner';
const TXS_URL = 'http://149.28.37.72:3052/api/txs';

export function LivePriceProvider({ children }) {
  const [prices, setPrices] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('loading');
  const prevPricesRef = useRef(null);

  const fetchPrices = async () => {
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
          newPrices.USDC = { price: 1.0, change24h: 0 };
          newPrices.USDT = { price: 1.0, change24h: 0 };
          if (prevPricesRef.current) {
            for (const sym of Object.keys(newPrices)) {
              const prev = prevPricesRef.current[sym];
              const curr = newPrices[sym];
              if (prev && prev.price && curr.price) {
                const change = ((curr.price - prev.price) / prev.price) * 100;
                curr.change24h = parseFloat(change.toFixed(2));
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
    } catch (e) {}
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

// ── On-chain balance hook ─────────────────────────────
export function useOnChainBalance(address) {
  const [balances, setBalances] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async (addr) => {
    if (!addr) return;
    setLoading(true);
    try {
      const res = await fetch(`${BALANCE_URL}/${addr}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        setBalances(data.balances);
        setError(null);
      } else {
        setError('Failed to fetch balance');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (address) fetchBalance(address);
  }, [address]);

  return { balances, loading, error, refresh: () => fetchBalance(address) };
}

// ── Block scanner hook ────────────────────────────────
export function useBlockScanner() {
  const [blockData, setBlockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScanner = async () => {
    try {
      const res = await fetch(SCANNER_URL, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        setBlockData(data);
        setError(null);
      } else {
        setError('Failed to fetch block data');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchScanner();
    const interval = setInterval(fetchScanner, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return { blockData, loading, error, refresh: fetchScanner };
}

// ── Transaction history hook ──────────────────────────
export function useTransactionHistory(address) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTxs = async (addr) => {
    if (!addr) return;
    setLoading(true);
    try {
      const res = await fetch(`${TXS_URL}/${addr}`, {
        signal: AbortSignal.timeout(10000),
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setError(null);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (address) fetchTxs(address);
  }, [address]);

  return { transactions, loading, error, refresh: () => fetchTxs(address) };
}

export default LivePriceProvider;

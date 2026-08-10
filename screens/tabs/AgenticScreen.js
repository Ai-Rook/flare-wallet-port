import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
  StatusBar, ActivityIndicator, RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FLARE_RPC, FLARE_CHAIN_ID, FLARE_EXPLORER } from '../../appConfig';

// FTSOv2 contract on Coston2
const FTSOV2_ADDRESS = '0x3d893C53D9e8056135C26C8c638B76C8b60Df726';
const FTSO_FEEDS = [
  { symbol: 'FLR/USD', id: '0x01464c522f55534400000000000000000000000000', color: '#FFD700' },
  { symbol: 'BTC/USD', id: '0x014254432f55534400000000000000000000000000', color: '#F7931A' },
  { symbol: 'ETH/USD', id: '0x014554482f55534400000000000000000000000000', color: '#627EEA' },
  { symbol: 'XRP/USD', id: '0x015852502f55534400000000000000000000000000', color: '#23292F' },
  { symbol: 'DOGE/USD', id: '0x01444f47452f55534400000000000000000000000000', color: '#C2A633' },
];

// x402 endpoints on Flare
const X402_ENDPOINTS = [
  { name: 'Legal Research', url: '/api/legal-research', price: '$0.05', desc: 'Onchain provenance for legal research — CourtListener, Federal Register, Cornell LII', icon: '⚖️' },
  { name: 'Market Pulse', url: '/api/market-pulse', price: '$0.05', desc: 'Real-time BTC/ETH market data from live trading engine', icon: '📊' },
  { name: 'AI Analysis', url: '/api/ai-analysis', price: '$0.10', desc: 'AI-powered market analysis and predictions', icon: '🤖' },
  { name: 'Order Flow', url: '/api/order-flow', price: '$0.25', desc: 'CVD, OI, whale flow, session levels from live engine', icon: '🌊' },
  { name: 'Trade Ideas', url: '/api/trade-idea', price: '$0.25', desc: 'Live trade setups from S10, S14, BOJAN strategies', icon: '💡' },
  { name: 'Kronos Score', url: '/api/kronos-score', price: '$0.10', desc: 'Candlestick pattern scoring via self-hosted model', icon: '🕯️' },
];

// FAssets available on Flare
const FASSETS = [
  { symbol: 'FXRP', name: 'Flare XRP', underlying: 'XRP', color: '#23292F', minted: '2,400', icon: '✕' },
  { symbol: 'FBTC', name: 'Flare Bitcoin', underlying: 'BTC', color: '#F7931A', minted: '0.141', icon: '₿' },
  { symbol: 'FDOGE', name: 'Flare Doge', underlying: 'DOGE', color: '#C2A633', minted: '8,500', icon: 'Ð' },
];

// Recent x402 settlements on Flare
const RECENT_SETTLEMENTS = [
  { endpoint: 'Legal Research', amount: '$0.05', time: '2m ago', txHash: '0x4e5910ec...', status: 'Settled' },
  { endpoint: 'Market Pulse', amount: '$0.05', time: '15m ago', txHash: '0xa3f2b8c1...', status: 'Settled' },
  { endpoint: 'AI Analysis', amount: '$0.10', time: '1h ago', txHash: '0x7d2e9f4a...', status: 'Settled' },
  { endpoint: 'Order Flow', amount: '$0.25', time: '3h ago', txHash: '0x1c8a3b7e...', status: 'Settled' },
];

export default function AgenticScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [ftsoPrices, setFtsoPrices] = useState({});
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Fetch live FTSO prices
  const fetchFtsoPrices = async () => {
    try {
      const feedIds = FTSO_FEEDS.map(f => f.id);
      const resp = await fetch('https://coston2-api.flare.network/ext/C/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_call',
          params: [{
            to: FTSOV2_ADDRESS,
            data: '0x7a6c2f35' + feedIds.map(id => id.slice(2)).join(''),
          }, 'latest'],
        }),
      });
      const data = await resp.json();
      if (data.result && data.result !== '0x') {
        // Parse the return data — getFeedsById returns uint256[], int8[], uint64
        const hex = data.result.slice(2);
        const prices = {};
        for (let i = 0; i < FTSO_FEEDS.length; i++) {
          const offset = i * 64;
          const value = BigInt('0x' + hex.slice(offset, offset + 64));
          prices[FTSO_FEEDS[i].symbol] = Number(value) / 1e8;
        }
        setFtsoPrices(prices);
      }
      setLoadingPrices(false);
    } catch (e) {
      setLoadingPrices(false);
    }
  };

  useEffect(() => { fetchFtsoPrices(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFtsoPrices();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader
        pageName="Agentic x402"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>◉</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF9F1C" />}
      >

        {/* FTSO Live Price Feeds */}
        <View style={styles.sectionHeader}>
          <View style={styles.ftsoBadge}>
            <Text style={styles.ftsoIcon}>⚡</Text>
          </View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>FTSOv2 Price Feeds</Text>
            <Text style={styles.sectionSub}>Decentralized oracle — updates every ~1.8s</Text>
          </View>
        </View>

        {loadingPrices ? (
          <View style={styles.loadingRow}><ActivityIndicator size="small" color="#FF9F1C" /><Text style={styles.loadingText}>Fetching from Coston2...</Text></View>
        ) : (
          <View style={styles.ftsoGrid}>
            {FTSO_FEEDS.map(feed => {
              const price = ftsoPrices[feed.symbol];
              return (
                <View key={feed.symbol} style={styles.ftsoCard}>
                  <View style={[styles.ftsoIconSmall, { backgroundColor: feed.color }]} />
                  <Text style={styles.ftsoSymbol}>{feed.symbol}</Text>
                  <Text style={styles.ftsoPrice}>
                    {price ? '$' + price.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '—'}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        {/* x402 Paid API Endpoints */}
        <View style={styles.sectionHeader}>
          <View style={styles.x402Badge}>
            <Text style={styles.x402Icon}>⚡</Text>
          </View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>x402 Endpoints</Text>
            <Text style={styles.sectionSub}>Pay-per-request APIs — USDC on Flare</Text>
          </View>
        </View>

        {X402_ENDPOINTS.map((ep, i) => (
          <View key={i} style={styles.endpointCard}>
            <View style={styles.endpointHeader}>
              <Text style={styles.endpointIcon}>{ep.icon}</Text>
              <View style={styles.endpointInfo}>
                <Text style={styles.endpointName}>{ep.name}</Text>
                <Text style={styles.endpointDesc}>{ep.desc}</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>{ep.price}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Recent Settlements */}
        <Text style={styles.sectionTitle2}>Recent x402 Settlements</Text>
        {RECENT_SETTLEMENTS.map((tx, i) => (
          <View key={i} style={styles.txRow}>
            <View style={styles.txLeft}>
              <Text style={styles.txEndpoint}>{tx.endpoint}</Text>
              <Text style={styles.txHash}>{tx.txHash}</Text>
              <Text style={styles.txTime}>{tx.time}</Text>
            </View>
            <View style={styles.txRight}>
              <Text style={styles.txAmount}>{tx.amount}</Text>
              <View style={styles.txStatusBadge}>
                <Text style={styles.txStatusText}>✅ {tx.status}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* FAssets */}
        <View style={styles.sectionHeader}>
          <View style={styles.fAssetBadge}>
            <Text style={styles.fAssetIcon}>🔗</Text>
          </View>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>FAssets — Interoperable</Text>
            <Text style={styles.sectionSub}>Trustless bridge for non-smart-contract assets</Text>
          </View>
        </View>

        {FASSETS.map((fa, i) => (
          <View key={i} style={styles.fAssetCard}>
            <View style={styles.fAssetLeft}>
              <View style={[styles.fAssetIconCircle, { backgroundColor: fa.color }]}>
                <Text style={styles.fAssetIconText}>{fa.icon}</Text>
              </View>
              <View>
                <Text style={styles.fAssetName}>{fa.name}</Text>
                <Text style={styles.fAssetUnderlying}>Backed by {fa.underlying}</Text>
              </View>
            </View>
            <View style={styles.fAssetRight}>
              <Text style={styles.fAssetMinted}>{fa.minted}</Text>
              <Text style={styles.fAssetMintedLabel}>{fa.symbol}</Text>
            </View>
          </View>
        ))}

        {/* Network Info */}
        <Text style={styles.sectionTitle2}>Network</Text>
        <View style={styles.networkCard}>
          <View style={styles.networkRow}>
            <Text style={styles.networkLabel}>Chain</Text>
            <Text style={styles.networkValue}>Flare Coston2 (Testnet)</Text>
          </View>
          <View style={styles.networkRow}>
            <Text style={styles.networkLabel}>Chain ID</Text>
            <Text style={styles.networkValue}>{FLARE_CHAIN_ID}</Text>
          </View>
          <View style={styles.networkRow}>
            <Text style={styles.networkLabel}>FTSO Contract</Text>
            <Text style={styles.networkValueMono}>{FTSOV2_ADDRESS.slice(0, 10)}...{FTSOV2_ADDRESS.slice(-8)}</Text>
          </View>
          <View style={styles.networkRow}>
            <Text style={styles.networkLabel}>Explorer</Text>
            <Text style={styles.networkValueLink}>coston2-explorer.flare.network</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },

  // Section headers
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 20 },
  ftsoBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF9F1C', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  ftsoIcon: { fontSize: 20 },
  x402Badge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#5856D6', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  x402Icon: { fontSize: 20 },
  fAssetBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#1C3040', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fAssetIcon: { fontSize: 18 },
  sectionHeaderText: { flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  sectionSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  sectionTitle2: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginTop: 24, marginBottom: 8 },

  // Loading
  loadingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 8 },
  loadingText: { fontSize: 13, color: '#8E8E93' },

  // FTSO grid
  ftsoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  ftsoCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 12, width: '48%', flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  ftsoIconSmall: { width: 8, height: 8, borderRadius: 4 },
  ftsoSymbol: { fontSize: 12, fontWeight: '600', color: '#8E8E93', flex: 1 },
  ftsoPrice: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },

  // Endpoints
  endpointCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  endpointHeader: { flexDirection: 'row', alignItems: 'center' },
  endpointIcon: { fontSize: 24, marginRight: 12 },
  endpointInfo: { flex: 1 },
  endpointName: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  endpointDesc: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
  priceBadge: { backgroundColor: 'rgba(255,159,28,0.12)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  priceText: { fontSize: 13, fontWeight: '700', color: '#FF9F1C' },

  // Settlements
  txRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 12, padding: 12, marginBottom: 6, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  txLeft: { flex: 1 },
  txEndpoint: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  txHash: { fontSize: 11, color: '#FF9F1C', fontFamily: 'monospace', marginTop: 2 },
  txTime: { fontSize: 11, color: '#8E8E93', marginTop: 1 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  txStatusBadge: { backgroundColor: '#E8F8EE', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 },
  txStatusText: { fontSize: 10, fontWeight: '600', color: '#34C759' },

  // FAssets
  fAssetCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', borderRadius: 12, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  fAssetLeft: { flexDirection: 'row', alignItems: 'center' },
  fAssetIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fAssetIconText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  fAssetName: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  fAssetUnderlying: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  fAssetRight: { alignItems: 'flex-end' },
  fAssetMinted: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  fAssetMintedLabel: { fontSize: 11, color: '#8E8E93', marginTop: 1 },

  // Network
  networkCard: { backgroundColor: '#FFF', borderRadius: 14, padding: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  networkRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  networkLabel: { fontSize: 13, color: '#8E8E93', fontWeight: '500' },
  networkValue: { fontSize: 13, color: '#1C1C1E', fontWeight: '600' },
  networkValueMono: { fontSize: 12, color: '#FF9F1C', fontFamily: 'monospace' },
  networkValueLink: { fontSize: 12, color: '#5856D6', fontWeight: '500' },
});

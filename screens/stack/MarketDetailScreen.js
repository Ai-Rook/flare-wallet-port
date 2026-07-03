import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { TOKENS, getTokenBySymbol } from '../../constants/tokens';
import { iconMap } from '../../components/TokenIcon';
import { HeroIcon } from '../../components/HeroMorph';
import SpringPress from '../../components/SpringPress';
import marketData from '../../constants/marketData.json';

const fmtPrice = (p) => {
  if (!p) return '$0.00';
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return '$' + p.toFixed(2);
  if (p >= 0.01) return '$' + p.toFixed(4);
  return '$' + p.toFixed(8);
};
const fmtCap = (c) => {
  if (!c) return '—';
  if (c >= 1e12) return '$' + (c / 1e12).toFixed(2) + 'T';
  if (c >= 1e9) return '$' + (c / 1e9).toFixed(2) + 'B';
  if (c >= 1e6) return '$' + (c / 1e6).toFixed(1) + 'M';
  return '$' + c.toLocaleString();
};

export default function MarketDetailScreen({ navigation, route }) {
  const symbol = route.params?.symbol || 'BTC';
  const token = getTokenBySymbol(symbol);
  const data = marketData[token?.id] || {};

  const isPositive24h = (data.change24h || 0) >= 0;
  const isPositive7d = (data.change7d || 0) >= 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Hero header with token icon and price */}
      <ScreenHeader pageName={token?.name || symbol} onBack={() => navigation.goBack()} />

      <LinearGradient
        colors={isPositive24h ? ['#0A8F4C', '#0DB95E'] : Colors.primaryGradient}
        style={styles.hero}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          <HeroIcon id={token?.id} source={iconMap[token?.id]} size={52} isDetail={true} />
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{token?.name || symbol}</Text>
            <Text style={styles.heroSymbol}>{symbol}</Text>
          </View>
          <View style={styles.heroBadge}>
            <Text style={styles.heroRank}>#{data.rank || '—'}</Text>
          </View>
        </View>

        <Text style={styles.heroPrice}>{fmtPrice(data.price)}</Text>
        <View style={styles.heroChangeRow}>
          <Text style={styles.heroChangeLabel}>24h</Text>
          <Text style={[styles.heroChangeValue, { color: '#FFF' }]}>
            {isPositive24h ? '▲' : '▼'} {Math.abs(data.change24h || 0).toFixed(2)}%
          </Text>
          <Text style={styles.heroChangeLabel}>  7d</Text>
          <Text style={[styles.heroChangeValue, { color: isPositive7d ? '#B8F0D0' : '#FFB3B3' }]}>
            {isPositive7d ? '▲' : '▼'} {Math.abs(data.change7d || 0).toFixed(2)}%
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Buy / Sell / Neutral Gauge */}
        <View style={styles.gaugeSection}>
          <View style={styles.gaugeBar}>
            <View style={[styles.gaugeFill, {
              backgroundColor: getGaugeColor(data),
              width: getGaugeWidth(data),
            }]} />
          </View>
          <View style={styles.gaugeLabels}>
            <Text style={styles.gaugeLabelSell}>SELL</Text>
            <Text style={styles.gaugeLabelNeutral}>NEUTRAL</Text>
            <Text style={styles.gaugeLabelBuy}>BUY</Text>
          </View>
          <View style={styles.gaugeIndicator}>
            <View style={[styles.gaugeDot, { backgroundColor: getGaugeColor(data) }]} />
            <Text style={[styles.gaugeVerdict, { color: getGaugeColor(data) }]}>
              {getGaugeVerdict(data)}
            </Text>
          </View>
          <SpringPress onPress={() => Linking.openURL('https://ai-rook.com/analysis/' + symbol.toLowerCase())}>
            <View style={styles.gaugeAgenticBtn}>
              <Text style={styles.gaugeAgenticIcon}>🤖</Text>
              <Text style={styles.gaugeAgenticText}>Ask AI-Rook</Text>
              <Text style={styles.gaugeAgenticSub}>ai-rook.com</Text>
            </View>
          </SpringPress>
        </View>

        {/* Key metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Market Cap</Text>
              <Text style={styles.metricValue}>{fmtCap(data.marketCap)}</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>24h Volume</Text>
              <Text style={styles.metricValue}>{fmtCap(data.volume24h)}</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Circulating Supply</Text>
              <Text style={styles.metricValue}>{data.circulating || '—'}</Text>
            </View>
            <View style={styles.metricCell}>
              <Text style={styles.metricLabel}>Vol/MCap Ratio</Text>
              <Text style={styles.metricValue}>
                {data.volume24h && data.marketCap ? ((data.volume24h / data.marketCap) * 100).toFixed(2) + '%' : '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Price performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Performance</Text>
          <View style={styles.perfCard}>
            {[
              { label: '24h', value: data.change24h || 0 },
              { label: '7d', value: data.change7d || 0 },
            ].map((item, i) => {
              const isPos = item.value >= 0;
              const barWidth = Math.min(Math.abs(item.value) * (item.label === '24h' ? 10 : 5), 100);
              return (
                <View key={i} style={styles.perfRow}>
                  <Text style={styles.perfLabel}>{item.label}</Text>
                  <View style={styles.perfBarTrack}>
                    <View style={[
                      styles.perfBarFill,
                      {
                        width: `${barWidth}%`,
                        backgroundColor: isPos ? Colors.success : Colors.error,
                      }
                    ]} />
                  </View>
                  <Text style={[styles.perfValue, { color: isPos ? Colors.success : Colors.error }]}>
                    {isPos ? '+' : ''}{item.value.toFixed(2)}%
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Agentic Analysis — AI-powered market insight */}
        <View style={styles.section}>
          <View style={styles.agenticHeader}>
            <Text style={styles.sectionTitle}>🤖 Agentic Analysis</Text>
            <View style={styles.agenticBadge}>
              <Text style={styles.agenticBadgeText}>x402</Text>
            </View>
          </View>
          <View style={styles.agenticCard}>
            <View style={styles.agenticRow}>
              <View style={styles.agenticIconWrap}>
                <Text style={styles.agenticIcon}>🧠</Text>
              </View>
              <View style={styles.agenticContent}>
                <Text style={styles.agenticTitle}>Market Sentiment</Text>
                <Text style={styles.agenticDesc}>
                  {(data.change7d || 0) > 5 ? 'Strongly bullish — significant upward momentum over 7 days.' :
                   (data.change7d || 0) > 0 ? 'Mildly bullish — modest gains with room for growth.' :
                   (data.change7d || 0) > -3 ? 'Neutral to slightly bearish — monitoring for reversal signals.' :
                   'Bearish trend — consider waiting for stabilization before entry.'}
                </Text>
              </View>
            </View>
            <View style={styles.agenticDivider} />
            <View style={styles.agenticRow}>
              <View style={styles.agenticIconWrap}>
                <Text style={styles.agenticIcon}>⚡</Text>
              </View>
              <View style={styles.agenticContent}>
                <Text style={styles.agenticTitle}>Agent Activity</Text>
                <Text style={styles.agenticDesc}>
                  {data.volume24h && data.marketCap && (data.volume24h / data.marketCap) > 0.1
                    ? 'High agent activity — above-average on-chain settlement volume detected.'
                    : 'Normal agent activity — standard settlement patterns for this asset.'}
                </Text>
              </View>
            </View>
            <View style={styles.agenticDivider} />
            <View style={styles.agenticRow}>
              <View style={styles.agenticIconWrap}>
                <Text style={styles.agenticIcon}>💸</Text>
              </View>
              <View style={styles.agenticContent}>
                <Text style={styles.agenticTitle}>x402 Payment Potential</Text>
                <Text style={styles.agenticDesc}>
                  {data.marketCap && data.marketCap > 1e9
                    ? 'High — deep liquidity supports reliable agent-to-agent micropayments with minimal slippage.'
                    : 'Moderate — sufficient for smaller x402 settlements under $1K per transaction.'}
                </Text>
              </View>
            </View>
            <View style={styles.agenticDivider} />
            <SpringPress onPress={() => navigation.navigate('Agentic', {})} style={styles.agenticActionBtn}>
              <View style={styles.agenticActionInner}>
                <Text style={styles.agenticActionText}>Run Deep Agent Analysis →</Text>
                <Text style={styles.agenticActionSub}>Opens Agentic tab • x402 protocol</Text>
              </View>
            </SpringPress>
          </View>
        </View>

        {/* About section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About {token?.name || symbol}</Text>
          <View style={styles.aboutCard}>
            <Text style={styles.aboutText}>
              {getAboutText(token?.id, token?.name)}
            </Text>
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <SpringPress onPress={() => navigation.navigate('WalletDetail', { symbol })} style={styles.actionBtn}>
            <View style={styles.actionBtnInner}>
              <Text style={styles.actionIcon}>💰</Text>
              <Text style={styles.actionLabel}>Wallet</Text>
            </View>
          </SpringPress>
          <SpringPress onPress={() => navigation.navigate('BuySell', { side: 'buy', symbol })} style={styles.actionBtn}>
            <View style={styles.actionBtnInner}>
              <Text style={styles.actionIcon}>📈</Text>
              <Text style={styles.actionLabel}>Buy</Text>
            </View>
          </SpringPress>
          <SpringPress onPress={() => navigation.navigate('Exchange', { fromAsset: symbol })} style={styles.actionBtn}>
            <View style={styles.actionBtnInner}>
              <Text style={styles.actionIcon}>🔄</Text>
              <Text style={styles.actionLabel}>Swap</Text>
            </View>
          </SpringPress>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function getAboutText(id, name) {
  const descriptions = {
    bitcoin: 'Bitcoin is the first decentralized cryptocurrency, created in 2009 by Satoshi Nakamoto. It operates on a proof-of-work blockchain and serves as a store of value and medium of exchange.',
    ethereum: 'Ethereum is a decentralized platform enabling smart contracts and dApps. Created by Vitalik Buterin in 2015, it pioneered programmable blockchain technology.',
    solana: 'Solana is a high-performance blockchain supporting decentralized applications with sub-second finality and low fees. Known for its speed of 65,000+ TPS.',
    ripple: 'XRP is the native token of the XRP Ledger, designed for fast, low-cost international payments. Created by Ripple Labs for cross-border settlement.',
    cardano: 'Cardano is a proof-of-stake blockchain founded by Ethereum co-creator Charles Hoskinson. Focuses on sustainability, scalability, and peer-reviewed research.',
    dogecoin: 'Dogecoin started as a meme cryptocurrency in 2013 and grew into a top-10 digital asset. Known for its strong community and low transaction fees.',
    chainlink: 'Chainlink is a decentralized oracle network that connects smart contracts with real-world data, enabling reliable off-chain computation.',
    polkadot: 'Polkadot enables cross-chain interoperability through its relay chain and parachains. Founded by Ethereum co-creator Gavin Wood.',
    litecoin: 'Litecoin is a peer-to-peer cryptocurrency created in 2011 as a lighter alternative to Bitcoin. Often called "the silver to Bitcoin\'s gold."',
    avalanche: 'Avalanche is a blazingly fast smart contract platform with sub-second finality. Supports custom blockchains and DeFi applications.',
    'bitcoin-cash': 'Bitcoin Cash is a fork of Bitcoin created in 2017, designed for faster, cheaper transactions with larger block sizes.',
    polygon: 'Polygon is an Ethereum scaling solution providing faster and cheaper transactions through sidechains and plasma chains.',
    cosmos: 'Cosmos is an ecosystem of interoperable blockchains connected via the IBC protocol, enabling cross-chain communication.',
    stellar: 'Stellar is a payment network designed for fast, low-cost cross-border transactions, particularly targeting the unbanked.',
    'shiba-inu': 'Shiba Inu is an Ethereum-based meme token that has evolved into a DeFi ecosystem with ShibaSwap and Layer 2 Shibarium.',
    tether: 'Tether (USDT) is the largest stablecoin, pegged 1:1 to the US Dollar. Used extensively for trading pairs and value transfer.',
    'usd-coin': 'USDC is a fully-reserved stablecoin pegged to the US Dollar, issued by Circle. Known for transparency and regulatory compliance.',
    uniswap: 'Uniswap is the leading decentralized exchange on Ethereum, enabling token swaps through automated liquidity pools.',
  };
  return descriptions[id] || `${name || 'This asset'} is a digital asset available on CoinPayments. Market data and analysis are shown above.`;
}

// Gauge helpers — derive buy/sell/neutral from market data
function getGaugeScore(data) {
  let score = 50; // neutral baseline
  if (data.change7d > 5) score += 20;
  else if (data.change7d > 2) score += 10;
  else if (data.change7d < -5) score -= 20;
  else if (data.change7d < -2) score -= 10;
  if (data.change24h > 1) score += 5;
  else if (data.change24h < -1) score -= 5;
  if (data.volume24h && data.marketCap && (data.volume24h / data.marketCap) > 0.05) score += 5;
  return Math.max(5, Math.min(95, score));
}
function getGaugeColor(data) {
  const s = getGaugeScore(data);
  if (s >= 65) return '#0DB95E'; // buy green
  if (s <= 35) return '#D4555A'; // sell red
  return '#FF9500'; // neutral orange
}
function getGaugeWidth(data) { return getGaugeScore(data) + '%'; }
function getGaugeVerdict(data) {
  const s = getGaugeScore(data);
  if (s >= 65) return 'BUY';
  if (s >= 50) return 'LEAN BUY';
  if (s >= 35) return 'NEUTRAL';
  if (s >= 20) return 'LEAN SELL';
  return 'SELL';
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },

  // Hero header
  hero: { paddingTop: 8, paddingBottom: 20, paddingHorizontal: 20 },
  backBtn: { position: 'absolute', top: 8, left: 16, zIndex: 10 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  heroContent: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 16 },
  heroInfo: { marginLeft: 12, flex: 1 },
  heroName: { color: '#FFF', fontSize: 20, fontWeight: '700' },
  heroSymbol: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 1 },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  heroRank: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  heroPrice: { color: '#FFF', fontSize: 34, fontWeight: '700', marginBottom: 6 },
  heroChangeRow: { flexDirection: 'row', alignItems: 'center' },
  heroChangeLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  heroChangeValue: { fontSize: 14, fontWeight: '600', marginLeft: 4 },

  // Content
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#F2F2F7' },

  // Gauge
  gaugeSection: { marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16 },
  gaugeBar: { height: 8, backgroundColor: '#E5E5EA', borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  gaugeFill: { height: 8, borderRadius: 4 },
  gaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  gaugeLabelSell: { fontSize: 10, fontWeight: '700', color: '#D4555A', letterSpacing: 1 },
  gaugeLabelNeutral: { fontSize: 10, fontWeight: '700', color: '#FF9500', letterSpacing: 1 },
  gaugeLabelBuy: { fontSize: 10, fontWeight: '700', color: '#0DB95E', letterSpacing: 1 },
  gaugeIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  gaugeDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  gaugeVerdict: { fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  gaugeAgenticBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6C5CE7', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14 },
  gaugeAgenticIcon: { fontSize: 18, marginRight: 8 },
  gaugeAgenticText: { color: '#1C1C1E', fontSize: 14, fontWeight: '600', flex: 1 },
  gaugeAgenticSub: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '500' },

  // Sections
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 },

  // Key metrics grid
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  metricCell: { width: '50%', paddingVertical: 6 },
  metricLabel: { fontSize: 11, color: Colors.textLight, marginBottom: 1 },
  metricValue: { fontSize: 15, fontWeight: '600', color: Colors.text },

  // Performance
  perfCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  perfRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  perfLabel: { width: 36, fontSize: 12, color: Colors.textLight, fontWeight: '500' },
  perfBarTrack: { flex: 1, height: 6, backgroundColor: '#E5E5EA', borderRadius: 3, marginHorizontal: 8, overflow: 'hidden' },
  perfBarFill: { height: 6, borderRadius: 3 },
  perfValue: { fontSize: 12, fontWeight: '600', width: 60, textAlign: 'right' },

  // Agentic analysis
  agenticHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  agenticBadge: { backgroundColor: '#6C5CE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, marginLeft: 8 },
  agenticBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  agenticCard: { backgroundColor: '#1A1030', borderRadius: 14, padding: 14 },
  agenticRow: { flexDirection: 'row', alignItems: 'flex-start' },
  agenticIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#2A1848', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  agenticIcon: { fontSize: 16 },
  agenticContent: { flex: 1 },
  agenticTitle: { fontSize: 13, fontWeight: '700', color: '#B8A9E8', marginBottom: 2 },
  agenticDesc: { fontSize: 12, lineHeight: 17, color: '#5B4C9A' },
  agenticDivider: { height: 1, backgroundColor: '#3A2A5A', marginVertical: 10 },
  agenticActionBtn: { marginTop: 4 },
  agenticActionInner: { backgroundColor: '#6C5CE7', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  agenticActionText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  agenticActionSub: { color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 },

  // About
  aboutCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14 },
  aboutText: { fontSize: 13, lineHeight: 19, color: Colors.textLight },

  // Actions
  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 4 },
  actionBtn: { width: '30%' },
  actionBtnInner: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, alignItems: 'center',
  },
  actionIcon: { fontSize: 22, marginBottom: 4 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: Colors.text },
});

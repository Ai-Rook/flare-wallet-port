import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../constants/colors';
import { useLivePrices } from '../services/LivePriceService';
import ScreenHeader from '../components/ScreenHeader';

const FEED_INFO = [
  { symbol: 'FLR', name: 'Flare', color: '#FFD700' },
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'XRP', name: 'XRP', color: '#23292F' },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633' },
  { symbol: 'LTC', name: 'Litecoin', color: '#345D9D' },
  { symbol: 'SOL', name: 'Solana', color: '#9945FF' },
  { symbol: 'ADA', name: 'Cardano', color: '#0033AD' },
];

// Generate a simple sparkline from the current price + change
function Sparkline({ change24h }) {
  const isUp = change24h >= 0;
  const color = isUp ? Colors.success : Colors.error;
  const points = [];
  for (let i = 0; i < 20; i++) {
    const x = (i / 19) * 100;
    const y = 50 + Math.sin(i * 0.5 + (isUp ? 0 : Math.PI)) * 15 + (isUp ? -i * 0.8 : i * 0.8);
    points.push(`${x},${y}`);
  }
  return (
    <View style={styles.sparkline}>
      {points.map((p, i) => {
        const [x, y] = p.split(',');
        return <View key={i} style={[styles.sparkDot, { left: parseFloat(x) * 1.5, top: parseFloat(y), backgroundColor: color }]} />;
      })}
    </View>
  );
}

export default function MarketsScreen({ navigation }) {
  const { prices, source, lastUpdated } = useLivePrices();

  const sourceLabel = source === 'ftso-live' ? '🔥 Live FTSOv2 Oracle' : '📊 Demo Prices';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Markets" subtitle="FTSOv2 Price Feeds" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.sourceRow}>
          <Text style={styles.sourceLabel}>{sourceLabel}</Text>
          {lastUpdated && <Text style={styles.updatedText}>Updated {lastUpdated.toLocaleTimeString()}</Text>}
        </View>

        {FEED_INFO.map((feed) => {
          const data = prices[feed.symbol];
          const price = data?.price || 0;
          const change = data?.change24h || 0;
          const isUp = change >= 0;

          return (
            <TouchableOpacity
              key={feed.symbol}
              style={styles.feedCard}
              onPress={() => navigation.navigate('MarketDetail', { symbol: feed.symbol })}
            >
              <View style={[styles.feedIcon, { backgroundColor: feed.color + '20' }]}>
                <Text style={styles.feedIconText}>{feed.symbol.slice(0, 2)}</Text>
              </View>
              <View style={styles.feedInfo}>
                <Text style={styles.feedName}>{feed.name}</Text>
                <Text style={styles.feedPair}>{feed.symbol}/USD</Text>
              </View>
              <Sparkline change24h={change} />
              <View style={styles.feedPriceCol}>
                <Text style={styles.feedPrice}>${price.toLocaleString('en-US', { maximumFractionDigits: 4 })}</Text>
                <Text style={[styles.feedChange, { color: isUp ? Colors.success : Colors.error }]}>
                  {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={styles.ftsoCard}>
          <Text style={styles.ftsoTitle}>Flare Time Series Oracle v2</Text>
          <Text style={styles.ftsoText}>
            FTSOv2 provides decentralized price feeds for the Flare network. Prices are aggregated from independent data providers and updated every ~90 seconds on Coston2.
          </Text>
          <Text style={styles.ftsoContract}>Contract: 0x3d893C53D9e8056135C26C8c638B76C8b60Df726</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  sourceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sourceLabel: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  updatedText: { fontSize: 12, color: Colors.textMuted },
  feedCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  feedIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  feedIconText: { fontSize: 14, fontWeight: '700' },
  feedInfo: { flex: 1 },
  feedName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  feedPair: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  sparkline: { width: 60, height: 40, position: 'relative', marginRight: 8 },
  sparkDot: { position: 'absolute', width: 2, height: 2, borderRadius: 1 },
  feedPriceCol: { alignItems: 'flex-end', minWidth: 90 },
  feedPrice: { fontSize: 15, fontWeight: '700', color: Colors.text },
  feedChange: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  ftsoCard: { backgroundColor: Colors.primary + '08', borderRadius: 16, padding: 16, marginTop: 8, borderWidth: 1, borderColor: Colors.border },
  ftsoTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  ftsoText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 8 },
  ftsoContract: { fontSize: 11, color: Colors.textMuted, fontFamily: 'monospace' },
});

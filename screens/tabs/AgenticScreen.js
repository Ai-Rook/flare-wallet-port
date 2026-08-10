import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices, useBlockScanner } from '../../services/LivePriceService';
import { CRYPTO_HOLDINGS, computePortfolioTotal, computePortfolioChange, getAssetUSDValue } from '../../constants/holdings';
import { FLARE_NETWORK_NAME } from '../../appConfig';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';

export default function AgenticScreen({ navigation }) {
  const { prices, source } = useLivePrices();
  const { blockData, loading: scannerLoading } = useBlockScanner();
  const total = computePortfolioTotal(prices);
  const change = computePortfolioChange(prices);
  const isPositive = change.changeAmount >= 0;

  const insights = [
    { icon: '🔥', title: 'FTSOv2 Oracle Active', text: `Live price feeds for 8 assets via Flare FTSOv2 on ${FLARE_NETWORK_NAME}` },
    { icon: '⚖️', title: 'Portfolio Balance', text: `Total portfolio value $${total.toLocaleString('en-US', { maximumFractionDigits: 2 })} across crypto and fiat` },
    { icon: '🛡️', title: 'FAsset Coverage', text: 'FXRP is the only FAsset deployed on Coston2. FBTC/FDOGE coming to mainnet.' },
    { icon: '📈', title: isPositive ? 'Portfolio Up' : 'Portfolio Down', text: `${isPositive ? '+' : ''}${change.changePercent}% ($${Math.abs(change.changeAmount).toFixed(2)}) in the last session` },
  ];

  const quickActions = [
    { label: 'Send', icon: '📤', screen: 'Send' },
    { label: 'Receive', icon: '📥', screen: 'Receive' },
    { label: 'Markets', icon: '📊', screen: 'Prices' },
    { label: 'Wallet', icon: '💼', screen: 'wallet' },
  ];

  // Format block time
  const formatBlockTime = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString();
  };

  // Format time ago
  const timeAgo = (ts) => {
    if (!ts) return '—';
    const seconds = Math.floor(Date.now() / 1000 - ts);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="AI Assistant" subtitle="Flare Wallet Intelligence" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* AI Status Card */}
        <View style={styles.aiCard}>
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
          <View style={styles.aiInfo}>
            <Text style={styles.aiName}>Flare AI</Text>
            <Text style={styles.aiStatus}>Online · {source === 'ftso-live' ? 'Live Oracle' : 'Demo Mode'}</Text>
          </View>
          {/* Flare branding badge */}
          <View style={styles.flareBadge}>
            <Text style={styles.flareBadgeText}>🔥 Flare</Text>
          </View>
        </View>

        {/* Portfolio Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Portfolio Value</Text>
          <Text style={styles.summaryValue}>${total.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
          <Text style={[styles.summaryChange, { color: isPositive ? Colors.success : Colors.error }]}>
            {isPositive ? '+' : ''}{change.changePercent}% ({isPositive ? '+' : '-'}${Math.abs(change.changeAmount).toFixed(2)})
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickRow}>
          {quickActions.map(action => (
            <TouchableOpacity key={action.label} style={styles.quickBtn} onPress={() => navigation.navigate(action.screen)}>
              <Text style={styles.quickIcon}>{action.icon}</Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* AI Insights */}
        <Text style={styles.sectionTitle}>AI Insights</Text>
        {insights.map((insight, i) => (
          <View key={i} style={styles.insightCard}>
            <Text style={styles.insightIcon}>{insight.icon}</Text>
            <View style={styles.insightInfo}>
              <Text style={styles.insightTitle}>{insight.title}</Text>
              <Text style={styles.insightText}>{insight.text}</Text>
            </View>
          </View>
        ))}

        {/* Block Scanner */}
        <Text style={styles.sectionTitle}>⛓️ Coston2 Block Scanner</Text>
        {scannerLoading && !blockData ? (
          <View style={styles.scannerCard}>
            <Text style={styles.scannerLoading}>Loading block data...</Text>
          </View>
        ) : blockData ? (
          <View>
            {/* Live block stats */}
            <View style={styles.scannerStatsRow}>
              <View style={styles.scannerStat}>
                <Text style={styles.scannerStatLabel}>Block Height</Text>
                <Text style={styles.scannerStatValue}>#{blockData.blockNumber?.toLocaleString()}</Text>
              </View>
              <View style={styles.scannerStat}>
                <Text style={styles.scannerStatLabel}>Gas Price</Text>
                <Text style={styles.scannerStatValue}>{blockData.gasPrice}</Text>
              </View>
              <View style={styles.scannerStat}>
                <Text style={styles.scannerStatLabel}>Chain ID</Text>
                <Text style={styles.scannerStatValue}>#{blockData.chainId}</Text>
              </View>
            </View>

            {/* Recent blocks list */}
            <View style={styles.scannerCard}>
              <Text style={styles.scannerCardTitle}>Recent Blocks</Text>
              {blockData.recentBlocks?.map((blk, i) => (
                <View key={blk.number} style={[styles.blockRow, i < 4 && styles.blockBorder]}>
                  <View style={styles.blockNumCol}>
                    <Text style={styles.blockNum}>#{blk.number.toLocaleString()}</Text>
                    <Text style={styles.blockTime}>{timeAgo(blk.timestamp)}</Text>
                  </View>
                  <View style={styles.blockMidCol}>
                    <Text style={styles.blockTxCount}>{blk.txCount} txs</Text>
                    <Text style={styles.blockHash}>{blk.hash?.slice(0, 10)}...{blk.hash?.slice(-6)}</Text>
                  </View>
                  <View style={styles.blockGasCol}>
                    <Text style={styles.blockGas}>{blk.gasUsed?.toLocaleString()}</Text>
                    <Text style={styles.blockGasLabel}>gas used</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Scanner info */}
            <View style={styles.scannerInfoCard}>
              <Text style={styles.scannerInfoText}>
                🔗 Live data from Coston2 testnet via Flare RPC. Block scanner updates every 15 seconds.
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.scannerLink}>View network settings →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.scannerCard}>
            <Text style={styles.scannerLoading}>Unable to connect to Coston2 RPC</Text>
          </View>
        )}

        {/* Top Holdings */}
        <Text style={styles.sectionTitle}>Top Holdings</Text>
        {CRYPTO_HOLDINGS.slice(0, 4).map(asset => {
          const usdValue = getAssetUSDValue(asset, prices);
          return (
            <View key={asset.symbol} style={styles.holdingRow}>
              <FlareTokenIcon symbol={asset.symbol} size={36} color={Colors.primary} />
              <Text style={styles.holdingName}>{asset.symbol}</Text>
              <Text style={styles.holdingValue}>${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
            </View>
          );
        })}

        {/* Built on Flare footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔥 Built on Flare · FTSOv2 Oracle · FAssets</Text>
          <Text style={styles.footerVersion}>Flare Wallet v1.0.0 · Coston2 Testnet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  aiCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  aiAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  aiAvatarText: { fontSize: 24 },
  aiInfo: { flex: 1 },
  aiName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  aiStatus: { fontSize: 12, color: Colors.success, marginTop: 2 },
  flareBadge: { backgroundColor: Colors.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  flareBadgeText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  summaryCard: { backgroundColor: Colors.primary, borderRadius: 20, padding: 24, marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#FFF', opacity: 0.8, marginBottom: 4 },
  summaryValue: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  summaryChange: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  quickIcon: { fontSize: 24, marginBottom: 4 },
  quickLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  insightCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  insightIcon: { fontSize: 24, marginRight: 12 },
  insightInfo: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: Colors.text },
  insightText: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  // Block scanner styles
  scannerStatsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  scannerStat: { flex: 1, backgroundColor: Colors.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  scannerStatLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', marginBottom: 4 },
  scannerStatValue: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  scannerCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  scannerCardTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  scannerLoading: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingVertical: 20 },
  blockRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  blockBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  blockNumCol: { flex: 1 },
  blockNum: { fontSize: 14, fontWeight: '700', color: Colors.text, fontFamily: 'monospace' },
  blockTime: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  blockMidCol: { flex: 1.2 },
  blockTxCount: { fontSize: 13, fontWeight: '600', color: Colors.text },
  blockHash: { fontSize: 10, color: Colors.textMuted, marginTop: 2, fontFamily: 'monospace' },
  blockGasCol: { alignItems: 'flex-end' },
  blockGas: { fontSize: 13, fontWeight: '600', color: Colors.text },
  blockGasLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  scannerInfoCard: { backgroundColor: Colors.primary + '08', borderRadius: 12, padding: 12, marginBottom: 16 },
  scannerInfoText: { fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },
  scannerLink: { fontSize: 13, color: Colors.primary, fontWeight: '600', marginTop: 8 },
  // Holdings
  holdingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: Colors.border },
  holdingName: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text, marginLeft: 12 },
  holdingValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
  // Footer
  footer: { alignItems: 'center', paddingVertical: 24, marginTop: 16 },
  footerText: { fontSize: 13, fontWeight: '600', color: Colors.primary, marginBottom: 4 },
  footerVersion: { fontSize: 11, color: Colors.textMuted },
});

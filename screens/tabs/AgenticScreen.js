import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices } from '../../services/LivePriceService';
import { CRYPTO_HOLDINGS, computePortfolioTotal, computePortfolioChange, getAssetUSDValue } from '../../constants/holdings';
import { FLARE_NETWORK_NAME } from '../../appConfig';
import ScreenHeader from '../../components/ScreenHeader';

export default function AgenticScreen({ navigation }) {
  const { prices, source } = useLivePrices();
  const total = computePortfolioTotal(prices);
  const change = computePortfolioChange(prices);
  const isPositive = change.changeAmount >= 0;

  const insights = [
    { icon: '🔥', title: 'FTSOv2 Oracle Active', text: `Live price feeds for 8 assets via Flare FTSOv2 on ${FLARE_NETWORK_NAME}` },
    { icon: '⚖️', title: 'Portfolio Balance', text: `Your crypto allocation is ${(total * 0.66 / total * 100).toFixed(0)}% crypto, ${(total * 0.34 / total * 100).toFixed(0)}% fiat` },
    { icon: '🛡️', title: 'FAsset Coverage', text: 'FXRP is the only FAsset deployed on Coston2. FBTC/FDOGE coming to mainnet.' },
    { icon: '📈', title: isPositive ? 'Portfolio Up' : 'Portfolio Down', text: `${isPositive ? '+' : ''}${change.changePercent}% ($${Math.abs(change.changeAmount).toFixed(2)}) in the last session` },
  ];

  const quickActions = [
    { label: 'Send', icon: '📤', screen: 'Send' },
    { label: 'Receive', icon: '📥', screen: 'Receive' },
    { label: 'Markets', icon: '📊', screen: 'Prices' },
    { label: 'Wallet', icon: '💼', screen: 'wallet' },
  ];

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

        {/* Top Holdings */}
        <Text style={styles.sectionTitle}>Top Holdings</Text>
        {CRYPTO_HOLDINGS.slice(0, 4).map(asset => {
          const usdValue = getAssetUSDValue(asset, prices);
          return (
            <View key={asset.symbol} style={styles.holdingRow}>
              <View style={[styles.holdingIcon, { backgroundColor: asset.color + '20' }]}>
                <Text style={styles.holdingIconText}>{asset.symbol.slice(0, 2)}</Text>
              </View>
              <Text style={styles.holdingName}>{asset.symbol}</Text>
              <Text style={styles.holdingValue}>${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
            </View>
          );
        })}
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
  holdingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 12, marginBottom: 6, borderWidth: 1, borderColor: Colors.border },
  holdingIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  holdingIconText: { fontSize: 12, fontWeight: '700' },
  holdingName: { flex: 1, fontSize: 14, fontWeight: '600', color: Colors.text },
  holdingValue: { fontSize: 14, fontWeight: '700', color: Colors.text },
});

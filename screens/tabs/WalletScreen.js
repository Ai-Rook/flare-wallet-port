import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices } from '../../services/LivePriceService';
import { CRYPTO_HOLDINGS, FIAT_HOLDINGS, computePortfolioTotal, computePortfolioChange, getAssetUSDValue } from '../../constants/holdings';
import { DEMO_WALLET_ADDRESS, FLARE_EXPLORER, FLARE_NETWORK_NAME } from '../../appConfig';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon, { FASSET_UNDERLYING } from '../../components/FlareTokenIcon';

export default function WalletScreen({ navigation }) {
  const { prices, lastUpdated, source, refresh } = useLivePrices();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  const portfolioTotal = computePortfolioTotal(prices);
  const portfolioChange = computePortfolioChange(prices);
  const isPositive = portfolioChange.changeAmount >= 0;

  const sourceLabel = source === 'ftso-live' ? '🔥 Live FTSOv2 Oracle' : '📊 Demo Prices';
  const updatedTime = lastUpdated ? lastUpdated.toLocaleTimeString() : '—';

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Wallet" subtitle={FLARE_NETWORK_NAME} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Portfolio Total Card */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioHeader}>
            <Text style={styles.portfolioLabel}>Total Balance</Text>
            <View style={styles.sourceBadge}>
              <Text style={styles.sourceText}>{sourceLabel}</Text>
            </View>
          </View>
          <Text style={styles.portfolioValue}>${portfolioTotal.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
          <View style={styles.changeRow}>
            <Text style={[styles.changeAmount, { color: isPositive ? Colors.success : Colors.error }]}>
              {isPositive ? '+' : ''}${Math.abs(portfolioChange.changeAmount).toFixed(2)}
            </Text>
            <Text style={[styles.changePercent, { color: isPositive ? Colors.success : Colors.error }]}>
              {isPositive ? '+' : ''}{portfolioChange.changePercent}%
            </Text>
            <Text style={styles.updatedText}>Updated {updatedTime}</Text>
          </View>
        </View>

        {/* Demo Wallet Address */}
        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Wallet Address</Text>
          <Text style={styles.addressValue}>{DEMO_WALLET_ADDRESS.slice(0, 8)}...{DEMO_WALLET_ADDRESS.slice(-6)}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Receive')}>
            <Text style={styles.receiveLink}>📥 Receive Funds</Text>
          </TouchableOpacity>
        </View>

        {/* Crypto Assets */}
        <Text style={styles.sectionTitle}>Crypto Assets</Text>
        {CRYPTO_HOLDINGS.map((asset) => {
          const key = asset.underlying || asset.symbol;
          const priceData = prices[key];
          const usdValue = getAssetUSDValue(asset, prices);
          const price = priceData?.price || 0;
          const change = priceData?.change24h || 0;
          const isUp = change >= 0;

          return (
            <TouchableOpacity
              key={asset.symbol}
              style={styles.assetCard}
              onPress={() => navigation.navigate('WalletDetail', { symbol: asset.symbol })}
            >
              <FlareTokenIcon symbol={asset.symbol} size={44} color={Colors.primary} />
              <View style={styles.assetInfo}>
                <Text style={styles.assetName}>{asset.name}</Text>
                <Text style={styles.assetAmount}>{asset.amount.toLocaleString()} {asset.symbol}</Text>
              </View>
              <View style={styles.assetPriceCol}>
                <Text style={styles.assetPrice}>${price.toLocaleString('en-US', { maximumFractionDigits: 4 })}</Text>
                <Text style={[styles.assetChange, { color: isUp ? Colors.success : Colors.error }]}>
                  {isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                </Text>
                <Text style={styles.assetUsdValue}>${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Fiat Holdings */}
        <Text style={styles.sectionTitle}>Fiat Wallet</Text>
        {FIAT_HOLDINGS.map((fiat) => (
          <View key={fiat.code} style={styles.assetCard}>
            <FlareTokenIcon symbol={fiat.code} size={44} color={Colors.primary} />
            <View style={styles.assetInfo}>
              <Text style={styles.assetName}>{fiat.name}</Text>
              <Text style={styles.assetAmount}>{fiat.amount.toLocaleString()} {fiat.code}</Text>
            </View>
            <View style={styles.assetPriceCol}>
              <Text style={styles.assetPrice}>${(fiat.amount / fiat.rate).toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
              <Text style={styles.assetChange}>1 USD = {fiat.rate} {fiat.code}</Text>
            </View>
          </View>
        ))}

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Send')}>
            <Text style={styles.actionBtnText}>📤 Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Receive')}>
            <Text style={styles.actionBtnText}>📥 Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Exchange')}>
            <Text style={styles.actionBtnText}>🔄 Swap</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  portfolioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  portfolioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  portfolioLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  sourceBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sourceText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  portfolioValue: { fontSize: 36, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changeAmount: { fontSize: 15, fontWeight: '700' },
  changePercent: { fontSize: 15, fontWeight: '600', marginRight: 8 },
  updatedText: { fontSize: 12, color: Colors.textMuted, marginLeft: 'auto' },
  addressCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  addressLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  addressValue: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8, fontFamily: 'monospace' },
  receiveLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  assetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  assetIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  assetIconText: { fontSize: 16, fontWeight: '700' },
  assetInfo: { flex: 1 },
  assetName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  assetAmount: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  assetPriceCol: { alignItems: 'flex-end' },
  assetPrice: { fontSize: 15, fontWeight: '700', color: Colors.text },
  assetChange: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  assetUsdValue: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  actionBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});

import React, { useState, useCallback } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, RefreshControl, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices, useOnChainBalance } from '../../services/LivePriceService';
import { CRYPTO_HOLDINGS, FIAT_HOLDINGS, computePortfolioTotal, computePortfolioChange, getAssetUSDValue } from '../../constants/holdings';
import { DEMO_WALLET_ADDRESS, FLARE_NETWORK_NAME } from '../../appConfig';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon, { FASSET_UNDERLYING } from '../../components/FlareTokenIcon';

export default function WalletScreen({ navigation }) {
  const { prices, lastUpdated, source, refresh } = useLivePrices();
  const { balances, loading: balLoading, refresh: refreshBal } = useOnChainBalance(DEMO_WALLET_ADDRESS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refresh(), refreshBal()]);
    setRefreshing(false);
  }, [refresh, refreshBal]);

  const portfolioTotal = computePortfolioTotal(prices);
  const portfolioChange = computePortfolioChange(prices);
  const isPositive = portfolioChange.changeAmount >= 0;

  const sourceLabel = source === 'ftso-live' ? '🔥 Live FTSOv2 Oracle' : '📊 Demo Prices';
  const updatedTime = lastUpdated ? lastUpdated.toLocaleTimeString() : '—';

  // Merge on-chain balances with demo holdings
  const getDisplayAmount = (symbol) => {
    if (balances && balances[symbol]) {
      const onChain = parseFloat(balances[symbol].formatted || balances[symbol].amount || 0);
      if (onChain > 0) return onChain;
    }
    // Fallback to holdings.js
    const holding = CRYPTO_HOLDINGS.find(h => h.symbol === symbol);
    return holding?.amount || 0;
  };

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

        {/* Wallet Address + On-Chain Status */}
        <View style={styles.addressCard}>
          <Text style={styles.addressLabel}>Wallet Address (Coston2)</Text>
          <Text style={styles.addressValue}>{DEMO_WALLET_ADDRESS.slice(0, 8)}...{DEMO_WALLET_ADDRESS.slice(-6)}</Text>
          {balLoading && <Text style={styles.chainStatus}>⚡ Fetching on-chain balances...</Text>}
          {balances && !balLoading && (
            <Text style={styles.chainStatusLive}>✅ On-chain: {balances.FLR ? parseFloat(balances.FLR.formatted).toFixed(2) + ' FLR' : '—'} · {balances.FXRP ? parseFloat(balances.FXRP.formatted).toFixed(2) + ' FXRP' : '—'}</Text>
          )}
          <TouchableOpacity onPress={() => navigation.navigate('Receive')}>
            <Text style={styles.receiveLink}>📥 Receive Funds</Text>
          </TouchableOpacity>
        </View>

        {/* Crypto Assets */}
        <Text style={styles.sectionTitle}>Crypto Assets</Text>
        {CRYPTO_HOLDINGS.map((asset) => {
          const key = asset.underlying || asset.symbol;
          const priceData = prices[key];
          const displayAmount = getDisplayAmount(asset.symbol);
          const usdValue = displayAmount * (priceData?.price || 0);
          const price = priceData?.price || 0;
          const change = priceData?.change24h || 0;
          const isUp = change >= 0;
          const isOnChain = balances && balances[asset.symbol] && parseFloat(balances[asset.symbol]?.formatted || 0) > 0;

          return (
            <TouchableOpacity
              key={asset.symbol}
              style={styles.assetCard}
              onPress={() => navigation.navigate('WalletDetail', { symbol: asset.symbol })}
            >
              <FlareTokenIcon symbol={asset.symbol} size={44} color={Colors.primary} />
              <View style={styles.assetInfo}>
                <View style={styles.assetNameRow}>
                  <Text style={styles.assetName}>{asset.name}</Text>
                  {isOnChain && <Text style={styles.onChainBadge}>⛓️</Text>}
                </View>
                <Text style={styles.assetAmount}>{displayAmount.toLocaleString()} {asset.symbol}</Text>
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

        {/* Built on Flare */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔥 Built on Flare · FTSOv2 Oracle · FAssets</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 16 },
  portfolioCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, marginBottom: 12, borderWidth: 1, borderColor: Colors.border, shadowColor: Colors.shadowColor, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  portfolioHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  portfolioLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  sourceBadge: { backgroundColor: Colors.primary + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  sourceText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  portfolioValue: { fontSize: 36, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  changeAmount: { fontSize: 15, fontWeight: '700' },
  changePercent: { fontSize: 15, fontWeight: '600', marginRight: 8 },
  updatedText: { fontSize: 12, color: Colors.textMuted, marginLeft: 'auto' },
  addressCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  addressLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  addressValue: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8, fontFamily: 'monospace' },
  chainStatus: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 8 },
  chainStatusLive: { fontSize: 12, color: Colors.success, fontWeight: '600', marginBottom: 8 },
  receiveLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  assetCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  assetInfo: { flex: 1, marginLeft: 12 },
  assetNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  assetName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  onChainBadge: { fontSize: 12 },
  assetAmount: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  assetPriceCol: { alignItems: 'flex-end' },
  assetPrice: { fontSize: 15, fontWeight: '700', color: Colors.text },
  assetChange: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  assetUsdValue: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  actionBtn: { flex: 1, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  footer: { alignItems: 'center', paddingVertical: 24, marginTop: 16 },
  footerText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
});

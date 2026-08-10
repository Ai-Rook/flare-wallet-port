import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, TextInput, RefreshControl,
} from 'react-native';
import { useLivePrices } from '../../services/LivePriceService';
import {
  CRYPTO_HOLDINGS, FIAT_HOLDINGS,
  computePortfolioTotal, computePortfolioChange, getAssetUSDValue,
} from '../../constants/holdings';

function formatUSD(val) {
  if (val >= 1000) return '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return '$' + val.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function formatAmount(amt) {
  if (amt >= 1000) return amt.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (amt >= 1) return amt.toFixed(4);
  return amt.toFixed(6);
}

export default function WalletScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { prices, refresh, source } = useLivePrices();

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filteredTokens = CRYPTO_HOLDINGS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiat = FIAT_HOLDINGS.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = computePortfolioTotal(prices);
  const change = computePortfolioChange(prices);

  const sourceLabel = source === 'ftso-proxy' || source === 'ftso-direct'
    ? '⚡ Live via Flare FTSOv2'
    : source === 'fallback'
    ? '📊 Demo prices (FTSO offline)'
    : 'Loading prices...';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader
        pageName="Wallet"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>◉</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Portfolio summary */}
        <View style={styles.portfolioCard}>
          <Text style={styles.portfolioLabel}>Total Portfolio Value</Text>
          <Text style={styles.portfolioValue}>{formatUSD(totalValue)}</Text>
          <View style={styles.changeRow}>
            <Text style={[styles.changeText, { color: change.changePercent >= 0 ? '#2ECC71' : '#E74C3C' }]}>
              {change.changePercent >= 0 ? '↑' : '↓'} {formatUSD(Math.abs(change.changeAmount))} ({change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(2)}%)
            </Text>
          </View>
          <Text style={styles.portfolioOracle}>{sourceLabel}</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets..."
            placeholderTextColor="#9E8E83"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View style={styles.filterRow}>
          {['all', 'crypto', 'fiat'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'crypto' ? 'Flare Assets' : 'Fiat'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6300" />}
        >
          {/* Flare Assets */}
          {(activeFilter === 'all' || activeFilter === 'crypto') && (
            <>
              <Text style={styles.sectionLabel}>Flare Assets ({filteredTokens.length})</Text>
              {filteredTokens.map((wallet) => {
                const key = wallet.underlying || wallet.symbol;
                const price = prices[key];
                const usdValue = getAssetUSDValue(wallet, prices);
                const change24h = price ? price.change24h : 0;
                return (
                  <TouchableOpacity
                    key={wallet.symbol}
                    style={styles.walletRow}
                    onPress={() => navigation.navigate('WalletDetail', { symbol: wallet.symbol })}
                  >
                    <View style={[styles.tokenIcon, { backgroundColor: wallet.color }]}>
                      <Text style={styles.tokenIconText}>{wallet.symbol === 'FLR' ? '◉' : (wallet.symbol[0])}</Text>
                    </View>
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{wallet.name}</Text>
                      <Text style={styles.walletSymbol}>{formatAmount(wallet.amount)} {wallet.symbol}</Text>
                    </View>
                    <View style={styles.walletBalance}>
                      {price ? (
                        <>
                          <Text style={styles.walletFiat}>{formatUSD(usdValue)}</Text>
                          <Text style={[styles.walletPrice, { color: change24h >= 0 ? '#2ECC71' : '#E74C3C' }]}>
                            {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}% · ${price.price.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.walletPriceMuted}>Loading...</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          {/* Fiat */}
          {(activeFilter === 'all' || activeFilter === 'fiat') && (
            <>
              <Text style={styles.sectionLabel}>Fiat Currencies ({filteredFiat.length})</Text>
              {filteredFiat.map((fiat) => {
                const usdValue = fiat.amount / fiat.rate;
                return (
                  <TouchableOpacity
                    key={fiat.code}
                    style={styles.walletRow}
                    onPress={() => navigation.navigate('WalletDetail', { symbol: fiat.code })}
                  >
                    <Text style={styles.flagIcon}>{fiat.flag}</Text>
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{fiat.name}</Text>
                      <Text style={styles.walletSymbol}>{fiat.code}</Text>
                    </View>
                    <View style={styles.walletBalance}>
                      <Text style={styles.walletFiat}>{formatUSD(usdValue)}</Text>
                      <Text style={styles.walletPrice}>{fiat.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {fiat.code}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FF6300' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8, backgroundColor: '#FFF8F0' },
  portfolioCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: '#FF6300',
    shadowColor: '#FF6300', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  portfolioLabel: { fontSize: 12, color: '#9E8E83', fontWeight: '600', marginBottom: 4 },
  portfolioValue: { fontSize: 28, fontWeight: '700', color: '#1A1A1A' },
  changeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  changeText: { fontSize: 14, fontWeight: '600' },
  portfolioOracle: { fontSize: 11, color: '#FF6300', fontWeight: '500', marginTop: 6 },
  searchContainer: {
    backgroundColor: '#FFFFFF', borderRadius: 12, height: 44,
    paddingHorizontal: 14, marginBottom: 12, justifyContent: 'center',
    shadowColor: '#FF6300', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  searchInput: { fontSize: 15, color: '#1A1A1A' },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#FFE4D1' },
  filterActive: { backgroundColor: '#FF6300' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#9E8E83' },
  filterTextActive: { color: '#FFF' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#9E8E83', marginBottom: 8, marginTop: 4 },
  walletRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#FFE4D1',
  },
  tokenIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  tokenIconText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  flagIcon: { fontSize: 28, marginRight: 12, width: 40, textAlign: 'center' },
  walletInfo: { flex: 1 },
  walletName: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  walletSymbol: { fontSize: 12, color: '#9E8E83', marginTop: 1 },
  walletBalance: { alignItems: 'flex-end' },
  walletFiat: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
  walletPrice: { fontSize: 11, color: '#9E8E83', marginTop: 1 },
  walletPriceMuted: { fontSize: 13, color: '#9E8E83' },
});

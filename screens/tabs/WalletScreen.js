import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, TextInput, RefreshControl,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FlareTokenIcon } from '../../components/FlareTokenIcons';
import { useLivePrices } from '../../services/LivePriceService';

// Flare-native wallets only
const FLARE_WALLETS = [
  { symbol: 'FLR', name: 'Flare', amount: '1,250.00', underlying: null },
  { symbol: 'FBTC', name: 'Flare Bitcoin', amount: '0.1410', underlying: 'BTC' },
  { symbol: 'FETH', name: 'Flare Ethereum', amount: '1.205', underlying: 'ETH' },
  { symbol: 'FXRP', name: 'Flare XRP', amount: '1,840.00', underlying: 'XRP' },
  { symbol: 'FDOGE', name: 'Flare Doge', amount: '8,500.00', underlying: 'DOGE' },
  { symbol: 'USDC', name: 'USD Coin', amount: '5,000.00', underlying: null },
];

// Fiat currencies
const FIAT = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', balance: '5,000.00' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', balance: '1,200.00' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', balance: '850.00' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', balance: '3,100.00' },
];

export default function WalletScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const { prices, refresh } = useLivePrices();

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const filteredTokens = FLARE_WALLETS.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiat = FIAT.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTotalValue = () => {
    let total = 5000 + 1200 * 0.92 + 850 * 0.79 + 3100 * 0.73; // fiat
    filteredTokens.forEach(w => {
      const price = prices[w.underlying || w.symbol];
      if (price) {
        const amount = parseFloat(w.amount.replace(/,/g, ''));
        total += amount * price.price;
      }
    });
    return total;
  };

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
          <Text style={styles.portfolioValue}>${getTotalValue().toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
          <Text style={styles.portfolioOracle}>⚡ Live via Flare FTSOv2</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search assets..."
            placeholderTextColor="#8E8E93"
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF9F1C" />}
        >
          {/* Flare Assets */}
          {(activeFilter === 'all' || activeFilter === 'crypto') && (
            <>
              <Text style={styles.sectionLabel}>Flare Assets ({filteredTokens.length})</Text>
              {filteredTokens.map((wallet) => {
                const price = prices[wallet.underlying || wallet.symbol];
                const usdValue = price ? (parseFloat(wallet.amount.replace(/,/g, '')) * price.price) : 0;
                return (
                  <TouchableOpacity
                    key={wallet.symbol}
                    style={styles.walletRow}
                    onPress={() => navigation.navigate('WalletDetail', { symbol: wallet.symbol })}
                  >
                    <FlareTokenIcon symbol={wallet.symbol} size={40} />
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{wallet.name}</Text>
                      <Text style={styles.walletSymbol}>{wallet.amount} {wallet.symbol}</Text>
                    </View>
                    <View style={styles.walletBalance}>
                      {price && <Text style={styles.walletFiat}>${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>}
                      {price && <Text style={styles.walletPrice}>${price.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>}
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
              {filteredFiat.map((fiat) => (
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
                    <Text style={styles.walletFiat}>{fiat.balance} {fiat.code}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  portfolioCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FF9F1C',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  portfolioLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '600', marginBottom: 4 },
  portfolioValue: { fontSize: 28, fontWeight: '700', color: '#1C1C1E' },
  portfolioOracle: { fontSize: 11, color: '#FF9F1C', fontWeight: '500', marginTop: 6 },
  searchContainer: {
    backgroundColor: '#FFF', borderRadius: 12, height: 44,
    paddingHorizontal: 14, marginBottom: 12, justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  searchInput: { fontSize: 15, color: '#1C1C1E' },
  filterRow: { flexDirection: 'row', marginBottom: 16 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: '#E5E5EA' },
  filterActive: { backgroundColor: '#FF9F1C' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#8E8E93' },
  filterTextActive: { color: '#FFF' },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: '#8E8E93', marginBottom: 8, marginTop: 4 },
  walletRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  flagIcon: { fontSize: 28, marginRight: 12, width: 40, textAlign: 'center' },
  walletInfo: { flex: 1 },
  walletName: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  walletSymbol: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  walletBalance: { alignItems: 'flex-end' },
  walletFiat: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  walletPrice: { fontSize: 11, color: '#8E8E93', marginTop: 1 },
});

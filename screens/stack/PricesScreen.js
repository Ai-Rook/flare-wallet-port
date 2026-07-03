import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Animated, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SpringPress from '../../components/SpringPress';
import TokenIcon from '../../components/TokenIcon';
import { TOKENS } from '../../constants/tokens';
import { useLivePrices } from '../../services/LivePriceService';

// Full coin list for favorites / prices
const ALL_COINS = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'XRP', name: 'Ripple', color: '#00AAE4' },
  { symbol: 'SOL', name: 'Solana', color: '#9945FF' },
  { symbol: 'LTC', name: 'Litecoin', color: '#BFBBBB' },
  { symbol: 'BNB', name: 'Binance', color: '#F3BA2F' },
  { symbol: 'ADA', name: 'Cardano', color: '#0033AD' },
  { symbol: 'DOGE', name: 'Dogecoin', color: '#C2A633' },
  { symbol: 'DOT', name: 'Polkadot', color: '#E6007A' },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142' },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5' },
  { symbol: 'LINK', name: 'Chainlink', color: '#2A5ADA' },
  { symbol: 'UNI', name: 'Uniswap', color: '#FF007A' },
  { symbol: 'ATOM', name: 'Cosmos', color: '#2E3148' },
  { symbol: 'USDT', name: 'Tether', color: '#26A17B' },
  { symbol: 'TRX', name: 'TRON', color: '#FF0013' },
  { symbol: 'XLM', name: 'Stellar', color: '#14B6E7' },
  { symbol: 'NEAR', name: 'NEAR Protocol', color: '#00C1DE' },
  { symbol: 'ALGO', name: 'Algorand', color: '#000000' },
  { symbol: 'FTM', name: 'Fantom', color: '#1969FF' },
];

const DEFAULT_FAVORITES = ['BTC', 'ETH', 'XRP', 'SOL', 'LTC', 'BNB'];

export default function PricesScreen({ navigation }) {
  const { prices, lastUpdated, refresh } = useLivePrices();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const filteredCoins = ALL_COINS.filter(c => {
    if (!search) return true;
    return c.name.toLowerCase().includes(search.toLowerCase()) || c.symbol.toLowerCase().includes(search.toLowerCase());
  });

  const favoriteCoins = filteredCoins.filter(c => favorites.includes(c.symbol));
  const otherCoins = filteredCoins.filter(c => !favorites.includes(c.symbol));

  const toggleFavorite = (symbol) => {
    setFavorites(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  const renderCoinRow = (coin, isFav) => {
    const live = prices[coin.symbol];
    const price = live ? live.price : null;
    const change = live ? live.change24h : null;
    const isPositive = change !== null ? change >= 0 : true;
    const token = TOKENS.find(t => t.symbol === coin.symbol);

    return (
      <SpringPress
        key={coin.symbol}
        onPress={() => !editing && navigation.navigate('WalletDetail', { symbol: coin.symbol })}
        activeScale={0.98}
      >
        <View style={styles.coinRow}>
          {/* Checkbox in edit mode */}
          {editing && (
            <TouchableOpacity onPress={() => toggleFavorite(coin.symbol)} style={styles.checkboxArea}>
              <View style={[styles.checkbox, isFav && styles.checkboxChecked]}>
                {isFav && <Text style={styles.checkmark}>✓</Text>}
              </View>
            </TouchableOpacity>
          )}

          {/* Star indicator (non-edit mode) */}
          {!editing && isFav && (
            <View style={styles.starArea}>
              <Text style={styles.star}>★</Text>
            </View>
          )}

          {/* Coin icon */}
          {token ? (
            <TokenIcon token={token} size={36} />
          ) : (
            <View style={[styles.iconCircle, { backgroundColor: coin.color }]}>
              <Text style={styles.iconText}>{coin.symbol.charAt(0)}</Text>
            </View>
          )}

          {/* Name + symbol */}
          <View style={styles.coinInfo}>
            <Text style={styles.coinName}>{coin.name}</Text>
            <Text style={styles.coinSymbol}>{coin.symbol}</Text>
          </View>

          {/* Price + change */}
          <View style={styles.priceArea}>
            {price !== null ? (
              <Text style={styles.priceText}>
                ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: price > 1 ? 2 : 6 })}
              </Text>
            ) : (
              <Text style={styles.priceText}>—</Text>
            )}
            {change !== null && (
              <Text style={[styles.changeText, { color: isPositive ? '#4CD964' : '#D4555A' }]}>
                {isPositive ? '+' : ''}{change.toFixed(2)}%
              </Text>
            )}
          </View>

          {/* Reorder handle in edit mode */}
          {editing && (
            <View style={styles.reorderHandle}>
              <Text style={styles.reorderIcon}>≡</Text>
            </View>
          )}
        </View>
      </SpringPress>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <ScreenHeader
        pageName={editing ? 'Edit Favorites' : 'Prices'}
        onBack={editing ? () => setEditing(false) : undefined}
        editing={editing}
        onCancel={() => setEditing(false)}
        onDone={() => setEditing(false)}
        rightAction={!editing ? (
          <TouchableOpacity onPress={() => setEditing(true)} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '500' }}>Edit</Text>
          </TouchableOpacity>
        ) : undefined}
      />

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search coins..."
          placeholderTextColor="#8E8E93"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Animated.ScrollView
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Favorites section */}
          {favoriteCoins.length > 0 && (
            <>
              <Text style={styles.sectionHeader}>Favorites</Text>
              {favoriteCoins.map(c => renderCoinRow(c, true))}
            </>
          )}

          {/* All coins section */}
          <Text style={styles.sectionHeader}>{search ? 'Results' : 'All Coins'}</Text>
          {otherCoins.map(c => renderCoinRow(c, false))}

          {filteredCoins.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyText}>No coins found</Text>
            </View>
          )}
        </Animated.View>
      </Animated.ScrollView>

      {/* Last updated footer */}
      {lastUpdated && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Updated {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <TouchableOpacity onPress={refresh} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>↻</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 4,
  },
  backIcon: { color: '#FFF', fontSize: 26, fontWeight: '400', padding: 8 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  headerBtn: { paddingHorizontal: 12, paddingVertical: 8 },
  headerBtnText: { color: '#FFF', fontSize: 16, fontWeight: '500' },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    marginHorizontal: 16, marginVertical: 12, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#1C3040' },

  // List
  list: { flex: 1, paddingHorizontal: 16 },
  sectionHeader: {
    fontSize: 13, fontWeight: '600', color: '#8E8E93', textTransform: 'uppercase',
    marginTop: 16, marginBottom: 8, marginLeft: 4,
  },

  // Coin row
  coinRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 12, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  checkboxArea: { width: 36, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  checkbox: {
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#D1D1D6',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: '#1E95EA', borderColor: '#1E95EA' },
  checkmark: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  starArea: { width: 24, alignItems: 'center', marginRight: 6 },
  star: { fontSize: 16, color: '#1E95EA' },
  iconCircle: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    marginRight: 12,
  },
  iconText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  coinInfo: { flex: 1, marginLeft: 4 },
  coinName: { fontSize: 16, fontWeight: '600', color: '#1C3040', lineHeight: 20 },
  coinSymbol: { fontSize: 13, color: '#8E8E93', marginTop: 2, lineHeight: 16 },
  priceArea: { alignItems: 'flex-end', marginRight: 4 },
  priceText: { fontSize: 16, fontWeight: '600', color: '#1C3040' },
  changeText: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  reorderHandle: { width: 28, alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  reorderIcon: { fontSize: 18, color: '#C7C7CC', fontWeight: '400' },

  // Empty
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 36, marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#8E8E93' },

  // Footer
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5, borderTopColor: '#E5E5EA',
  },
  footerText: { fontSize: 12, color: '#8E8E93', marginRight: 8 },
  refreshBtn: { padding: 4 },
  refreshText: { fontSize: 18, color: '#1E95EA' },
});

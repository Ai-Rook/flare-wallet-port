import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, RefreshControl, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { TOKENS } from '../../constants/tokens';
import { AppContext } from '../../context/AppContext';
import TokenIcon from '../../components/TokenIcon';
import SpringPress from '../../components/SpringPress';
import CounterRoll from '../../components/CounterRoll';
import { useFade } from '../../primitives/useFade';
import { useStagger } from '../../primitives/useStagger';
import SparklineChart from '../../components/SparklineChart';
import HeroShimmer from '../../components/HeroShimmer';
import GlowPulse from '../../components/GlowPulse';
import ToastSlide from '../../components/ToastSlide';
import ScreenHeader from '../../components/ScreenHeader';
import HomeCardHero from '../../components/HomeCardHero';
import { useLivePrices } from '../../services/LivePriceService';

// Time period filters
const TIME_FILTERS = ['All', '1y', '1m', '1w', '1d'];
const HOME_TABS = ['Wallets', 'Top News', 'Connect'];

// Mock portfolio data (will be replaced by live prices)
const PORTFOLIO = {
  totalBalance: 87963.34,
  changeAmount: 468.00,
  changePercent: 0.53,
};

// Helper to compute portfolio total from live prices
function computePortfolio(prices, wallets) {
  if (!prices || Object.keys(prices).length === 0) return PORTFOLIO;
  let total = 0;
  wallets.forEach(w => {
    const live = prices[w.symbol];
    if (live) {
      const amount = parseFloat(w.amount.replace(/,/g, ''));
      total += amount * live.price;
    }
  });
  const btcChange = prices.BTC?.change24h || 0.53;
  return {
    totalBalance: total,
    changeAmount: total * (btcChange / 100),
    changePercent: btcChange,
  };
}

// Mock wallet data with sparkline indicators
const WALLETS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 62450.00, change: 2.48, color: '#F7931A', amount: '0.1410', sparkline: [40, 42, 38, 45, 50, 48, 55, 52, 58, 60] },
  { symbol: 'XRP', name: 'Ripple', price: 0.5234, change: -1.24, color: '#00AAE4', amount: '1,840.00', sparkline: [55, 50, 52, 48, 45, 47, 44, 42, 40, 38] },
  { symbol: 'BNB', name: 'Binance', price: 612.80, change: 0.87, color: '#F3BA2F', amount: '2.34', sparkline: [30, 32, 35, 33, 36, 38, 37, 40, 39, 41] },
  { symbol: 'ETH', name: 'Ethereum', price: 3420.15, change: 3.12, color: '#627EEA', amount: '1.205', sparkline: [35, 40, 38, 45, 48, 52, 50, 55, 58, 62] },
  { symbol: 'LTC', name: 'Litecoin', price: 83.45, change: -0.56, color: '#BFBBBB', amount: '48.50', sparkline: [48, 46, 50, 47, 44, 46, 43, 45, 42, 40] },
  { symbol: 'SOL', name: 'Solana', price: 148.90, change: 5.21, color: '#9945FF', amount: '32.10', sparkline: [62, 70, 68, 82, 90, 86, 95] },
];

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('All');
  const [homeTab, setHomeTab] = useState('Wallets');
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 100], outputRange: [0, 1], extrapolate: 'clamp' });
  
  // Staggered entrance animation for wallet cards
  const [walletsVisible, setWalletsVisible] = useState(false);
  const staggerAnims = useRef(WALLETS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    setTimeout(() => setWalletsVisible(true), 300);
    // Stagger wallet cards in
    const animations = staggerAnims.map((anim, i) =>
      Animated.spring(anim, { toValue: 1, friction: 7, tension: 40, delay: i * 80, useNativeDriver: true })
    );
    Animated.stagger(80, animations).start();
  }, []);

  const { prices, lastUpdated, isLoading: pricesLoading } = useLivePrices();
  const [showToast, setShowToast] = useState(false);

  const portfolio = computePortfolio(prices, WALLETS);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* Toast notification */}
      <ToastSlide
        visible={showToast}
        message="Portfolio up 0.53% today"
        color="#1E95EA"
        icon="📈"
        duration={4000}
        onDismiss={() => setShowToast(false)}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        stickyHeaderIndices={[0]}
      >
        {/* ScreenHeader — always visible at top */}
        <ScreenHeader pageName="Home" noBorder rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>🔍</Text>
          </TouchableOpacity>
        } />

        {/* Gradient hero section with shimmer */}
        <HeroShimmer height={200} duration={3000}>
        <LinearGradient
          colors={['#FF9F1C', '#FFC940', '#E8870C']}
          style={styles.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.3, y: 1 }}
        >

          {/* Total Balance */}
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <CounterRoll
            value={portfolio.totalBalance}
            prefix="$"
            fontSize={42}
            fontWeight="700"
            theme={{ text: '#FFFFFF' }}
            style={{ alignSelf: 'center' }}
          />
          <View style={styles.changeRow}>
            <Text style={[styles.changeAmount, { color: portfolio.changePercent >= 0 ? '#4CD964' : '#D4555A' }]}>
              {portfolio.changePercent >= 0 ? '↑' : '↓'} ${Math.abs(portfolio.changeAmount).toFixed(2)}
            </Text>
            <Text style={[styles.changePercent, { color: portfolio.changePercent >= 0 ? '#4CD964' : '#D4555A' }]}>
              ({portfolio.changePercent > 0 ? '+' : ''}{portfolio.changePercent.toFixed(2)}%)
            </Text>
          </View>

          {/* Sparkline chart — data matches market direction */}
          <SparklineChart
            data={portfolio.changePercent >= 0
              ? [40, 42, 38, 45, 50, 48, 55, 52, 58, 60, 55, 62]
              : [62, 55, 58, 52, 48, 50, 45, 42, 40, 38, 35, 32]
            }
            width={280}
            height={50}
            color={portfolio.changePercent >= 0 ? '#4CD964' : '#D4555A'}
            fillColor={portfolio.changePercent >= 0 ? 'rgba(76,217,100,0.12)' : 'rgba(212,85,90,0.12)'}
            animated
          />

          {/* Time filters */}
          <View style={styles.timeFilters}>
            {TIME_FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setTimeFilter(f)}
                style={[styles.timeFilterBtn, timeFilter === f && styles.timeFilterActive]}
              >
                <Text style={[styles.timeFilterText, timeFilter === f && styles.timeFilterTextActive]}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          </LinearGradient>
        </HeroShimmer>

        {/* Flare Wallet Hero */}
        <HomeCardHero />

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {HOME_TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setHomeTab(tab)}
              style={[styles.tabBtn, homeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, homeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Wallet list */}
        {homeTab === 'Wallets' && (
          <View style={styles.walletList}>
            {WALLETS.map((wallet, idx) => {
              const token = TOKENS.find(t => t.symbol === wallet.symbol);
              const livePrice = prices[wallet.symbol];
              const displayPrice = livePrice ? livePrice.price : wallet.price;
              const displayChange = livePrice ? livePrice.change24h : wallet.change;
              const isPositive = displayChange >= 0;
              const cardAnim = staggerAnims[idx];
              const translateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
              const opacity = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
              return (
                <Animated.View key={wallet.symbol} style={{ transform: [{ translateY }], opacity }}>
                <GlowPulse color={wallet.color} duration={2500} minOpacity={0.08} maxOpacity={0.2} radius={10} offsetY={2}>
                <SpringPress
                  onPress={() => navigation.navigate('WalletDetail', { symbol: wallet.symbol })}
                >
                  <View style={styles.walletCard}>
                    {/* Left column: icon + coin amount */}
                    <View style={styles.walletLeft}>
                      {token ? (
                        <TokenIcon token={token} size={44} />
                      ) : (
                        <View style={[styles.walletIconPlaceholder, { backgroundColor: wallet.color }]}>
                          <Text style={styles.walletIconText}>{wallet.symbol.charAt(0)}</Text>
                        </View>
                      )}
                      <View style={styles.walletInfo}>
                        <Text style={styles.walletName}>{wallet.name}</Text>
                        <Text style={styles.walletSymbol}>{wallet.amount} {wallet.symbol}</Text>
                      </View>
                    </View>

                    {/* Vertical divider */}
                    <View style={styles.walletDivider} />

                    {/* Right column: sparkline + fiat price + % change */}
                    <View style={styles.walletRight}>
                      <View style={styles.walletChangeRow}>
                        <SparklineChart
                          data={wallet.sparkline || [40, 42, 38, 45, 50, 48]}
                          width={40}
                          height={20}
                          color={isPositive ? '#4CD964' : '#D4555A'}
                          fillColor={isPositive ? 'rgba(76,217,100,0.12)' : 'rgba(212,85,90,0.12)'}
                          animated={false}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.walletChange, { color: isPositive ? '#4CD964' : '#D4555A' }]}>
                          {isPositive ? '+' : ''}{displayChange.toFixed(2)}%
                        </Text>
                      </View>
                      <Text style={styles.walletPrice}>
                        ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </View>
                </SpringPress>
                </GlowPulse>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* Top News tab placeholder */}
        {homeTab === 'Top News' && (
          <View style={styles.emptyTab}>
            <Text style={styles.emptyTabIcon}>📰</Text>
            <Text style={styles.emptyTabText}>Market news coming soon</Text>
          </View>
        )}

        {/* Connect tab placeholder */}
        {homeTab === 'Connect' && (
          <View style={styles.emptyTab}>
            <Text style={styles.emptyTabIcon}>🔗</Text>
            <Text style={styles.emptyTabText}>Connect with friends coming soon</Text>
          </View>
        )}
      </Animated.ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FF9F1C' },
  scrollView: { flex: 1 },
  
  // Hero gradient
  heroGradient: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  
  // Title - Flare wallet big title
  
  // Balance
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  changeAmount: { fontSize: 16, fontWeight: '600' },
  changePercent: { fontSize: 14, fontWeight: '500' },
  
  // Time filters
  timeFilters: {
    flexDirection: 'row', gap: 8, marginBottom: 4,
  },
  timeFilterBtn: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  timeFilterActive: { backgroundColor: '#FFFFFF' },
  timeFilterText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
  timeFilterTextActive: { color: '#FF9F1C' },
  
  // Tab bar
  tabBar: {
    flexDirection: 'row', backgroundColor: '#F2F2F7',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
    borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA',
  },
  tabBtn: {
    paddingHorizontal: 16, paddingVertical: 8, marginRight: 4,
    borderRadius: 20, backgroundColor: '#E5E5EA',
  },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  tabTextActive: { color: '#1C1C1E' },
  
  // Wallet list
  walletList: { backgroundColor: '#F2F2F7', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  walletCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  walletLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  walletDivider: { width: 1, alignSelf: 'stretch', backgroundColor: '#E5E5EA', marginHorizontal: 10 },
  walletRight: { flex: 1, alignItems: 'flex-end', paddingLeft: 10 },
  walletIconPlaceholder: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  walletIconText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  walletInfo: { marginLeft: 12 },
  walletName: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  walletSymbol: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  walletPrice: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  walletChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  walletChange: { fontSize: 12, fontWeight: '600' },
  
  // Empty tabs
  emptyTab: { backgroundColor: '#F2F2F7', paddingVertical: 60, alignItems: 'center' },
  emptyTabIcon: { fontSize: 40, marginBottom: 12 },
  emptyTabText: { fontSize: 16, color: '#8E8E93', fontWeight: '500' },
});

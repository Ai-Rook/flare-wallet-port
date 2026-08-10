import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, RefreshControl, Animated, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { TOKENS } from '../../constants/tokens';
import { AppContext } from '../../context/AppContext';
import TokenIcon from '../../components/TokenIcon';
import SpringPress from '../../components/SpringPress';
import CounterRoll from '../../components/CounterRoll';
import SparklineChart from '../../components/SparklineChart';
import HeroShimmer from '../../components/HeroShimmer';
import GlowPulse from '../../components/GlowPulse';
import ToastSlide from '../../components/ToastSlide';
import ScreenHeader from '../../components/ScreenHeader';
import { useLivePrices } from '../../services/LivePriceService';

// Time period filters
const TIME_FILTERS = ['All', '1y', '1m', '1w', '1d'];
const HOME_TABS = ['Assets', 'FX', 'FAssets'];

// Pre-import token icons (no dynamic require)
const BTC_ICON = require('../../assets/tokens/btc.png');
const ETH_ICON = require('../../assets/tokens/eth.png');
const XRP_ICON = require('../../assets/tokens/xrp.png');
const USDC_ICON = require('../../assets/tokens/usdc.png');

// FX currencies with live rates
const FX_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1.0 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.37 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: 157.3 },
];

// Asset wallets — Flare versions using FTSO prices
const ASSET_WALLETS = [
  { symbol: 'FBTC', name: 'Flare Bitcoin', color: '#F7931A', amount: '0.1410', sparkline: [35, 40, 38, 45, 48, 52, 50, 55, 58, 62], underlying: 'BTC', icon: BTC_ICON },
  { symbol: 'FETH', name: 'Flare Ethereum', color: '#627EEA', amount: '1.205', sparkline: [30, 32, 35, 33, 36, 38, 37, 40, 39, 41], underlying: 'ETH', icon: ETH_ICON },
  { symbol: 'FXRP', name: 'Flare XRP', color: '#23292F', amount: '1,840.00', sparkline: [55, 50, 52, 48, 45, 47, 44, 42, 40, 38], underlying: 'XRP', icon: XRP_ICON },
  { symbol: 'FLR', name: 'Flare', color: '#FFD700', amount: '1,250.00', sparkline: [40, 42, 38, 45, 50, 48, 55, 52, 58, 60], underlying: null, icon: null },
  { symbol: 'USDC', name: 'USD Coin', color: '#2775CA', amount: '5,000.00', sparkline: [50, 50, 50, 50, 50, 50, 50, 50, 50, 50], underlying: null, icon: USDC_ICON },
];

// FAssets wallets
const FASSET_WALLETS = [
  { symbol: 'FLR', name: 'Flare', color: '#FFD700', amount: '1,250.00' },
  { symbol: 'FXRP', name: 'Flare XRP', color: '#23292F', amount: '2,400.00' },
  { symbol: 'FBTC', name: 'Flare Bitcoin', color: '#F7931A', amount: '0.1410' },
  { symbol: 'FDOGE', name: 'Flare Doge', color: '#C2A633', amount: '8,500.00' },
];

function computePortfolio(prices, wallets) {
  let total = 5000; // demo USDC cash
  wallets.forEach(w => {
    const live = prices[w.underlying || w.symbol];
    if (live) {
      const amount = parseFloat(w.amount.replace(/,/g, ''));
      total += amount * live.price;
    }
  });
  const btcChange = prices.BTC?.change24h || 0;
  return {
    totalBalance: total,
    changeAmount: total * (btcChange / 100),
    changePercent: btcChange,
  };
}

export default function HomeScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('All');
  const [homeTab, setHomeTab] = useState('Assets');
  const [fxAmount, setFxAmount] = useState('100');
  const [fxFrom, setFxFrom] = useState('USD');
  const [fxTo, setFxTo] = useState('EUR');
  const scrollY = useRef(new Animated.Value(0)).current;

  const staggerAnims = useRef(ASSET_WALLETS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const animations = staggerAnims.map((anim, i) =>
      Animated.spring(anim, { toValue: 1, friction: 7, tension: 40, delay: i * 80, useNativeDriver: true })
    );
    Animated.stagger(80, animations).start();
  }, []);

  const { prices, lastUpdated, isLoading: pricesLoading } = useLivePrices();
  const portfolio = computePortfolio(prices, ASSET_WALLETS);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // FX conversion
  const fxFromRate = FX_CURRENCIES.find(c => c.code === fxFrom)?.rate || 1;
  const fxToRate = FX_CURRENCIES.find(c => c.code === fxTo)?.rate || 1;
  const fxResult = (parseFloat(fxAmount || '0') / fxFromRate * fxToRate).toFixed(2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        stickyHeaderIndices={[0]}
      >
        <ScreenHeader pageName="Flare Wallet" noBorder rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>◉</Text>
          </TouchableOpacity>
        } />

        {/* Hero — portfolio balance */}
        <HeroShimmer height={180} duration={3000}>
          <LinearGradient
            colors={['#FF6300', '#FF8C1A', '#E85D04']}
            style={styles.heroGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.3, y: 1 }}
          >
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
            <Text style={styles.oracleTag}>⚡ Prices via Flare FTSOv2</Text>
          </LinearGradient>
        </HeroShimmer>

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

        {/* Assets tab */}
        {homeTab === 'Assets' && (
          <View style={styles.walletList}>
            {ASSET_WALLETS.map((wallet, idx) => {
              const livePrice = prices[wallet.underlying || wallet.symbol];
              const displayPrice = livePrice ? livePrice.price : 0;
              const displayChange = livePrice ? livePrice.change24h : 0;
              const isPositive = displayChange >= 0;
              const cardAnim = staggerAnims[idx];
              const translateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
              const opacity = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
              return (
                <Animated.View key={wallet.symbol} style={{ transform: [{ translateY }], opacity }}>
                  <GlowPulse color={wallet.color} duration={2500} minOpacity={0.08} maxOpacity={0.2} radius={10} offsetY={2}>
                    <SpringPress onPress={() => navigation.navigate('WalletDetail', { symbol: wallet.symbol })}>
                      <View style={styles.walletCard}>
                        <View style={styles.walletLeft}>
                          {wallet.icon ? (
                            <Image source={wallet.icon} style={styles.walletIcon} />
                          ) : (
                            <View style={[styles.walletIconPlaceholder, { backgroundColor: wallet.color }]}>
                              <Text style={styles.walletIconText}>◉</Text>
                            </View>
                          )}
                          <View style={styles.walletInfo}>
                            <Text style={styles.walletName}>{wallet.name}</Text>
                            <Text style={styles.walletSymbol}>{wallet.amount} {wallet.symbol}</Text>
                          </View>
                        </View>
                        <View style={styles.walletDivider} />
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
                          {displayPrice > 0 && (
                            <Text style={styles.walletPrice}>
                              ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </Text>
                          )}
                        </View>
                      </View>
                    </SpringPress>
                  </GlowPulse>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* FX tab — currency converter */}
        {homeTab === 'FX' && (
          <View style={styles.fxContainer}>
            <View style={styles.fxCard}>
              <Text style={styles.fxTitle}>Currency Converter</Text>
              <Text style={styles.fxSubtitle}>Live rates via Flare FTSOv2</Text>

              <View style={styles.fxRow}>
                <View style={styles.fxInputWrap}>
                  <Text style={styles.fxLabel}>Amount</Text>
                  <TextInput
                    style={styles.fxInput}
                    value={fxAmount}
                    onChangeText={setFxAmount}
                    keyboardType="numeric"
                    placeholder="100"
                    placeholderTextColor="#8E8E93"
                  />
                </View>
                <View style={styles.fxCurrencyWrap}>
                  <Text style={styles.fxLabel}>From</Text>
                  <TouchableOpacity style={styles.fxCurrencyBtn} onPress={() => { const t = fxFrom; setFxFrom(fxTo); setFxTo(t); }}>
                    <Text style={styles.fxCurrencyFlag}>{FX_CURRENCIES.find(c => c.code === fxFrom)?.flag}</Text>
                    <Text style={styles.fxCurrencyCode}>{fxFrom}</Text>
                    <Text style={styles.fxSwapIcon}>⇄</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.fxDivider} />

              <View style={styles.fxRow}>
                <View style={styles.fxInputWrap}>
                  <Text style={styles.fxLabel}>Converted</Text>
                  <Text style={styles.fxResult}>{fxResult}</Text>
                </View>
                <View style={styles.fxCurrencyWrap}>
                  <Text style={styles.fxLabel}>To</Text>
                  <View style={styles.fxCurrencyBtn}>
                    <Text style={styles.fxCurrencyFlag}>{FX_CURRENCIES.find(c => c.code === fxTo)?.flag}</Text>
                    <Text style={styles.fxCurrencyCode}>{fxTo}</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.fxRate}>
                1 {fxFrom} = {(fxToRate / fxFromRate).toFixed(4)} {fxTo}
              </Text>
            </View>

            <Text style={styles.fxSectionTitle}>Currencies</Text>
            <View style={styles.fxCurrencyGrid}>
              {FX_CURRENCIES.map(c => (
                <TouchableOpacity
                  key={c.code}
                  style={[styles.fxCurrencyChip, (fxFrom === c.code || fxTo === c.code) && styles.fxCurrencyChipActive]}
                  onPress={() => setFxTo(c.code)}
                >
                  <Text style={styles.fxCurrencyChipFlag}>{c.flag}</Text>
                  <Text style={styles.fxCurrencyChipCode}>{c.code}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* FAssets tab */}
        {homeTab === 'FAssets' && (
          <View style={styles.walletList}>
            <View style={styles.fAssetInfoCard}>
              <Text style={styles.fAssetInfoTitle}>FAssets — Interoperable Assets on Flare</Text>
              <Text style={styles.fAssetInfoText}>
                FAssets are trustless, over-collateralized wrapped tokens on Flare. Mint FXRP from XRP, FBTC from Bitcoin, FDOGE from Dogecoin — all backed by Flare's decentralized infrastructure.
              </Text>
            </View>
            {FASSET_WALLETS.map((wallet) => (
              <View key={wallet.symbol} style={styles.walletCard}>
                <View style={styles.walletLeft}>
                  <View style={[styles.walletIconPlaceholder, { backgroundColor: wallet.color }]}>
                    <Text style={styles.walletIconText}>{wallet.symbol === 'FLR' ? '◉' : 'F'}</Text>
                  </View>
                  <View style={styles.walletInfo}>
                    <Text style={styles.walletName}>{wallet.name}</Text>
                    <Text style={styles.walletSymbol}>{wallet.amount} {wallet.symbol}</Text>
                  </View>
                </View>
                <View style={styles.walletDivider} />
                <View style={styles.walletRight}>
                  <Text style={styles.fAssetBadge}>
                    {wallet.symbol === 'FLR' ? 'Native' : 'FAsset'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FF6300' },
  scrollView: { flex: 1 },
  heroGradient: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  changeAmount: { fontSize: 16, fontWeight: '600' },
  changePercent: { fontSize: 14, fontWeight: '500' },
  oracleTag: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '500', marginTop: 4 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFF8F0',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
    borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA',
  },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 4, borderRadius: 20, backgroundColor: '#FFE4D1' },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  tabTextActive: { color: '#FF6300' },
  walletList: { backgroundColor: '#FFF8F0', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  walletCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    marginBottom: 10, shadowColor: '#FF6300', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  walletLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  walletDivider: { width: 1, alignSelf: 'stretch', backgroundColor: '#E5E5EA', marginHorizontal: 10 },
  walletRight: { flex: 1, alignItems: 'flex-end', paddingLeft: 10 },
  walletIcon: { width: 44, height: 44, borderRadius: 22, resizeMode: 'contain' },
  walletIconPlaceholder: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  walletIconText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  walletInfo: { marginLeft: 12 },
  walletName: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  walletSymbol: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  walletPrice: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  walletChangeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  walletChange: { fontSize: 12, fontWeight: '600' },
  fxContainer: { backgroundColor: '#FFF8F0', paddingHorizontal: 16, paddingTop: 16 },
  fxCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  fxTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  fxSubtitle: { fontSize: 12, color: '#FF6300', fontWeight: '600', marginBottom: 16 },
  fxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fxInputWrap: { flex: 1, marginRight: 12 },
  fxLabel: { fontSize: 11, color: '#8E8E93', fontWeight: '600', marginBottom: 4 },
  fxInput: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', paddingVertical: 4 },
  fxResult: { fontSize: 24, fontWeight: '700', color: '#FF6300', paddingVertical: 4 },
  fxCurrencyWrap: { width: 100 },
  fxCurrencyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F2F2F7', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  fxCurrencyFlag: { fontSize: 20 },
  fxCurrencyCode: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  fxSwapIcon: { fontSize: 16, color: '#8E8E93', marginLeft: 4 },
  fxDivider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 14 },
  fxRate: { fontSize: 12, color: '#8E8E93', fontWeight: '500', marginTop: 12 },
  fxSectionTitle: { fontSize: 14, fontWeight: '700', color: '#8E8E93', marginBottom: 8 },
  fxCurrencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 20 },
  fxCurrencyChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  fxCurrencyChipActive: { backgroundColor: '#FF6300' },
  fxCurrencyChipFlag: { fontSize: 16 },
  fxCurrencyChipCode: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  fAssetInfoCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#FF6300' },
  fAssetInfoTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  fAssetInfoText: { fontSize: 13, color: '#8E8E93', lineHeight: 18 },
  fAssetBadge: { fontSize: 11, fontWeight: '600', color: '#FF6300', backgroundColor: 'rgba(255,99,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
});

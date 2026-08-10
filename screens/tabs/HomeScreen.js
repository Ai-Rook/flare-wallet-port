import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, RefreshControl, Animated, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLivePrices } from '../../services/LivePriceService';
import {
  CRYPTO_HOLDINGS, FIAT_HOLDINGS,
  computePortfolioTotal, computePortfolioChange, getAssetUSDValue,
} from '../../constants/holdings';

const TIME_FILTERS = ['All', '1y', '1m', '1w', '1d'];
const HOME_TABS = ['Assets', 'FX', 'FAssets'];

// FX currencies — rates from holdings (USD-based)
const FX_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', rate: 1.0 },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', rate: 0.79 },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦', rate: 1.37 },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', rate: 1.52 },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', rate: 157.3 },
];

// Token icons (static imports for Metro)
const BTC_ICON = require('../../assets/tokens/btc.png');
const ETH_ICON = require('../../assets/tokens/eth.png');
const XRP_ICON = require('../../assets/tokens/xrp.png');
const USDC_ICON = require('../../assets/tokens/usdc.png');
const ICON_MAP = { FBTC: BTC_ICON, FETH: ETH_ICON, FXRP: XRP_ICON, USDC: USDC_ICON };

function formatAmount(amt) {
  if (amt >= 1000) return amt.toLocaleString('en-US', { maximumFractionDigits: 2 });
  if (amt >= 1) return amt.toFixed(4);
  return amt.toFixed(6);
}

function formatUSD(val) {
  if (val >= 1000) return '$' + val.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return '$' + val.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('All');
  const [homeTab, setHomeTab] = useState('Assets');
  const [fxAmount, setFxAmount] = useState('100');
  const [fxFrom, setFxFrom] = useState('USD');
  const [fxTo, setFxTo] = useState('EUR');
  const scrollY = useRef(new Animated.Value(0)).current;

  const staggerAnims = useRef(CRYPTO_HOLDINGS.map(() => new Animated.Value(0))).current;
  useEffect(() => {
    const animations = staggerAnims.map((anim, i) =>
      Animated.spring(anim, { toValue: 1, friction: 7, tension: 40, delay: i * 80, useNativeDriver: true })
    );
    Animated.stagger(80, animations).start();
  }, []);

  const { prices, lastUpdated, isLoading, source } = useLivePrices();
  const portfolio = {
    totalBalance: computePortfolioTotal(prices),
    ...computePortfolioChange(prices),
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  // FX conversion
  const fxFromRate = FX_CURRENCIES.find(c => c.code === fxFrom)?.rate || 1;
  const fxToRate = FX_CURRENCIES.find(c => c.code === fxTo)?.rate || 1;
  const fxResult = (parseFloat(fxAmount || '0') / fxFromRate * fxToRate).toFixed(2);

  const sourceLabel = source === 'ftso-proxy' ? '⚡ Live via Flare FTSOv2'
    : source === 'ftso-direct' ? '⚡ Live via Flare FTSOv2'
    : source === 'fallback' ? '📊 Demo prices (FTSO offline)'
    : 'Loading prices...';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FF6300" />}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.headerBar}>
          <Text style={styles.headerBrand}>🍊 Flare Wallet</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>◉</Text>
          </TouchableOpacity>
        </View>

        {/* Hero — portfolio balance */}
        <View style={styles.heroCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{formatUSD(portfolio.totalBalance)}</Text>
          <View style={styles.changeRow}>
            <Text style={[styles.changeAmount, { color: portfolio.changePercent >= 0 ? '#2ECC71' : '#E74C3C' }]}>
              {portfolio.changePercent >= 0 ? '↑' : '↓'} {formatUSD(Math.abs(portfolio.changeAmount))}
            </Text>
            <Text style={[styles.changePercent, { color: portfolio.changePercent >= 0 ? '#2ECC71' : '#E74C3C' }]}>
              ({portfolio.changePercent > 0 ? '+' : ''}{portfolio.changePercent.toFixed(2)}%)
            </Text>
          </View>
          <Text style={styles.oracleTag}>{sourceLabel}</Text>
        </View>

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
            {/* Fiat summary row */}
            {FIAT_HOLDINGS.map((f) => {
              const usdValue = f.amount / f.rate;
              return (
                <View key={f.code} style={styles.walletCard}>
                  <View style={styles.walletLeft}>
                    <Text style={styles.flagIcon}>{f.flag}</Text>
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{f.name}</Text>
                      <Text style={styles.walletSymbol}>{f.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })} {f.code}</Text>
                    </View>
                  </View>
                  <View style={styles.walletRight}>
                    <Text style={styles.walletPrice}>{formatUSD(usdValue)}</Text>
                  </View>
                </View>
              );
            })}
            {/* Crypto holdings */}
            {CRYPTO_HOLDINGS.map((wallet, idx) => {
              const key = wallet.underlying || wallet.symbol;
              const livePrice = prices[key];
              const usdValue = getAssetUSDValue(wallet, prices);
              const change = livePrice ? livePrice.change24h : 0;
              const isPositive = change >= 0;
              const cardAnim = staggerAnims[idx];
              const translateY = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
              const opacity = cardAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
              return (
                <Animated.View key={wallet.symbol} style={{ transform: [{ translateY }], opacity }}>
                  <TouchableOpacity
                    style={styles.walletCard}
                    onPress={() => navigation.navigate('WalletDetail', { symbol: wallet.symbol })}
                  >
                    <View style={styles.walletLeft}>
                      {ICON_MAP[wallet.symbol] ? (
                        <Image source={ICON_MAP[wallet.symbol]} style={styles.walletIcon} />
                      ) : (
                        <View style={[styles.walletIconPlaceholder, { backgroundColor: wallet.color }]}>
                          <Text style={styles.walletIconText}>{wallet.symbol === 'FLR' ? '◉' : wallet.symbol[0]}</Text>
                        </View>
                      )}
                      <View style={styles.walletInfo}>
                        <Text style={styles.walletName}>{wallet.name}</Text>
                        <Text style={styles.walletSymbol}>{formatAmount(wallet.amount)} {wallet.symbol}</Text>
                      </View>
                    </View>
                    <View style={styles.walletRight}>
                      {livePrice ? (
                        <>
                          <Text style={styles.walletPrice}>{formatUSD(usdValue)}</Text>
                          <Text style={[styles.walletChange, { color: isPositive ? '#2ECC71' : '#E74C3C' }]}>
                            {isPositive ? '+' : ''}{change.toFixed(2)}%
                          </Text>
                        </>
                      ) : (
                        <Text style={styles.walletPriceMuted}>—</Text>
                      )}
                    </View>
                  </TouchableOpacity>
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
                    placeholderTextColor="#9E8E83"
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

              <Text style={styles.fxRate}>1 {fxFrom} = {(fxToRate / fxFromRate).toFixed(4)} {fxTo}</Text>
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
            {CRYPTO_HOLDINGS.filter(w => w.symbol !== 'USDC' && w.symbol !== 'FLR').map((wallet) => {
              const key = wallet.underlying || wallet.symbol;
              const livePrice = prices[key];
              const usdValue = getAssetUSDValue(wallet, prices);
              return (
                <View key={wallet.symbol} style={styles.walletCard}>
                  <View style={styles.walletLeft}>
                    <View style={[styles.walletIconPlaceholder, { backgroundColor: wallet.color }]}>
                      <Text style={styles.walletIconText}>F</Text>
                    </View>
                    <View style={styles.walletInfo}>
                      <Text style={styles.walletName}>{wallet.name}</Text>
                      <Text style={styles.walletSymbol}>{formatAmount(wallet.amount)} {wallet.symbol}</Text>
                    </View>
                  </View>
                  <View style={styles.walletRight}>
                    {livePrice && <Text style={styles.walletPrice}>{formatUSD(usdValue)}</Text>}
                    <Text style={styles.fAssetBadge}>FAsset</Text>
                  </View>
                </View>
              );
            })}
            {/* FLR as native */}
            <View style={styles.walletCard}>
              <View style={styles.walletLeft}>
                <View style={[styles.walletIconPlaceholder, { backgroundColor: '#FFD700' }]}>
                  <Text style={styles.walletIconText}>◉</Text>
                </View>
                <View style={styles.walletInfo}>
                  <Text style={styles.walletName}>Flare</Text>
                  <Text style={styles.walletSymbol}>{formatAmount(1250)} FLR</Text>
                </View>
              </View>
              <View style={styles.walletRight}>
                {prices.FLR && <Text style={styles.walletPrice}>{formatUSD(1250 * prices.FLR.price)}</Text>}
                <Text style={styles.fAssetBadge}>Native</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FF6300' },
  scrollView: { flex: 1, backgroundColor: '#FFF8F0' },
  headerBar: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, backgroundColor: '#FF6300',
  },
  headerBrand: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  heroCard: {
    backgroundColor: '#FF6300',
    paddingHorizontal: 20, paddingBottom: 20, paddingTop: 8,
  },
  balanceLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 4 },
  balanceValue: { color: '#FFF', fontSize: 36, fontWeight: '700', marginBottom: 6 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  changeAmount: { fontSize: 16, fontWeight: '600' },
  changePercent: { fontSize: 14, fontWeight: '500' },
  oracleTag: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '500', marginTop: 2 },
  tabBar: {
    flexDirection: 'row', backgroundColor: '#FFF8F0',
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4,
  },
  tabBtn: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 4, borderRadius: 20, backgroundColor: '#FFE4D1' },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#FF6300', shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#9E8E83' },
  tabTextActive: { color: '#FF6300' },
  walletList: { backgroundColor: '#FFF8F0', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 20 },
  walletCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    marginBottom: 10, shadowColor: '#FF6300', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  walletLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 },
  walletRight: { alignItems: 'flex-end', paddingLeft: 10 },
  walletIcon: { width: 44, height: 44, borderRadius: 22, resizeMode: 'contain' },
  walletIconPlaceholder: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  walletIconText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  flagIcon: { fontSize: 28, marginRight: 12, width: 40, textAlign: 'center' },
  walletInfo: { marginLeft: 12, flex: 1 },
  walletName: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  walletSymbol: { fontSize: 12, color: '#6B5B50', marginTop: 1 },
  walletPrice: { fontSize: 16, fontWeight: '700', color: '#1A1A1A' },
  walletPriceMuted: { fontSize: 16, fontWeight: '700', color: '#9E8E83' },
  walletChange: { fontSize: 12, fontWeight: '600', marginTop: 2 },
  fxContainer: { backgroundColor: '#FFF8F0', paddingHorizontal: 16, paddingTop: 16 },
  fxCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16 },
  fxTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', marginBottom: 4 },
  fxSubtitle: { fontSize: 12, color: '#FF6300', fontWeight: '600', marginBottom: 16 },
  fxRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fxInputWrap: { flex: 1, marginRight: 12 },
  fxLabel: { fontSize: 11, color: '#9E8E83', fontWeight: '600', marginBottom: 4 },
  fxInput: { fontSize: 24, fontWeight: '700', color: '#1A1A1A', paddingVertical: 4 },
  fxResult: { fontSize: 24, fontWeight: '700', color: '#FF6300', paddingVertical: 4 },
  fxCurrencyWrap: { width: 100 },
  fxCurrencyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF8F0', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  fxCurrencyFlag: { fontSize: 20 },
  fxCurrencyCode: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  fxSwapIcon: { fontSize: 16, color: '#9E8E83', marginLeft: 4 },
  fxDivider: { height: 1, backgroundColor: '#FFE4D1', marginVertical: 14 },
  fxRate: { fontSize: 12, color: '#9E8E83', fontWeight: '500', marginTop: 12 },
  fxSectionTitle: { fontSize: 14, fontWeight: '700', color: '#9E8E83', marginBottom: 8 },
  fxCurrencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 20 },
  fxCurrencyChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  fxCurrencyChipActive: { backgroundColor: '#FF6300' },
  fxCurrencyChipFlag: { fontSize: 16 },
  fxCurrencyChipCode: { fontSize: 13, fontWeight: '600', color: '#1A1A1A' },
  fAssetInfoCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#FF6300' },
  fAssetInfoTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  fAssetInfoText: { fontSize: 13, color: '#6B5B50', lineHeight: 18 },
  fAssetBadge: { fontSize: 11, fontWeight: '600', color: '#FF6300', backgroundColor: 'rgba(255,99,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 4 },
});

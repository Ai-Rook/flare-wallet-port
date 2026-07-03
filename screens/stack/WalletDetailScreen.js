import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import TokenIcon from '../../components/TokenIcon';
import PortfolioHero from '../../components/PortfolioHero';
import { TOKENS, getTokenBySymbol } from '../../constants/tokens';
import { AppContext } from '../../context/AppContext';
import { useLivePrices } from '../../services/LivePriceService';

export default function WalletDetailScreen({ navigation, route }) {
  const symbol = route.params?.symbol || 'BTC';
  const token = getTokenBySymbol(symbol);
  const { user } = useContext(AppContext);
  const { prices } = useLivePrices();
  const livePrice = prices[symbol];
  const coinAmount = symbol === 'BTC' ? 0.141 : symbol === 'ETH' ? 1.205 : symbol === 'XRP' ? 1840 : symbol === 'SOL' ? 32.1 : symbol === 'LTC' ? 48.5 : symbol === 'BNB' ? 2.34 : 0;
  const fiatValue = livePrice ? (coinAmount * livePrice.price) : 0;
  const change24h = livePrice?.change24h || 0;
  const isPositive = change24h >= 0;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 6, tension: 40, useNativeDriver: true }),
    ]).start();
  }, []);

  const actions = [
    { label: 'Buy', icon: '📈', screen: 'BuySell', params: { side: 'buy', symbol } },
    { label: 'Sell', icon: '📉', screen: 'BuySell', params: { side: 'sell', symbol } },
    { label: 'Send', icon: '📤', screen: 'Send', params: { symbol } },
    { label: 'Receive', icon: '📥', screen: 'Receive', params: { symbol } },
    { label: 'Exchange', icon: '🔄', screen: 'Exchange', params: { fromAsset: symbol } },
  ];

  // Mock transaction history
  const transactions = [
    { type: 'Received', amount: '+0.005', date: 'Jun 28', color: '#4CD964' },
    { type: 'Sent', amount: '-0.012', date: 'Jun 25', color: '#D4555A' },
    { type: 'Bought', amount: '+0.020', date: 'Jun 22', color: '#4CD964' },
    { type: 'Exchange', amount: '0.033 → ETH', date: 'Jun 18', color: '#5856D6' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader pageName={token?.name || symbol} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Portfolio Hero — card + coin shadow composition */}
          <PortfolioHero
            symbol={symbol}
            price={livePrice ? `$${livePrice.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
            change24h={change24h}
            holdings={`${coinAmount.toFixed(4)} ${symbol}`}
            fiatValue={fiatValue ? `$${fiatValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          />

          {/* Quick action buttons */}
          <View style={styles.actionsRow}>
            {actions.map((a, i) => (
              <SpringPress key={i} style={styles.actionBtn} onPress={() => navigation.navigate(a.screen, a.params || {})} activeScale={0.93}>
                <View style={styles.actionBtnInner}>
                  <Text style={styles.actionIcon}>{a.icon}</Text>
                  <Text style={styles.actionLabel}>{a.label}</Text>
                </View>
              </SpringPress>
            ))}
          </View>

          {/* About section */}
          <View style={styles.aboutCard}>
            <Text style={styles.sectionTitle}>About {token?.name || symbol}</Text>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Price</Text>
              <Text style={styles.aboutValue}>
                ${livePrice ? livePrice.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}
              </Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>24h Change</Text>
              <Text style={[styles.aboutValue, { color: isPositive ? '#4CD964' : '#D4555A' }]}>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}%
              </Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>Market Cap</Text>
              <Text style={styles.aboutValue}>$1.2T</Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>Rank</Text>
              <Text style={styles.aboutValue}>#1</Text>
            </View>
          </View>

          {/* Transaction history */}
          <View style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.map((tx, i) => (
              <View key={i} style={[styles.txRow, i < transactions.length - 1 && styles.txBorder]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={[styles.txIconCircle, { backgroundColor: tx.color + '22' }]}>
                    <Text style={{ fontSize: 14, color: tx.color, fontWeight: '700' }}>
                      {tx.type === 'Received' ? '↓' : tx.type === 'Sent' ? '↑' : tx.type === 'Bought' ? '↓' : '⇄'}
                    </Text>
                  </View>
                  <Text style={styles.txType}>{tx.type}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.txAmount, { color: tx.color }]}>{tx.amount} {symbol}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
              </View>
            ))}
          </View>

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    height: 64, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingTop: 4,
  },
  backBtn: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { color: '#FFF', fontSize: 26, fontWeight: '400' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '700', marginLeft: 8 },
  iconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  balanceCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 24, marginBottom: 16,
    alignItems: 'center', shadowColor: '#5856D6', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
  },
  balanceLabel: { fontSize: 13, color: '#8E8E93', fontWeight: '500', marginBottom: 4, textTransform: 'uppercase' },
  balanceValue: { fontSize: 34, fontWeight: '700', color: '#1C3040', marginBottom: 4 },
  balanceFiat: { fontSize: 16, color: '#8E8E93', marginBottom: 8 },
  changeRow: { flexDirection: 'row', alignItems: 'center' },
  changeText: { fontSize: 15, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, gap: 8 },
  actionBtn: { flex: 1 },
  actionBtnInner: {
    alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  actionIcon: { fontSize: 22, marginBottom: 4 },
  actionLabel: { fontSize: 12, fontWeight: '600', color: '#1C3040' },
  aboutCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1C3040', marginBottom: 12 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  aboutBorder: { borderTopWidth: 1, borderTopColor: '#F2F2F7' },
  aboutLabel: { fontSize: 14, color: '#8E8E93' },
  aboutValue: { fontSize: 14, fontWeight: '600', color: '#1C3040' },
  historyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 24,
  },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  txIconCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  txType: { fontSize: 15, fontWeight: '600', color: '#1C3040' },
  txAmount: { fontSize: 15, fontWeight: '600' },
  txDate: { fontSize: 12, color: '#8E8E93', marginTop: 2 },
});

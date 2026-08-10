import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon, { FASSET_UNDERLYING } from '../../components/FlareTokenIcon';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import { CRYPTO_HOLDINGS, getAssetUSDValue } from '../../constants/holdings';
import { AppContext } from '../../context/AppContext';
import { useLivePrices } from '../../services/LivePriceService';

export default function WalletDetailScreen({ navigation, route }) {
  const symbol = route.params?.symbol || 'BTC';
  const { prices } = useLivePrices();

  // Find the holding from shared holdings (single source of truth)
  const holding = CRYPTO_HOLDINGS.find(h => h.symbol === symbol);
  const coinAmount = holding?.amount || 0;

  // Fix price lookup: FAssets (FBTC, FXRP, etc.) need to look up underlying symbol
  const priceKey = FASSET_UNDERLYING[symbol] || symbol;
  const livePrice = prices[priceKey];
  const price = livePrice?.price || 0;
  const fiatValue = coinAmount * price;
  const change24h = livePrice?.change24h || 0;
  const isPositive = change24h >= 0;
  const tokenName = holding?.name || symbol;

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
    { label: 'Swap', icon: '🔄', screen: 'Exchange', params: { fromAsset: symbol } },
  ];

  // Mock transaction history
  const transactions = [
    { type: 'Received', amount: '+0.005', date: 'Aug 8', color: Colors.success },
    { type: 'Sent', amount: '-0.012', date: 'Aug 5', color: Colors.error },
    { type: 'Bought', amount: '+0.020', date: 'Aug 2', color: Colors.success },
    { type: 'Swap', amount: '0.033 → ETH', date: 'Jul 28', color: Colors.primary },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName={tokenName} onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Price Hero — uses FlareTokenIcon, no clip art */}
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <FlareTokenIcon symbol={symbol} size={64} color={Colors.primary} />
              <View style={styles.heroPriceCol}>
                <Text style={styles.heroSymbol}>{symbol}</Text>
                <Text style={styles.heroPrice}>
                  ${price > 0 ? price.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '—'}
                </Text>
                <Text style={[styles.heroChange, { color: isPositive ? Colors.success : Colors.error }]}>
                  {isPositive ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
                </Text>
              </View>
            </View>

            <View style={styles.holdingsRow}>
              <View style={styles.holdingsBox}>
                <Text style={styles.holdingsLabel}>Your Holdings</Text>
                <Text style={styles.holdingsAmount}>{coinAmount.toLocaleString()} {symbol}</Text>
                <Text style={styles.holdingsFiat}>≈ ${fiatValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
              </View>
            </View>
          </View>

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
            <Text style={styles.sectionTitle}>About {tokenName}</Text>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>Live Price</Text>
              <Text style={styles.aboutValue}>
                ${price > 0 ? price.toLocaleString('en-US', { maximumFractionDigits: 4 }) : '—'}
              </Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>24h Change</Text>
              <Text style={[styles.aboutValue, { color: isPositive ? Colors.success : Colors.error }]}>
                {isPositive ? '+' : ''}{change24h.toFixed(2)}%
              </Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>Your Balance</Text>
              <Text style={styles.aboutValue}>{coinAmount} {symbol}</Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>USD Value</Text>
              <Text style={styles.aboutValue}>${fiatValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</Text>
            </View>
            <View style={[styles.aboutRow, styles.aboutBorder]}>
              <Text style={styles.aboutLabel}>Price Source</Text>
              <Text style={styles.aboutValue}>{livePrice ? '🔥 FTSOv2 Oracle' : 'Demo'}</Text>
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
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1 },
  heroCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  heroTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  heroPriceCol: { flex: 1, marginLeft: 16 },
  heroSymbol: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 4 },
  heroPrice: { fontSize: 32, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  heroChange: { fontSize: 16, fontWeight: '600' },
  holdingsRow: { marginTop: 8 },
  holdingsBox: { backgroundColor: Colors.background, borderRadius: 14, padding: 16 },
  holdingsLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  holdingsAmount: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  holdingsFiat: { fontSize: 14, color: Colors.textSecondary },
  actionsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 16 },
  actionBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  actionBtnInner: { alignItems: 'center' },
  actionIcon: { fontSize: 20, marginBottom: 4 },
  actionLabel: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  aboutCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  aboutBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  aboutLabel: { fontSize: 14, color: Colors.textSecondary },
  aboutValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  historyCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  txBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  txIconCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txType: { fontSize: 14, fontWeight: '500', color: Colors.text },
  txAmount: { fontSize: 14, fontWeight: '700' },
  txDate: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
});

import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, StatusBar, Animated, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import TxPopup from '../../components/TxPopup';
import { TOKENS } from '../../constants/tokens';

// Spend-style confirmation & result patterns
const CRYPTO_PAIRS = [
  { from: 'BTC', to: 'ETH', rate: '1 BTC = 18.24 ETH' },
  { from: 'ETH', to: 'XRP', rate: '1 ETH = 6,532 XRP' },
  { from: 'BTC', to: 'SOL', rate: '1 BTC = 419.5 SOL' },
  { from: 'SOL', to: 'ETH', rate: '1 SOL = 0.043 ETH' },
];

const CRYPTO_META = {
  BTC: { color: '#FF9500', badge: '#FF9500' },
  ETH: { color: '#627EEA', badge: '#627EEA' },
  XRP: { color: '#23292F', badge: '#23292F' },
  SOL: { color: '#9945FF', badge: '#9945FF' },
  LTC: { color: '#345D9D', badge: '#345D9D' },
};

function CryptoIcon({ symbol, size = 40 }) {
  const c = CRYPTO_META[symbol] || CRYPTO_META.BTC;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: c.color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#FFF', fontSize: size * 0.4, fontWeight: '700' }}>{symbol.charAt(0)}</Text>
    </View>
  );
}

function CryptoBadge({ symbol, small }) {
  const c = CRYPTO_META[symbol] || CRYPTO_META.BTC;
  return (
    <View style={{ backgroundColor: c.badge, borderRadius: 6, paddingHorizontal: small ? 6 : 10, paddingVertical: small ? 2 : 4, marginLeft: 6 }}>
      <Text style={{ color: '#FFF', fontSize: small ? 9 : 12, fontWeight: '700', letterSpacing: 0.5 }}>{symbol}</Text>
    </View>
  );
}

export default function ExchangeScreen({ navigation }) {
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [step, setStep] = useState('form'); // form → confirm → done
  const [swapAnim] = useState(new Animated.Value(0));

  const swapPair = () => {
    Animated.sequence([
      Animated.timing(swapAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.timing(swapAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      const temp = fromCrypto;
      setFromCrypto(toCrypto);
      setToCrypto(temp);
    });
  };

  const rotateInterp = swapAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

  const toAmount = fromAmount ? (parseFloat(fromAmount) * 18.24).toFixed(4) : '0.00';
  const rate = `1 ${fromCrypto} = 18.24 ${toCrypto}`;

  const [showTxResult, setShowTxResult] = useState(false);

  const txDetails = [
    { label: 'Exchanging', value: `${fromAmount || '0.00'} ${fromCrypto}` },
    { label: 'Receiving', value: `${toAmount} ${toCrypto}` },
    { label: 'Rate', value: rate },
    { label: 'Fee', value: '0.5%' },
    { label: 'Total', value: `${fromAmount || '0.00'} ${fromCrypto}`, highlight: true },
  ];

  // ─── SUCCESS / FAIL SCREEN ───
  if (step === 'done') {
    const success = Math.random() > 0.15;
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        {/* TxPopup — Spend-style transaction result */}
        <TxPopup
          visible={true}
          type="exchanged"
          amount={fromAmount || '0.00'}
          badge={fromCrypto}
          badgeColor={CRYPTO_COLORS[fromCrypto] || '#FF9500'}
          details={txDetails}
          onDismiss={() => { setStep('form'); navigation.goBack?.(); }}
        />
      </SafeAreaView>
    );
  }

  // ─── CONFIRM BOTTOM SHEET ───
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        {/* Dimmed background */}
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
          {/* Modal sheet */}
          <View style={styles.sheetCard}>
            {/* Drag handle */}
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#C7C7CC', alignSelf: 'center', marginTop: 8, marginBottom: 12 }} />

            {/* Header row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 }}>
              <TouchableOpacity onPress={() => setStep('form')}>
                <Text style={{ fontSize: 24, color: '#1C3040' }}>‹</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#1C3040' }}>Confirm</Text>
              <TouchableOpacity onPress={() => setStep('form')}>
                <Text style={{ fontSize: 18, color: '#1C3040' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 1, backgroundColor: '#E5E5EA', marginBottom: 20 }} />

            {/* Exchange icon row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <CryptoIcon symbol={fromCrypto} size={36} />
              <View style={{ width: 28, alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: '#8E8E93' }}>⇄</Text>
              </View>
              <CryptoIcon symbol={toCrypto} size={36} />
            </View>

            {/* Amount */}
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <Text style={{ fontSize: 32, fontWeight: '700', color: '#1C3040' }}>{fromAmount || '0.00'}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <CryptoBadge symbol={fromCrypto} small />
                <Text style={{ fontSize: 14, color: '#8E8E93', marginLeft: 8 }}>$ {(parseFloat(fromAmount || 0) * 62450).toFixed(2)}</Text>
              </View>
            </View>

            {/* Transaction Details label */}
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#8E8E93', marginLeft: 16, marginTop: 16, marginBottom: 6 }}>Transaction Details</Text>

            {/* White details card */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 14, marginBottom: 12 }}>
              {[
                ['Exchanging', `${fromAmount || '0.00'} ${fromCrypto}`],
                ['Receiving', `${toAmount} ${toCrypto}`],
                ['Rate', rate],
                ['Fee', '0.5%'],
                ['Estimated Time', '~2 minutes'],
                ['Total', `${fromAmount || '0.00'} ${fromCrypto}`],
              ].map(([label, value], i, arr) => (
                <View key={label} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={[styles.detailValue, i === arr.length - 1 && { color: '#1E95EA', fontWeight: '700' }]}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Confirm button — blue like Spend */}
            <SpringPress onPress={() => setStep('done')} activeScale={0.95}>
              <View style={{ backgroundColor: '#1E95EA', borderRadius: 16, paddingVertical: 18, marginHorizontal: 16, alignItems: 'center', marginBottom: 8, shadowColor: '#1E95EA', shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Confirm with Face ID</Text>
              </View>
            </SpringPress>

            <TouchableOpacity onPress={() => setStep('form')} style={{ alignItems: 'center', paddingVertical: 10, marginBottom: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#8E8E93' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── MAIN FORM ───
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName="Exchange" onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* From card */}
        <View style={styles.exchangeCard}>
          <View style={styles.exchangeCardHeader}>
            <Text style={styles.exchangeLabel}>You are exchanging</Text>
            <TouchableOpacity onPress={() => {}} style={styles.cryptoSelectBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CryptoIcon symbol={fromCrypto} size={20} />
                <Text style={styles.cryptoSelectText}>{fromCrypto} ▾</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
            />
            <CryptoBadge symbol={fromCrypto} />
          </View>
          <Text style={styles.balanceHint}>Available: 0.00 {fromCrypto} · $0.00</Text>
        </View>

        {/* Swap button */}
        <View style={styles.swapRow}>
          <View style={styles.swapLine} />
          <SpringPress onPress={swapPair} activeScale={0.85}>
            <Animated.View style={[styles.swapBtn, { transform: [{ rotate: rotateInterp }] }]}>
              <Text style={styles.swapIcon}>⇅</Text>
            </Animated.View>
          </SpringPress>
          <View style={styles.swapLine} />
        </View>

        {/* To card */}
        <View style={[styles.exchangeCard, { marginBottom: 16 }]}>
          <View style={styles.exchangeCardHeader}>
            <Text style={styles.exchangeLabel}>You will receive</Text>
            <TouchableOpacity onPress={() => {}} style={styles.cryptoSelectBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CryptoIcon symbol={toCrypto} size={20} />
                <Text style={styles.cryptoSelectText}>{toCrypto} ▾</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.toAmount}>{toAmount}</Text>
            <CryptoBadge symbol={toCrypto} />
          </View>
          <Text style={styles.rateHint}>{rate}</Text>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          {[
            ['Exchange Rate', rate],
            ['Fee', '0.5%'],
            ['Estimated Time', '~2 minutes'],
            ['Min. Amount', '0.001 ' + fromCrypto],
          ].map(([l, v]) => (
            <View key={l} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l}</Text>
              <Text style={styles.infoValue}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Quick pairs */}
        <Text style={styles.sectionTitle}>Popular Pairs</Text>
        {CRYPTO_PAIRS.map((pair, i) => (
          <SpringPress key={i} onPress={() => { setFromCrypto(pair.from); setToCrypto(pair.to); }} activeScale={0.97}>
            <View style={styles.pairRow}>
              <CryptoIcon symbol={pair.from} size={24} />
              <Text style={styles.pairFrom}>{pair.from}</Text>
              <Text style={styles.pairArrow}>→</Text>
              <CryptoIcon symbol={pair.to} size={24} />
              <Text style={styles.pairTo}>{pair.to}</Text>
              <Text style={styles.pairRate}>{pair.rate}</Text>
            </View>
          </SpringPress>
        ))}

        {/* Exchange button */}
        <SpringPress onPress={() => setStep('confirm')} activeScale={0.95}>
          <View style={{ backgroundColor: '#1E95EA', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 16, marginBottom: 20, shadowColor: '#1E95EA', shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 }}>EXCHANGE</Text>
          </View>
        </SpringPress>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4FAFC' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { padding: 8 },
  backIcon: { color: '#FFF', fontSize: 22 },
  headerBrand: { color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  headerPage: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '400' },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Exchange cards
  exchangeCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  exchangeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exchangeLabel: { fontSize: 13, fontWeight: '600', color: '#9AA4AA' },
  cryptoSelectBtn: { backgroundColor: '#F4FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  cryptoSelectText: { fontSize: 14, fontWeight: '700', color: '#1C3040', marginLeft: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '700', color: '#1C3040' },
  toAmount: { flex: 1, fontSize: 32, fontWeight: '700', color: '#1C3040' },
  balanceHint: { fontSize: 12, color: '#9AA4AA' },
  rateHint: { fontSize: 12, color: '#55D987', fontWeight: '600' },

  // Swap button
  swapRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  swapLine: { flex: 1, height: 1, backgroundColor: '#E5E5EA' },
  swapBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E95EA',
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 12,
    shadowColor: '#1E95EA', shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  swapIcon: { color: '#FFF', fontSize: 20, fontWeight: '700' },

  // Info card
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: 14, color: '#9AA4AA' },
  infoValue: { fontSize: 14, fontWeight: '600', color: '#1C3040' },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#9AA4AA', marginBottom: 8, marginTop: 4 },

  // Pairs
  pairRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 12, padding: 12, marginBottom: 6,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  pairFrom: { fontSize: 15, fontWeight: '700', color: '#1C3040', marginLeft: 8, width: 40 },
  pairArrow: { fontSize: 16, color: '#9AA4AA', marginHorizontal: 4 },
  pairTo: { fontSize: 15, fontWeight: '700', color: '#1E95EA', marginLeft: 8, width: 40 },
  pairRate: { flex: 1, fontSize: 13, color: '#9AA4AA', textAlign: 'right' },

  // Sheet / Confirm
  sheetCard: {
    backgroundColor: '#F4FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingBottom: 20, maxHeight: '92%',
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA',
  },
  detailLabel: { fontSize: 14, color: '#9AA4AA' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1C3040' },
});

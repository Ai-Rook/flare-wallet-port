import ScreenHeader from '../../components/ScreenHeader';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import TxPopup from '../../components/TxPopup';

const CRYPTO_META = {
  BTC: { color: '#FF9500' }, ETH: { color: '#627EEA' }, XRP: { color: '#23292F' },
  SOL: { color: '#9945FF' }, LTC: { color: '#345D9D' },
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
    <View style={{ backgroundColor: c.color, borderRadius: 6, paddingHorizontal: small ? 6 : 10, paddingVertical: small ? 2 : 4, marginLeft: 6 }}>
      <Text style={{ color: '#FFF', fontSize: small ? 9 : 12, fontWeight: '700', letterSpacing: 0.5 }}>{symbol}</Text>
    </View>
  );
}

const PAYMENT_METHODS = [
  { id: 'ach', label: 'ACH Transfer', icon: '🏛️', detail: 'Bank of America ****4521', fee: 'Free', time: '3-5 days' },
  { id: 'wire', label: 'Wire Transfer', icon: '🔗', detail: 'Direct bank wire', fee: '$25', time: '1-2 days' },
  { id: 'usd', label: 'USD Account', icon: '💲', detail: 'Balance: $12,450.00', fee: 'Free', time: 'Instant' },
];

const CRYPTO_OPTIONS = ['BTC', 'ETH', 'XRP', 'SOL', 'LTC'];

export default function BuySellScreen({ navigation, route }) {
  const initialSide = route.params?.side || 'buy';
  const [side, setSide] = useState(initialSide);
  const [crypto, setCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('usd');
  const [step, setStep] = useState('form');
  const [slideAnim] = useState(new Animated.Value(0));

  const switchSide = (newSide) => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: newSide === 'sell' ? -300 : 300, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setSide(newSide));
  };

  const isBuy = side === 'buy';
  const accentColor = isBuy ? '#4CD964' : '#D4555A';

  // ─── SUCCESS SCREEN — Flare style ───
  if (step === 'complete') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <TxPopup
          visible={true}
          type={isBuy ? 'bought' : 'sold'}
          amount={amount || '0.00'}
          badge={crypto}
          badgeColor={CRYPTO_META[crypto]?.color || '#FF9500'}
          details={[
            { label: 'Amount', value: `$${(parseFloat(amount || 0) * 62450).toFixed(2)}` },
            { label: 'Price', value: `$62,450.00` },
            { label: 'Payment Method', value: 'USD Account' },
            { label: 'Fee', value: 'Free' },
            { label: 'Total', value: `$${(parseFloat(amount || 0) * 62450).toFixed(2)}`, highlight: true },
          ]}
          onDismiss={() => { setStep('form'); navigation.goBack?.(); }}
        />
      </SafeAreaView>
    );
  }

  // ─── CONFIRM BOTTOM SHEET — Flare style ───
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
          <View style={styles.sheetCard}>
            {/* Drag handle */}
            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#C7C7CC', alignSelf: 'center', marginTop: 8, marginBottom: 12 }} />

            {/* Header */}
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

            {/* Crypto icon */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <CryptoIcon symbol={crypto} size={44} />
            </View>

            {/* Amount */}
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 32, fontWeight: '700', color: '#1C3040' }}>{amount || '0.00'}</Text>
                <CryptoBadge symbol={crypto} small />
              </View>
            </View>

            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9AA4AA', marginLeft: 16, marginTop: 16, marginBottom: 6 }}>Transaction Details</Text>

            {/* White details card */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 14, marginBottom: 12 }}>
              {[
                ['Rate', '$62,450.00'],
                ['Price', `$${(parseFloat(amount || 0) * 62450).toFixed(2)}`],
                ['Payment Method', PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label || 'USD'],
                ['Available In', PAYMENT_METHODS.find(p => p.id === paymentMethod)?.time || 'Instant'],
                ['Fee', PAYMENT_METHODS.find(p => p.id === paymentMethod)?.fee || 'Free'],
                ['Total', `$${(parseFloat(amount || 0) * 62450 * (paymentMethod === 'wire' ? 1.0004 : 1)).toFixed(2)}`],
              ].map(([label, value], i, arr) => (
                <View key={label} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={[styles.detailValue, i === arr.length - 1 && { color: '#1E95EA', fontWeight: '700' }]}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Confirm button */}
            <SpringPress onPress={() => setStep('complete')} activeScale={0.95}>
              <View style={{ backgroundColor: '#1E95EA', borderRadius: 16, paddingVertical: 18, marginHorizontal: 16, alignItems: 'center', marginBottom: 8, shadowColor: '#1E95EA', shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 }}>
                <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Confirm with Face ID</Text>
              </View>
            </SpringPress>

            <TouchableOpacity onPress={() => setStep('form')} style={{ alignItems: 'center', paddingVertical: 10, marginBottom: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#9AA4AA' }}>Cancel</Text>
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
      <ScreenHeader pageName={isBuy ? 'Buy' : 'Sell'} onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buy/Sell toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => switchSide('buy')} style={[styles.toggleBtn, side === 'buy' && styles.toggleBuyActive]}>
            <Text style={[styles.toggleText, side === 'buy' && styles.toggleTextActive]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchSide('sell')} style={[styles.toggleBtn, side === 'sell' && styles.toggleSellActive]}>
            <Text style={[styles.toggleText, side === 'sell' && styles.toggleTextActive]}>Sell</Text>
          </TouchableOpacity>
        </View>

        {/* Crypto selection */}
        <Text style={styles.sectionTitle}>Select Cryptocurrency</Text>
        <View style={styles.cryptoRow}>
          {CRYPTO_OPTIONS.map(c => (
            <TouchableOpacity key={c} onPress={() => setCrypto(c)} style={[styles.cryptoPill, crypto === c && { backgroundColor: accentColor }]}>
              <CryptoIcon symbol={c} size={18} />
              <Text style={[styles.cryptoPillText, crypto === c && { color: '#FFF' }, { marginLeft: 6 }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount input */}
        <Text style={styles.sectionTitle}>Amount (USD)</Text>
        <View style={styles.inputCard}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor="#C7C7CC" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
          <CryptoBadge symbol={crypto} small />
        </View>

        {/* Payment method */}
        <Text style={styles.sectionTitle}>{isBuy ? 'Payment Method' : 'Receive To'}</Text>
        {PAYMENT_METHODS.map(pm => (
          <SpringPress key={pm.id} onPress={() => setPaymentMethod(pm.id)} activeScale={0.97}>
            <View style={[styles.methodCard, paymentMethod === pm.id && styles.methodCardSelected]}>
              <Text style={styles.methodIcon}>{pm.icon}</Text>
              <View style={styles.methodInfo}>
                <Text style={styles.methodLabel}>{pm.label}</Text>
                <Text style={styles.methodDetail}>{pm.detail}</Text>
              </View>
              <View style={styles.methodMeta}>
                <Text style={styles.methodFee}>{pm.fee}</Text>
                <Text style={styles.methodTime}>{pm.time}</Text>
              </View>
              {paymentMethod === pm.id && <Text style={styles.methodCheck}>✓</Text>}
            </View>
          </SpringPress>
        ))}

        {/* Buy/Sell button */}
        <SpringPress onPress={() => setStep('confirm')} activeScale={0.95}>
          <View style={{ backgroundColor: isBuy ? '#4CD964' : '#D4555A', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 16, marginBottom: 20, shadowColor: isBuy ? '#4CD964' : '#D4555A', shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 }}>{isBuy ? 'BUY' : 'SELL'} {crypto}</Text>
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

  toggleContainer: { flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 12, padding: 3, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBuyActive: { backgroundColor: '#4CD964' },
  toggleSellActive: { backgroundColor: '#D4555A' },
  toggleText: { fontSize: 15, fontWeight: '700', color: '#8E8E93' },
  toggleTextActive: { color: '#FFF' },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#9AA4AA', marginBottom: 8, marginTop: 4 },

  cryptoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  cryptoPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cryptoPillText: { fontSize: 14, fontWeight: '700', color: '#1C3040' },

  inputCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  inputPrefix: { fontSize: 28, fontWeight: '700', color: '#1C3040', marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: '#1C3040' },

  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, borderWidth: 1.5, borderColor: 'transparent' },
  methodCardSelected: { borderColor: '#1E95EA' },
  methodIcon: { fontSize: 28, marginRight: 12 },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, fontWeight: '700', color: '#1C3040' },
  methodDetail: { fontSize: 12, color: '#9AA4AA', marginTop: 1 },
  methodMeta: { alignItems: 'flex-end', marginRight: 8 },
  methodFee: { fontSize: 13, fontWeight: '600', color: '#1C3040' },
  methodTime: { fontSize: 11, color: '#9AA4AA', marginTop: 1 },
  methodCheck: { fontSize: 18, color: '#55D987', fontWeight: '700' },

  // Sheet
  sheetCard: { backgroundColor: '#F4FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 20, maxHeight: '92%' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA' },
  detailLabel: { fontSize: 14, color: '#9AA4AA' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1C3040' },
});

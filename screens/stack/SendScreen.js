import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, StatusBar, Animated, Share,
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

export default function SendScreen({ navigation }) {
  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [step, setStep] = useState('form'); // form → confirm → sent
  const [scanPulse] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanPulse, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(scanPulse, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const scanOpacity = scanPulse.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.8] });

  // ─── SUCCESS — Flare-style TxPopup ───
  if (step === 'sent') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <TxPopup
          visible={true}
          type="sent"
          amount={amount || '0.00'}
          badge={selectedCrypto}
          badgeColor={CRYPTO_META[selectedCrypto]?.color || '#FF9500'}
          details={[
            { label: 'Destination', value: sendTo || '0x7f3a...b92c' },
            { label: 'Network Fee', value: '0.0001 BTC' },
            { label: 'Tx ID', value: '0x7f3a...b92c' },
            { label: 'Total', value: `${amount || '0.00'} ${selectedCrypto}`, highlight: true },
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

            {/* Crypto icon with glow */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: CRYPTO_META[selectedCrypto]?.color || '#FF9500', alignItems: 'center', justifyContent: 'center', shadowColor: CRYPTO_META[selectedCrypto]?.color || '#FF9500', shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 }}>
                <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700' }}>{selectedCrypto.charAt(0)}</Text>
              </View>
            </View>

            {/* Amount */}
            <View style={{ alignItems: 'center', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 32, fontWeight: '700', color: '#1C3040' }}>{amount || '0.00'}</Text>
                <CryptoBadge symbol={selectedCrypto} small />
              </View>
              <Text style={{ fontSize: 14, color: '#9AA4AA', marginTop: 4 }}>$ {(parseFloat(amount || 0) * 62450).toFixed(2)}</Text>
            </View>

            <Text style={{ fontSize: 13, fontWeight: '600', color: '#9AA4AA', marginLeft: 16, marginTop: 16, marginBottom: 6 }}>Transaction Details</Text>

            {/* White details card */}
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 14, marginBottom: 12 }}>
              {[
                ['Destination', sendTo || '—'],
                ['Network Fee', `~0.0001 ${selectedCrypto}`],
                ['Estimated Time', '~10 minutes'],
                ['Total', `${amount || '0.00'} ${selectedCrypto}`],
              ].map(([label, value], i, arr) => (
                <View key={label} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={[styles.detailValue, i === arr.length - 1 && { color: '#1E95EA', fontWeight: '700' }]} numberOfLines={1}>{value}</Text>
                </View>
              ))}
            </View>

            {/* Confirm with Face ID */}
            <SpringPress onPress={() => setStep('sent')} activeScale={0.95}>
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
      <ScreenHeader pageName="Send" onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* QR scanner area — Flare dark gradient style */}
        <SpringPress onPress={() => {}} activeScale={0.95}>
          <LinearGradient colors={['#1A1A3E', '#2D2D6B']} style={styles.qrArea} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
            <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700', marginBottom: 12 }}>QR Code Scan</Text>
            <View style={styles.qrCard}>
              <View style={styles.qrFrame}>
                <Animated.Text style={[styles.qrLabel, { opacity: scanOpacity }]}>
                  Scan
                </Animated.Text>
              </View>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 8, textAlign: 'center' }}>
              Place the code in the center of the square
            </Text>
          </LinearGradient>
        </SpringPress>

        {/* Address input */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Send To</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="Wallet address or email"
            placeholderTextColor="#C7C7CC"
            value={sendTo}
            onChangeText={setSendTo}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Crypto selection */}
        <Text style={styles.sectionTitle}>Select Crypto</Text>
        <View style={styles.cryptoRow}>
          {['BTC', 'ETH', 'XRP', 'SOL', 'LTC'].map(c => (
            <TouchableOpacity key={c} onPress={() => setSelectedCrypto(c)}
              style={[styles.cryptoPill, selectedCrypto === c && styles.cryptoPillActive]}>
              <CryptoIcon symbol={c} size={18} />
              <Text style={[styles.cryptoPillText, selectedCrypto === c && styles.cryptoPillTextActive, { marginLeft: 6 }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <View style={styles.inputCard}>
          <Text style={styles.inputLabel}>Amount</Text>
          <View style={styles.amountRow}>
            <TextInput style={styles.amountInput} placeholder="0.00" placeholderTextColor="#C7C7CC" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            <TouchableOpacity style={styles.maxBtn}>
              <Text style={styles.maxText}>MAX</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
            <CryptoBadge symbol={selectedCrypto} small />
            <Text style={styles.balanceHint}>Available: 0.00 {selectedCrypto}</Text>
          </View>
        </View>

        {/* Network fee */}
        <View style={styles.feeCard}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Network Fee</Text>
            <Text style={styles.feeValue}>~0.0001 {selectedCrypto}</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Estimated Time</Text>
            <Text style={styles.feeValue}>~10 min</Text>
          </View>
        </View>

        {/* Send button */}
        <SpringPress onPress={() => setStep('confirm')} activeScale={0.95}>
          <View style={{ backgroundColor: '#1E95EA', borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8, marginBottom: 20, shadowColor: '#1E95EA', shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 }}>SEND {selectedCrypto}</Text>
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

  // QR area — dark gradient like Flare
  qrArea: {
    borderRadius: 20, padding: 20, alignItems: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  qrCard: {
    width: 200, height: 200, borderRadius: 20, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  qrFrame: {
    width: 140, height: 140, borderRadius: 12, borderWidth: 2, borderColor: '#E5E5EA',
    alignItems: 'center', justifyContent: 'center',
  },
  qrLabel: { fontSize: 14, fontWeight: '600', color: '#1E95EA' },

  // Inputs
  inputCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#9AA4AA', marginBottom: 8 },
  addressInput: { fontSize: 15, color: '#1C3040', padding: 0 },
  amountRow: { flexDirection: 'row', alignItems: 'center' },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: '#1C3040' },
  maxBtn: { backgroundColor: '#1E95EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  maxText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
  balanceHint: { fontSize: 12, color: '#9AA4AA', marginLeft: 8 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#9AA4AA', marginBottom: 8 },
  cryptoRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  cryptoPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  cryptoPillActive: { backgroundColor: '#1E95EA' },
  cryptoPillText: { fontSize: 14, fontWeight: '700', color: '#1C3040' },
  cryptoPillTextActive: { color: '#FFF' },

  feeCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  feeLabel: { fontSize: 14, color: '#9AA4AA' },
  feeValue: { fontSize: 14, fontWeight: '600', color: '#1C3040' },

  // Sheet
  sheetCard: { backgroundColor: '#F4FAFC', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 20, maxHeight: '92%' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA' },
  detailLabel: { fontSize: 14, color: '#9AA4AA' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#1C3040', flex: 1, textAlign: 'right' },
});

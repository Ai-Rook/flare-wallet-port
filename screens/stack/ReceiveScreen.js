import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Share, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import TxPopup from '../../components/TxPopup';
import { TOKENS } from '../../constants/tokens';

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

export default function ReceiveScreen({ navigation, route }) {
  const symbol = route.params?.symbol || 'BTC';
  const [showConfirm, setShowConfirm] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  }, []);

  const address = '0x0000000000000000000000000000000000000000';

  const handleShare = async () => {
    await Share.share({ message: `My ${symbol} address: ${address}` });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName="Receive" onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }} contentContainerStyle={{ alignItems: 'center', paddingTop: 24 }}>
        {/* QR code card — Flare dark gradient style */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <View style={styles.qrSection}>
            <LinearGradient colors={['#1A1A3E', '#2D2D6B']} style={styles.qrArea} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}>
              <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600', marginBottom: 8 }}>Your {symbol} Address</Text>
              <View style={styles.qrCard}>
                <View style={styles.qrFrame}>
                  <Text style={{ fontSize: 36 }}>📱</Text>
                  <Text style={{ fontSize: 12, color: '#9AA4AA', marginTop: 4 }}>QR Code</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Address below QR */}
            <View style={styles.addressCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <CryptoIcon symbol={symbol} size={24} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#1C3040', marginLeft: 8 }}>{symbol} Address</Text>
              </View>
              <Text style={styles.address} selectable>{address}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Asset selector */}
        <Text style={styles.sectionTitle}>Select Asset</Text>
        <View style={styles.assetRow}>
          {TOKENS.slice(0, 6).map(t => (
            <TouchableOpacity key={t.symbol} style={[styles.assetChip, symbol === t.symbol && styles.assetChipActive]}
              onPress={() => navigation.setParams({ symbol: t.symbol })}>
              <CryptoIcon symbol={t.symbol} size={18} />
              <Text style={[styles.assetChipText, symbol === t.symbol && styles.assetChipTextActive, { marginLeft: 6 }]}>{t.symbol}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action buttons */}
        <SpringPress onPress={handleShare} activeScale={0.95}>
          <View style={{ backgroundColor: '#1E95EA', borderRadius: 16, paddingVertical: 18, width: '100%', alignItems: 'center', marginBottom: 10, shadowColor: '#1E95EA', shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 17, fontWeight: '700' }}>Share Address</Text>
          </View>
        </SpringPress>

        {/* Copy button */}
        <SpringPress onPress={() => {}} activeScale={0.95}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 18, width: '100%', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 }}>
            <Text style={{ color: '#1E95EA', fontSize: 17, fontWeight: '700' }}>Copy Address</Text>
          </View>
        </SpringPress>

        {/* Demo received confirmation — TxPopup */}
        <SpringPress onPress={() => setShowConfirm(true)} activeScale={0.95}>
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, paddingVertical: 14, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#55D987', marginBottom: 24 }}>
            <Text style={{ color: '#55D987', fontSize: 15, fontWeight: '600' }}>Show Received Confirmation</Text>
          </View>
        </SpringPress>
      </ScrollView>

      {/* Received confirmation — Flare-style TxPopup */}
      <TxPopup
        visible={showConfirm}
        type="received"
        amount="0.125"
        badge={symbol}
        badgeColor={CRYPTO_META[symbol]?.color || '#FF9500'}
        details={[
          { label: 'Amount', value: `0.125 ${symbol}` },
          { label: 'Date', value: new Date().toLocaleDateString() },
          { label: 'Transaction ID', value: '0x7f3a...b92c' },
        ]}
        onDismiss={() => setShowConfirm(false)}
      />
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

  content: { flex: 1, paddingHorizontal: 20 },

  // QR section
  qrSection: { width: '100%', marginBottom: 20 },
  qrArea: {
    borderRadius: 20, padding: 20, alignItems: 'center',
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

  addressCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    marginTop: 12, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  address: { fontSize: 13, color: '#1C3040', fontFamily: 'monospace', lineHeight: 20 },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#9AA4AA', marginBottom: 8, alignSelf: 'flex-start', width: '100%' },
  assetRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16, width: '100%' },
  assetChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFFFFF', marginRight: 8, marginBottom: 6, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  assetChipActive: { backgroundColor: '#1E95EA' },
  assetChipText: { fontSize: 13, fontWeight: '600', color: '#1C3040' },
  assetChipTextActive: { color: '#FFF' },
});

import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';
import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import { useLivePrices } from '../../services/LivePriceService';

const SWAP_OPTIONS = ['BTC', 'ETH', 'XRP', 'SOL', 'LTC', 'DOGE', 'ADA', 'FLR'];

export default function ExchangeScreen({ navigation, route }) {
  const fromParam = route.params?.fromAsset || 'BTC';
  const { prices } = useLivePrices();
  const [fromCrypto, setFromCrypto] = useState(fromParam);
  const [toCrypto, setToCrypto] = useState('ETH');
  const [fromAmount, setFromAmount] = useState('');
  const [step, setStep] = useState('form');
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

  // Live conversion math from FTSO prices
  const fromPrice = prices[fromCrypto]?.price || 0;
  const toPrice = prices[toCrypto]?.price || 0;
  const rate = fromPrice > 0 && toPrice > 0 ? fromPrice / toPrice : 0;
  const toAmount = fromAmount && rate > 0 ? (parseFloat(fromAmount) * rate).toFixed(6) : '0.00';
  const usdValue = fromAmount ? (parseFloat(fromAmount) * fromPrice) : 0;
  const rateLabel = rate > 0 ? `1 ${fromCrypto} = ${rate.toFixed(6)} ${toCrypto}` : 'Loading rates...';

  // ─── SUCCESS SCREEN ───
  if (step === 'done') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.successWrap}>
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>⇄</Text>
            <Text style={styles.successTitle}>Swap Complete</Text>
            <View style={styles.successIconRow}>
              <FlareTokenIcon symbol={fromCrypto} size={40} color={Colors.primary} />
              <Text style={styles.successArrow}>→</Text>
              <FlareTokenIcon symbol={toCrypto} size={40} color={Colors.primary} />
            </View>
            <Text style={styles.successAmount}>{fromAmount || '0.00'} {fromCrypto} → {toAmount} {toCrypto}</Text>
            <View style={styles.successDetails}>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Rate</Text><Text style={styles.detailValue}>{rateLabel}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>USD Value</Text><Text style={styles.detailValue}>${usdValue.toFixed(2)}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Fee</Text><Text style={styles.detailValue}>0.5%</Text></View>
            </View>
            <TouchableOpacity style={styles.successBtn} onPress={() => { setStep('form'); navigation.goBack?.(); }}>
              <Text style={styles.successBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── CONFIRM BOTTOM SHEET ───
  if (step === 'confirm') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
          <View style={styles.sheetCard}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setStep('form')}><Text style={styles.sheetBack}>‹</Text></TouchableOpacity>
              <Text style={styles.sheetTitle}>Confirm Swap</Text>
              <TouchableOpacity onPress={() => setStep('form')}><Text style={styles.sheetClose}>✕</Text></TouchableOpacity>
            </View>
            <View style={styles.sheetDivider} />

            <View style={styles.sheetIconRow}>
              <FlareTokenIcon symbol={fromCrypto} size={40} color={Colors.primary} />
              <Text style={styles.sheetArrow}>→</Text>
              <FlareTokenIcon symbol={toCrypto} size={40} color={Colors.primary} />
            </View>

            <View style={styles.sheetAmountRow}>
              <Text style={styles.sheetAmount}>{fromAmount || '0.00'}</Text>
              <View style={styles.sheetBadge}><Text style={styles.sheetBadgeText}>{fromCrypto}</Text></View>
            </View>
            <Text style={styles.sheetSubAmount}>→ {toAmount} {toCrypto}</Text>
            <Text style={styles.sheetUsd}>≈ ${usdValue.toFixed(2)} USD</Text>

            <Text style={styles.sheetSectionLabel}>Transaction Details</Text>
            <View style={styles.sheetDetailsCard}>
              {[
                ['Exchanging', `${fromAmount || '0.00'} ${fromCrypto}`],
                ['Receiving', `${toAmount} ${toCrypto}`],
                ['Rate', rateLabel],
                ['USD Value', `$${usdValue.toFixed(2)}`],
                ['Fee', '0.5%'],
                ['Source', '🔥 FTSOv2 Oracle'],
              ].map(([label, value], i, arr) => (
                <View key={label} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={[styles.detailValue, i === arr.length - 1 && { color: Colors.primary, fontWeight: '700' }]}>{value}</Text>
                </View>
              ))}
            </View>

            <SpringPress onPress={() => setStep('done')} activeScale={0.95}>
              <View style={styles.confirmBtn}>
                <Text style={styles.confirmBtnText}>Confirm with Face ID</Text>
              </View>
            </SpringPress>
            <TouchableOpacity onPress={() => setStep('form')} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
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
      <ScreenHeader pageName="Swap" onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* From card */}
        <View style={styles.exchangeCard}>
          <View style={styles.exchangeCardHeader}>
            <Text style={styles.exchangeLabel}>You are swapping</Text>
            <TouchableOpacity onPress={() => { const temp = fromCrypto; setFromCrypto(toCrypto); setToCrypto(temp); }} style={styles.cryptoSelectBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FlareTokenIcon symbol={fromCrypto} size={20} color={Colors.primary} />
                <Text style={styles.cryptoSelectText}>{fromCrypto} ▾</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
            />
            <View style={styles.inputBadge}><Text style={styles.inputBadgeText}>{fromCrypto}</Text></View>
          </View>
          <Text style={styles.balanceHint}>Available: 0.00 {fromCrypto} · ${fromPrice.toFixed(2)} per {fromCrypto}</Text>
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
            <TouchableOpacity onPress={() => { const temp = fromCrypto; setFromCrypto(toCrypto); setToCrypto(temp); }} style={styles.cryptoSelectBtn}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FlareTokenIcon symbol={toCrypto} size={20} color={Colors.primary} />
                <Text style={styles.cryptoSelectText}>{toCrypto} ▾</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.toAmount}>{toAmount}</Text>
            <View style={styles.inputBadge}><Text style={styles.inputBadgeText}>{toCrypto}</Text></View>
          </View>
          <Text style={styles.rateHint}>{rateLabel}</Text>
        </View>

        {/* Asset picker */}
        <Text style={styles.sectionTitle}>Select Asset Pair</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetPicker}>
          {SWAP_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.assetChip, (fromCrypto === opt || toCrypto === opt) && styles.assetChipActive]}
              onPress={() => {
                if (fromCrypto === opt) { setFromCrypto(toCrypto); setToCrypto(opt); }
                else { setToCrypto(fromCrypto); setFromCrypto(opt); }
              }}
            >
              <FlareTokenIcon symbol={opt} size={20} color={(fromCrypto === opt || toCrypto === opt) ? '#FFF' : Colors.primary} />
              <Text style={[styles.assetChipText, (fromCrypto === opt || toCrypto === opt) && { color: '#FFF' }]}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Info card */}
        <View style={styles.infoCard}>
          {[
            ['Exchange Rate', rateLabel],
            ['USD Value', `$${usdValue.toFixed(2)}`],
            ['Fee', '0.5%'],
            ['Price Source', '🔥 FTSOv2 Oracle'],
            ['Min. Amount', '0.001 ' + fromCrypto],
          ].map(([l, v]) => (
            <View key={l} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{l}</Text>
              <Text style={styles.infoValue}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Swap button */}
        <SpringPress onPress={() => setStep('confirm')} activeScale={0.95}>
          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>SWAP {fromCrypto} → {toCrypto}</Text>
          </View>
        </SpringPress>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Exchange cards
  exchangeCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  exchangeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  exchangeLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  cryptoSelectBtn: { backgroundColor: Colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: Colors.border },
  cryptoSelectText: { fontSize: 14, fontWeight: '700', color: Colors.text, marginLeft: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: '700', color: Colors.text },
  toAmount: { flex: 1, fontSize: 32, fontWeight: '700', color: Colors.text },
  balanceHint: { fontSize: 12, color: Colors.textMuted },
  rateHint: { fontSize: 12, color: Colors.primary, fontWeight: '600' },

  // Swap button
  swapRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  swapLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  swapBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginHorizontal: 12, shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
  swapIcon: { color: '#FFF', fontSize: 20, fontWeight: '700' },

  // Asset picker
  assetPicker: { flexDirection: 'row', marginBottom: 16 },
  assetChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  assetChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  assetChipText: { fontSize: 13, fontWeight: '700', color: Colors.text, marginLeft: 6 },

  // Info card
  infoCard: { backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  infoLabel: { fontSize: 14, color: Colors.textMuted },
  infoValue: { fontSize: 14, fontWeight: '600', color: Colors.text },

  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, marginTop: 4 },

  // Action button
  actionBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 8, marginBottom: 20, shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  actionBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },

  // Sheet
  sheetCard: { backgroundColor: Colors.cream, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 20, maxHeight: '92%' },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginTop: 8, marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  sheetBack: { fontSize: 24, color: Colors.text },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  sheetClose: { fontSize: 18, color: Colors.text },
  sheetDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  sheetIconRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  sheetArrow: { fontSize: 20, color: Colors.textMuted, marginHorizontal: 12 },
  sheetAmountRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 4 },
  sheetAmount: { fontSize: 32, fontWeight: '700', color: Colors.text },
  sheetBadge: { backgroundColor: Colors.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  sheetBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  sheetSubAmount: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  sheetUsd: { fontSize: 13, color: Colors.textMuted, textAlign: 'center', marginBottom: 16 },
  sheetSectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginLeft: 16, marginBottom: 6 },
  sheetDetailsCard: { backgroundColor: Colors.surface, borderRadius: 14, marginHorizontal: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textMuted },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, marginHorizontal: 16, alignItems: 'center', marginBottom: 8, shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  confirmBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 10, marginBottom: 8 },
  cancelText: { fontSize: 15, fontWeight: '600', color: Colors.textMuted },

  // Success
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successCard: { backgroundColor: Colors.surface, borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: Colors.border },
  successEmoji: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 20 },
  successIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  successArrow: { fontSize: 20, color: Colors.primary, marginHorizontal: 12 },
  successAmount: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 20, textAlign: 'center' },
  successDetails: { width: '100%', backgroundColor: Colors.background, borderRadius: 14, padding: 16, marginBottom: 24 },
  successBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', width: '100%' },
  successBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
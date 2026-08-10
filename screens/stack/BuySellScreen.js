import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';

const CRYPTO_OPTIONS = ['BTC', 'ETH', 'XRP', 'SOL', 'LTC', 'DOGE', 'ADA'];

const PAYMENT_METHODS = [
  { id: 'ach', label: 'ACH Transfer', icon: '🏦', detail: 'Bank of America ****4521', fee: 'Free', time: '3-5 days' },
  { id: 'wire', label: 'Wire Transfer', icon: '🔁', detail: 'Direct bank wire', fee: '$25', time: '1-2 days' },
  { id: 'usd', label: 'USD Account', icon: '💰', detail: 'Balance: $12,450.00', fee: 'Free', time: 'Instant' },
];

export default function BuySellScreen({ navigation, route }) {
  const initialSide = route.params?.side || 'buy';
  const initialCrypto = route.params?.symbol || 'BTC';
  const [side, setSide] = useState(initialSide);
  const [crypto, setCrypto] = useState(initialCrypto);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('usd');
  const [step, setStep] = useState('form');
  const [slideAnim] = useState(new Animated.Value(0));

  const switchSide = (newSide) => {
    if (newSide === side) return;
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: newSide === 'sell' ? -300 : 300, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setSide(newSide));
  };

  const isBuy = side === 'buy';
  const accentColor = isBuy ? Colors.primary : Colors.burntOrange || '#D4501C';
  const accentLight = isBuy ? Colors.primaryLight : Colors.deepOrange;

  // ─── SUCCESS SCREEN ───
  if (step === 'complete') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.successWrap}>
          <View style={styles.successCard}>
            <Text style={styles.successEmoji}>{isBuy ? '🛒' : '💸'}</Text>
            <Text style={styles.successTitle}>{isBuy ? 'Purchase Complete' : 'Sale Complete'}</Text>
            <View style={styles.successIconRow}>
              <FlareTokenIcon symbol={crypto} size={48} color={Colors.primary} />
              <Text style={styles.successAmount}>{amount || '0.00'} {crypto}</Text>
            </View>
            <View style={styles.successDetails}>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Total</Text><Text style={styles.detailValueBold}>${(parseFloat(amount || 0) * 62450).toFixed(2)}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Price</Text><Text style={styles.detailValue}>$62,450.00</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Method</Text><Text style={styles.detailValue}>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label || 'USD'}</Text></View>
              <View style={styles.detailRow}><Text style={styles.detailLabel}>Fee</Text><Text style={styles.detailValue}>{PAYMENT_METHODS.find(p => p.id === paymentMethod)?.fee || 'Free'}</Text></View>
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
              <Text style={styles.sheetTitle}>Confirm</Text>
              <TouchableOpacity onPress={() => setStep('form')}><Text style={styles.sheetClose}>✕</Text></TouchableOpacity>
            </View>
            <View style={styles.sheetDivider} />

            <View style={styles.sheetIconWrap}>
              <FlareTokenIcon symbol={crypto} size={48} color={Colors.primary} />
            </View>

            <View style={styles.sheetAmountRow}>
              <Text style={styles.sheetAmount}>{amount || '0.00'}</Text>
              <View style={styles.sheetBadge}><Text style={styles.sheetBadgeText}>{crypto}</Text></View>
            </View>

            <Text style={styles.sheetSectionLabel}>Transaction Details</Text>
            <View style={styles.sheetDetailsCard}>
              {[
                ['Rate', '$62,450.00'],
                ['Total', `$${(parseFloat(amount || 0) * 62450).toFixed(2)}`],
                ['Method', PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label || 'USD'],
                ['Available', PAYMENT_METHODS.find(p => p.id === paymentMethod)?.time || 'Instant'],
                ['Fee', PAYMENT_METHODS.find(p => p.id === paymentMethod)?.fee || 'Free'],
              ].map(([label, value], i, arr) => (
                <View key={label} style={[styles.detailRow, i === arr.length - 1 && { borderBottomWidth: 0 }]}>
                  <Text style={styles.detailLabel}>{label}</Text>
                  <Text style={[styles.detailValue, i === arr.length - 1 && { color: Colors.primary, fontWeight: '700' }]}>{value}</Text>
                </View>
              ))}
            </View>

            <SpringPress onPress={() => setStep('complete')} activeScale={0.95}>
              <View style={[styles.confirmBtn, { backgroundColor: accentColor }]}>
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
      <ScreenHeader pageName={isBuy ? 'Buy' : 'Sell'} onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Buy/Sell toggle — Sunkist style */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => switchSide('buy')} style={[styles.toggleBtn, side === 'buy' && styles.toggleBuyActive]}>
            <Text style={[styles.toggleText, side === 'buy' && styles.toggleTextActive]}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => switchSide('sell')} style={[styles.toggleBtn, side === 'sell' && styles.toggleSellActive]}>
            <Text style={[styles.toggleText, side === 'sell' && styles.toggleTextActive]}>Sell</Text>
          </TouchableOpacity>
        </View>

        {/* Crypto selection — FlareTokenIcon pills */}
        <Text style={styles.sectionTitle}>Select Asset</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cryptoRow}>
          {CRYPTO_OPTIONS.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setCrypto(c)}
              style={[styles.cryptoPill, crypto === c && { backgroundColor: accentColor, borderColor: accentColor }]}
            >
              <FlareTokenIcon symbol={c} size={24} color={crypto === c ? '#FFF' : Colors.primary} />
              <Text style={[styles.cryptoPillText, crypto === c && { color: '#FFF' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Amount input */}
        <Text style={styles.sectionTitle}>Amount (USD)</Text>
        <View style={styles.inputCard}>
          <Text style={styles.inputPrefix}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <View style={styles.inputBadge}><Text style={styles.inputBadgeText}>{crypto}</Text></View>
        </View>

        {/* Quick amount buttons */}
        <View style={styles.quickAmountRow}>
          {['100', '500', '1000', '5000'].map(amt => (
            <TouchableOpacity key={amt} style={styles.quickAmtBtn} onPress={() => setAmount(amt)}>
              <Text style={styles.quickAmtText}>${amt}</Text>
            </TouchableOpacity>
          ))}
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

        {/* Buy/Sell button — Sunkist orange */}
        <SpringPress onPress={() => setStep('confirm')} activeScale={0.95}>
          <View style={[styles.actionBtn, { backgroundColor: accentColor }]}>
            <Text style={styles.actionBtnText}>{isBuy ? 'BUY' : 'SELL'} {crypto}</Text>
          </View>
        </SpringPress>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },

  // Toggle
  toggleContainer: { flexDirection: 'row', backgroundColor: Colors.creamDark, borderRadius: 12, padding: 3, marginBottom: 20 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  toggleBuyActive: { backgroundColor: Colors.primary, shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  toggleSellActive: { backgroundColor: Colors.deepOrange, shadowColor: Colors.deepOrange, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
  toggleText: { fontSize: 15, fontWeight: '700', color: Colors.textMuted },
  toggleTextActive: { color: '#FFF' },

  // Sections
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, marginBottom: 8, marginTop: 4 },

  // Crypto pills
  cryptoRow: { flexDirection: 'row', marginBottom: 16 },
  cryptoPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border, marginRight: 8 },
  cryptoPillText: { fontSize: 14, fontWeight: '700', color: Colors.text, marginLeft: 8 },

  // Input
  inputCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  inputPrefix: { fontSize: 28, fontWeight: '700', color: Colors.text, marginRight: 8 },
  amountInput: { flex: 1, fontSize: 28, fontWeight: '700', color: Colors.text },
  inputBadge: { backgroundColor: Colors.primary + '15', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  inputBadgeText: { color: Colors.primary, fontSize: 12, fontWeight: '700' },

  // Quick amounts
  quickAmountRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickAmtBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 10, paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  quickAmtText: { fontSize: 13, fontWeight: '600', color: Colors.primary },

  // Methods
  methodCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1.5, borderColor: 'transparent' },
  methodCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '08' },
  methodIcon: { fontSize: 24, marginRight: 12 },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, fontWeight: '700', color: Colors.text },
  methodDetail: { fontSize: 12, color: Colors.textMuted, marginTop: 1 },
  methodMeta: { alignItems: 'flex-end', marginRight: 8 },
  methodFee: { fontSize: 13, fontWeight: '600', color: Colors.text },
  methodTime: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  methodCheck: { fontSize: 18, color: Colors.primary, fontWeight: '700' },

  // Action button
  actionBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginTop: 16, marginBottom: 20, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  actionBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700', letterSpacing: 0.5 },

  // Sheet
  sheetCard: { backgroundColor: Colors.cream, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 20, maxHeight: '92%' },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border, alignSelf: 'center', marginTop: 8, marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  sheetBack: { fontSize: 24, color: Colors.text },
  sheetTitle: { fontSize: 17, fontWeight: '700', color: Colors.text },
  sheetClose: { fontSize: 18, color: Colors.text },
  sheetDivider: { height: 1, backgroundColor: Colors.border, marginBottom: 20 },
  sheetIconWrap: { alignItems: 'center', marginBottom: 12 },
  sheetAmountRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', marginBottom: 20 },
  sheetAmount: { fontSize: 32, fontWeight: '700', color: Colors.text },
  sheetBadge: { backgroundColor: Colors.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginLeft: 8 },
  sheetBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  sheetSectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginLeft: 16, marginBottom: 6 },
  sheetDetailsCard: { backgroundColor: Colors.surface, borderRadius: 14, marginHorizontal: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textMuted },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  detailValueBold: { fontSize: 14, fontWeight: '700', color: Colors.text },
  confirmBtn: { borderRadius: 16, paddingVertical: 18, marginHorizontal: 16, alignItems: 'center', marginBottom: 8, shadowOpacity: 0.25, shadowRadius: 8, elevation: 3 },
  confirmBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 10, marginBottom: 8 },
  cancelText: { fontSize: 15, fontWeight: '600', color: Colors.textMuted },

  // Success
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successCard: { backgroundColor: Colors.surface, borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: Colors.border },
  successEmoji: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 20 },
  successIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  successAmount: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginLeft: 12 },
  successDetails: { width: '100%', backgroundColor: Colors.background, borderRadius: 14, padding: 16, marginBottom: 24 },
  successBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', width: '100%' },
  successBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

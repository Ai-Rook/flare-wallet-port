import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { CRYPTO_HOLDINGS } from '../constants/holdings';
import { useLivePrices } from '../services/LivePriceService';
import { DEMO_WALLET_ADDRESS, FLARE_EXPLORER } from '../appConfig';
import ScreenHeader from '../components/ScreenHeader';

export default function SendScreen({ navigation }) {
  const { prices } = useLivePrices();
  const [selectedAsset, setSelectedAsset] = useState(CRYPTO_HOLDINGS[0]);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [sent, setSent] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleSend = () => {
    if (!toAddress || !amount) {
      Alert.alert('Missing fields', 'Enter recipient address and amount');
      return;
    }
    // Demo mode — generate a fake tx hash
    const fakeHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setTxHash(fakeHash);
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Send" subtitle="Transaction Sent" />
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✅</Text>
          <Text style={styles.successTitle}>Transaction Submitted</Text>
          <Text style={styles.successAmount}>{amount} {selectedAsset.symbol}</Text>
          <Text style={styles.successTo}>To: {toAddress.slice(0,10)}...{toAddress.slice(-6)}</Text>
          <Text style={styles.demoBadge}>🔬 Demo Mode — No real transaction sent</Text>
          <TouchableOpacity onPress={() => { setSent(false); setAmount(''); setToAddress(''); }}>
            <Text style={styles.sendAgain}>Send Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Send" subtitle="Transfer assets on Coston2" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.demoBanner}>
          <Text style={styles.demoText}>🔬 Demo Mode — Transactions are simulated</Text>
        </View>

        <Text style={styles.label}>Asset</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetPicker}>
          {CRYPTO_HOLDINGS.map(asset => (
            <TouchableOpacity
              key={asset.symbol}
              style={[styles.assetChip, selectedAsset.symbol === asset.symbol && styles.assetChipActive]}
              onPress={() => setSelectedAsset(asset)}
            >
              <Text style={[styles.assetChipText, selectedAsset.symbol === asset.symbol && styles.assetChipTextActive]}>
                {asset.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.label}>Recipient Address</Text>
        <TextInput
          style={styles.input}
          placeholder="0x..."
          value={toAddress}
          onChangeText={setToAddress}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Amount</Text>
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          <Text style={styles.amountSuffix}>{selectedAsset.symbol}</Text>
        </View>

        {selectedAsset && (
          <Text style={styles.balance}>
            Balance: {selectedAsset.amount} {selectedAsset.symbol}
          </Text>
        )}

        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send {selectedAsset.symbol}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  demoBanner: { backgroundColor: Colors.primary + '15', borderRadius: 10, padding: 10, marginBottom: 16 },
  demoText: { fontSize: 13, color: Colors.primary, fontWeight: '600', textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, marginTop: 12 },
  assetPicker: { flexDirection: 'row', marginBottom: 8 },
  assetChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  assetChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  assetChipText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  assetChipTextActive: { color: '#FFF' },
  input: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, fontSize: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 8, fontFamily: 'monospace' },
  amountRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 4 },
  amountInput: { flex: 1, padding: 16, fontSize: 20, fontWeight: '700' },
  amountSuffix: { paddingRight: 16, fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  balance: { fontSize: 13, color: Colors.textMuted, marginBottom: 16 },
  sendBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  sendBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  successCard: { padding: 24, alignItems: 'center', marginTop: 40 },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  successAmount: { fontSize: 28, fontWeight: '800', color: Colors.primary, marginBottom: 8 },
  successTo: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16, fontFamily: 'monospace' },
  demoBadge: { fontSize: 12, color: Colors.textMuted, marginBottom: 24, textAlign: 'center' },
  sendAgain: { fontSize: 16, color: Colors.primary, fontWeight: '600' },
});

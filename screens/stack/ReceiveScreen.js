import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Clipboard } from 'react-native';
import { Colors } from '../constants/colors';
import { DEMO_WALLET_ADDRESS } from '../appConfig';
import ScreenHeader from '../components/ScreenHeader';

export default function ReceiveScreen({ navigation }) {
  const copyAddress = () => {
    Clipboard.setString(DEMO_WALLET_ADDRESS);
    Alert.alert('Copied', 'Wallet address copied to clipboard');
  };

  // Simple QR-like visual (grid pattern from address hash)
  const generateQRPattern = (addr) => {
    const chars = addr.replace('0x', '');
    const grid = [];
    for (let i = 0; i < 21; i++) {
      const row = [];
      for (let j = 0; j < 21; j++) {
        const idx = (i * 21 + j) % chars.length;
        const val = parseInt(chars[idx], 16);
        row.push(val % 2 === 0);
      }
      grid.push(row);
    }
    return grid;
  };

  const qrGrid = generateQRPattern(DEMO_WALLET_ADDRESS);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Receive" subtitle="Share your address" />
      <View style={styles.content}>
        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>Your Wallet Address</Text>
          {/* QR placeholder grid */}
          <View style={styles.qrGrid}>
            {qrGrid.map((row, i) => (
              <View key={i} style={styles.qrRow}>
                {row.map((cell, j) => (
                  <View key={j} style={[styles.qrCell, cell ? styles.qrCellOn : null]} />
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.address} selectable>{DEMO_WALLET_ADDRESS}</Text>
          <Text style={styles.network}>Flare Coston2 Testnet</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copyAddress}>
            <Text style={styles.copyBtnText}>📋 Copy Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Receive</Text>
          <Text style={styles.infoText}>1. Share your address with the sender</Text>
          <Text style={styles.infoText}>2. Sender transfers FLR or FAssets to this address</Text>
          <Text style={styles.infoText}>3. Funds appear in your wallet once confirmed</Text>
          <Text style={styles.infoText}>4. FAssets require XRPL payment to Core Vault with memo</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

import { Alert } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, alignItems: 'center' },
  qrCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: Colors.border },
  qrLabel: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 16 },
  qrGrid: { padding: 10, backgroundColor: '#FFF', borderRadius: 8, marginBottom: 16 },
  qrRow: { flexDirection: 'row' },
  qrCell: { width: 8, height: 8 },
  qrCellOn: { backgroundColor: '#1A1A1A' },
  address: { fontSize: 14, fontWeight: '700', color: Colors.text, fontFamily: 'monospace', textAlign: 'center', marginBottom: 4 },
  network: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 16 },
  copyBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  copyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  infoCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginTop: 16, width: '100%', borderWidth: 1, borderColor: Colors.border },
  infoTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  infoText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
});

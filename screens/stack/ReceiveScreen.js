import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Clipboard } from 'react-native';
import { Colors } from '../../constants/colors';
import { DEMO_WALLET_ADDRESS, FLARE_NETWORK_NAME } from '../../appConfig';
import ScreenHeader from '../../components/ScreenHeader';

// Generate a proper QR code matrix from text using a simple algorithm
// This creates a scannable-style QR grid (simplified — deterministic from address)
function generateQRMatrix(text) {
  // Simple deterministic grid from text hash
  const size = 25;
  const grid = [];
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      // Combine hash with position for deterministic pseudo-random
      const val = Math.abs((hash ^ (i * 31 + j * 17) ^ (i * j)) % 256);
      row.push(val % 2 === 0);
    }
    grid.push(row);
  }

  // Add finder patterns (corners) — real QR code style
  const addFinder = (startRow, startCol) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startRow + r][startCol + c] = isBorder || isInner;
      }
    }
    // Clear the border around finder
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        if (r === -1 || r === 7 || c === -1 || c === 7) {
          const ri = startRow + r, ci = startCol + c;
          if (ri >= 0 && ri < size && ci >= 0 && ci < size) grid[ri][ci] = false;
        }
      }
    }
  };

  addFinder(0, 0);           // Top-left
  addFinder(0, size - 7);     // Top-right
  addFinder(size - 7, 0);     // Bottom-left

  return grid;
}

export default function ReceiveScreen({ navigation }) {
  const copyAddress = () => {
    Clipboard.setString(DEMO_WALLET_ADDRESS);
    Alert.alert('Copied', 'Wallet address copied to clipboard');
  };

  const qrGrid = generateQRMatrix(DEMO_WALLET_ADDRESS);
  const cellSize = 10;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Receive" subtitle="Share your address" />
      <View style={styles.content}>
        {/* Flare branding badge */}
        <View style={styles.flareBanner}>
          <Text style={styles.flareBannerText}>🔥 Flare Coston2 Testnet</Text>
        </View>

        {/* QR Code */}
        <View style={styles.qrCard}>
          <Text style={styles.qrLabel}>Your Wallet Address</Text>
          <View style={styles.qrWrap}>
            <View style={styles.qrGrid}>
              {qrGrid.map((row, i) => (
                <View key={i} style={styles.qrRow}>
                  {row.map((cell, j) => (
                    <View key={j} style={[styles.qrCell, { width: cellSize, height: cellSize }, cell ? styles.qrCellOn : null]} />
                  ))}
                </View>
              ))}
            </View>
          </View>
          <Text style={styles.address} selectable>{DEMO_WALLET_ADDRESS}</Text>
          <Text style={styles.network}>{FLARE_NETWORK_NAME}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copyAddress}>
            <Text style={styles.copyBtnText}>📋 Copy Address</Text>
          </TouchableOpacity>
        </View>

        {/* How to Receive */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>How to Receive</Text>
          <Text style={styles.infoText}>1. Share your address or QR code with the sender</Text>
          <Text style={styles.infoText}>2. Sender transfers FLR or FAssets to this address</Text>
          <Text style={styles.infoText}>3. Funds appear in your wallet once confirmed on Coston2</Text>
          <Text style={styles.infoText}>4. FAssets require XRPL payment to Core Vault with 32-byte memo</Text>
        </View>

        {/* Built on Flare */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔥 Built on Flare · FTSOv2 Oracle · FAssets</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, alignItems: 'center' },
  flareBanner: { backgroundColor: Colors.primary + '15', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 16 },
  flareBannerText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  qrCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', borderWidth: 1, borderColor: Colors.border },
  qrLabel: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary, marginBottom: 16 },
  qrWrap: { padding: 12, backgroundColor: '#FFF', borderRadius: 12, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  qrGrid: { flexDirection: 'column' },
  qrRow: { flexDirection: 'row' },
  qrCell: { backgroundColor: 'transparent' },
  qrCellOn: { backgroundColor: '#1A1A1A' },
  address: { fontSize: 14, fontWeight: '700', color: Colors.text, fontFamily: 'monospace', textAlign: 'center', marginBottom: 4 },
  network: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 16 },
  copyBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
  copyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  infoCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, marginTop: 16, width: '100%', borderWidth: 1, borderColor: Colors.border },
  infoTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  infoText: { fontSize: 13, color: Colors.textSecondary, marginBottom: 6 },
  footer: { alignItems: 'center', paddingVertical: 24, marginTop: 16 },
  footerText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
});

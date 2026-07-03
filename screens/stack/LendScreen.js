import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useContext } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, TextInput, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import TokenIcon from '../../components/TokenIcon';
import { TOKENS } from '../../constants/tokens';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';

export default function LendScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [loans, setLoans] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await api.applyForLoan({
        collateralAsset: selectedAsset,
        collateralAmount,
        borrowAsset: 'USD',
        borrowAmount,
      });
      Alert.alert('Loan Application Submitted', 'Your application is being processed.');
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName="Lend" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Current loans */}
        <Text style={styles.sectionTitle}>Current Loans</Text>
        {loans.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={styles.emptyText}>No active loans</Text>
            <Text style={styles.emptySubtext}>Use your crypto as collateral to borrow</Text>
          </View>
        ) : (
          loans.map((loan, i) => (
            <View key={i} style={styles.loanCard}>
              <Text style={styles.loanAsset}>{loan.collateralAsset}</Text>
              <Text style={styles.loanAmount}>${loan.borrowAmount}</Text>
              <Text style={styles.loanStatus}>{loan.status}</Text>
            </View>
          ))
        )}

        {/* Loan application form — matching Current Loans.zip / Loan portal.zip screens */}
        <Text style={styles.sectionTitle}>Apply for a Loan</Text>

        <Text style={styles.label}>Collateral Asset</Text>
        <View style={styles.assetRow}>
          {TOKENS.slice(0, 4).map(t => (
            <TouchableOpacity
              key={t.symbol}
              style={[styles.assetChip, selectedAsset === t.symbol && styles.assetChipActive]}
              onPress={() => setSelectedAsset(t.symbol)}
            >
              <Text style={[styles.assetChipText, selectedAsset === t.symbol && styles.assetChipTextActive]}>
                {t.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Collateral Amount</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={collateralAmount}
            onChangeText={setCollateralAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.inputSuffix}>{selectedAsset}</Text>
        </View>

        <Text style={styles.label}>Borrow Amount (USD)</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={borrowAmount}
            onChangeText={setBorrowAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
          />
          <Text style={styles.inputSuffix}>USD</Text>
        </View>

        {/* Loan terms preview */}
        <View style={styles.termsCard}>
          <View style={styles.termsRow}>
            <Text style={styles.termsLabel}>Interest Rate</Text>
            <Text style={styles.termsValue}>8.5% APR</Text>
          </View>
          <View style={styles.termsRow}>
            <Text style={styles.termsLabel}>LTV Ratio</Text>
            <Text style={styles.termsValue}>50%</Text>
          </View>
          <View style={styles.termsRow}>
            <Text style={styles.termsLabel}>Liquidation Price</Text>
            <Text style={styles.termsValue}>—</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} disabled={loading}>
          <Text style={styles.applyText}>{loading ? 'Applying...' : 'Apply for Loan'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  emptyCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 32, alignItems: 'center', marginBottom: 20 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.text },
  emptySubtext: { fontSize: 13, color: Colors.textLight, marginTop: 4, textAlign: 'center' },
  loanCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface,
    borderRadius: 12, padding: 16, marginBottom: 8,
  },
  loanAsset: { fontSize: 15, fontWeight: '600', color: Colors.text, flex: 1 },
  loanAmount: { fontSize: 15, fontWeight: '600', color: Colors.text },
  loanStatus: { fontSize: 12, color: Colors.success, marginLeft: 8 },
  label: { fontSize: 13, color: Colors.textLight, fontWeight: '500', marginBottom: 6, marginTop: 8 },
  assetRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  assetChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, marginRight: 8, marginBottom: 6 },
  assetChipActive: { backgroundColor: Colors.primary },
  assetChipText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  assetChipTextActive: { color: '#FFF' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 10, paddingHorizontal: 14, height: 48, marginBottom: 8 },
  input: { flex: 1, fontSize: 16, color: Colors.text },
  inputSuffix: { fontSize: 14, fontWeight: '600', color: Colors.textLight },
  termsCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, marginTop: 12, marginBottom: 16 },
  termsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  termsLabel: { fontSize: 13, color: Colors.textLight },
  termsValue: { fontSize: 13, fontWeight: '600', color: Colors.text },
  applyBtn: { backgroundColor: Colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  applyText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

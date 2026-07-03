import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';

export default function BankLinkScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [accounts, setAccounts] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [bankName, setBankName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadAccounts(); }, []);

  const loadAccounts = async () => {
    try {
      const res = await api.getBankAccounts();
      setAccounts(res);
    } catch (e) {}
  };

  const handleLink = async () => {
    setLoading(true);
    try {
      await api.linkBank({ bankName, routingNumber, accountNumber });
      Alert.alert('Bank Linked', 'Your bank account has been connected.');
      setShowAdd(false);
      loadAccounts();
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const handleRemove = async (id) => {
    try {
      await api.removeBank(id);
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName="Bank Accounts" onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.sectionTitle}>Linked Accounts</Text>
        {accounts.map((acct, i) => (
          <View key={i} style={styles.accountRow}>
            <Text style={styles.acctIcon}>🏦</Text>
            <View style={styles.acctInfo}>
              <Text style={styles.acctName}>{acct.bankName}</Text>
              <Text style={styles.acctNumber}>•••• {acct.last4}</Text>
            </View>
            {acct.verified && <Text style={styles.verified}>✓ Verified</Text>}
            <TouchableOpacity onPress={() => handleRemove(acct.id)}><Text style={styles.remove}>Remove</Text></TouchableOpacity>
          </View>
        ))}
        {accounts.length === 0 && !showAdd && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No bank accounts linked</Text>
          </View>
        )}
        {!showAdd && (
          <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
            <Text style={styles.addText}>+ Add Bank Account</Text>
          </TouchableOpacity>
        )}
        {showAdd && (
          <View style={styles.addForm}>
            <Text style={styles.label}>Bank Name</Text>
            <TextInput style={styles.input} value={bankName} onChangeText={setBankName} placeholder="Bank of America" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Routing Number</Text>
            <TextInput style={styles.input} value={routingNumber} onChangeText={setRoutingNumber} keyboardType="number-pad" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Account Number</Text>
            <TextInput style={styles.input} value={accountNumber} onChangeText={setAccountNumber} keyboardType="number-pad" placeholderTextColor={Colors.textMuted} />
            <TouchableOpacity style={styles.linkBtn} onPress={handleLink} disabled={loading}>
              <Text style={styles.linkText}>{loading ? 'Linking...' : 'Link Account'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  accountRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  acctIcon: { fontSize: 24, marginRight: 12 },
  acctInfo: { flex: 1 },
  acctName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  acctNumber: { fontSize: 12, color: Colors.textLight, marginTop: 2 },
  verified: { fontSize: 12, color: Colors.success, fontWeight: '600', marginRight: 10 },
  remove: { fontSize: 13, color: Colors.linkBlue, fontWeight: '500' },
  emptyCard: { backgroundColor: Colors.surface, borderRadius: 12, padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: Colors.textMuted },
  addBtn: { backgroundColor: Colors.primary + '10', borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  addText: { color: Colors.primary, fontSize: 15, fontWeight: '600' },
  label: { fontSize: 13, color: Colors.textLight, fontWeight: '500', marginBottom: 4, marginTop: 12 },
  input: { backgroundColor: Colors.surface, borderRadius: 10, height: 44, paddingHorizontal: 14, fontSize: 15, color: Colors.text },
  linkBtn: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
  linkText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';

export default function ReferralScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [referralCode, setReferralCode] = useState('');
  const [myCode, setMyCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadMyCode(); }, []);

  const loadMyCode = async () => {
    try {
      const res = await api.getReferralCode();
      setMyCode(res.code);
    } catch (e) {}
  };

  const handleApply = async () => {
    if (!referralCode) return;
    setLoading(true);
    try {
      await api.applyReferral(referralCode);
      Alert.alert('Referral Applied', 'Welcome bonus will be credited shortly.');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName="Referral" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        {/* My referral code — matching Enter Referral.png screen */}
        <View style={styles.myCodeCard}>
          <Text style={styles.myCodeLabel}>Your Referral Code</Text>
          <Text style={styles.myCodeValue}>{myCode || 'LOADING...'}</Text>
          <Text style={styles.myCodeShare}>Share this code to earn rewards</Text>
        </View>

        {/* Enter referral code — matching Enter Referral.png */}
        <Text style={styles.sectionTitle}>Enter a Referral Code</Text>
        <TextInput
          style={styles.referralInput}
          value={referralCode}
          onChangeText={setReferralCode}
          autoCapitalize="characters"
          placeholder="ENTER CODE"
          placeholderTextColor={Colors.textMuted}
          maxLength={12}
        />
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} disabled={loading}>
          <Text style={styles.applyText}>{loading ? 'Applying...' : 'Apply Code'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  myCodeCard: { backgroundColor: Colors.primary, borderRadius: 16, padding: 24, marginBottom: 24 },
  myCodeLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 },
  myCodeValue: { color: '#FFF', fontSize: 28, fontWeight: '700', letterSpacing: 3, marginBottom: 4 },
  myCodeShare: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  referralInput: {
    backgroundColor: Colors.surface, borderRadius: 12, height: 56, paddingHorizontal: 20,
    fontSize: 20, fontWeight: '700', color: Colors.text, letterSpacing: 3, marginBottom: 16,
  },
  applyBtn: { backgroundColor: Colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center' },
  applyText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

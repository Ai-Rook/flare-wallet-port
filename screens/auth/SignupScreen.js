import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import api from '../../services/api';

export default function SignupScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!username || !email || !password) { Alert.alert('Error', 'Fill in all fields'); return; }
    if (password !== confirmPassword) { Alert.alert('Error', 'Passwords do not match'); return; }
    setLoading(true);
    try {
      await api.signup({ username, email, password, referralCode });
      Alert.alert('Account Created', 'Please verify your email and complete KYC.');
      navigation.navigate('KYC');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.primaryGradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Sign Up</Text>
        <View style={{ width: 32 }} />
      </LinearGradient>
      <ScrollView style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor={Colors.textMuted} />
          <View style={styles.underline} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Colors.textMuted} />
          <View style={styles.underline} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" placeholderTextColor={Colors.textMuted} />
          <View style={styles.underline} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry autoCapitalize="none" placeholderTextColor={Colors.textMuted} />
          <View style={styles.underline} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Referral Code (optional)</Text>
          <TextInput style={styles.input} value={referralCode} onChangeText={setReferralCode} autoCapitalize="none" placeholderTextColor={Colors.textMuted} />
          <View style={styles.underline} />
        </View>
        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
          <Text style={styles.signupText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, color: Colors.textLight, marginBottom: 4, fontWeight: '500' },
  input: { fontSize: 16, color: Colors.text, paddingVertical: 8 },
  underline: { height: 1, backgroundColor: Colors.border, marginTop: 2 },
  signupBtn: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  signupText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 24, marginTop: 16 },
  loginText: { color: Colors.textLight, fontSize: 14 },
  loginLink: { color: Colors.linkBlue, fontSize: 14, fontWeight: '600' },
});

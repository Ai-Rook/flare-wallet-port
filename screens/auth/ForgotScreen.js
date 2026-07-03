import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import api from '../../services/api';

export default function ForgotScreen({ navigation, route }) {
  const type = route.params?.type || 'password'; // username | password
  const [email, setEmail] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (type === 'username') {
        await api.forgotUsername(email);
      } else {
        await api.forgotPassword(usernameOrEmail);
      }
      setSent(true);
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={Colors.primaryGradient} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.backIcon}>‹</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Forgot {type === 'username' ? 'Username' : 'Password'}</Text>
        <View style={{ width: 32 }} />
      </LinearGradient>
      <View style={styles.content}>
        {sent ? (
          <View style={styles.sentCard}>
            <Text style={styles.sentIcon}>✉️</Text>
            <Text style={styles.sentTitle}>Check Your Email</Text>
            <Text style={styles.sentText}>We've sent instructions to your email address.</Text>
            <TouchableOpacity style={styles.backToLogin} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {type === 'username' ? (
              <>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputBox}>
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="your@email.com" placeholderTextColor={Colors.textMuted} />
                </View>
              </>
            ) : (
              <>
                <Text style={styles.label}>Username or Email</Text>
                <View style={styles.inputBox}>
                  <TextInput style={styles.input} value={usernameOrEmail} onChangeText={setUsernameOrEmail} autoCapitalize="none" placeholder="Enter username or email" placeholderTextColor={Colors.textMuted} />
                </View>
              </>
            )}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.submitText}>{loading ? 'Sending...' : 'Submit'}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  label: { fontSize: 13, color: Colors.textLight, fontWeight: '500', marginBottom: 8 },
  inputBox: { backgroundColor: Colors.surface, borderRadius: 10, height: 48, paddingHorizontal: 14, justifyContent: 'center', marginBottom: 16 },
  input: { fontSize: 16, color: Colors.text },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  sentCard: { alignItems: 'center', paddingTop: 48 },
  sentIcon: { fontSize: 48, marginBottom: 12 },
  sentTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  sentText: { fontSize: 14, color: Colors.textLight, textAlign: 'center', marginBottom: 24 },
  backToLogin: { backgroundColor: Colors.primary, borderRadius: 12, height: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  backToLoginText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
});

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setLoggedIn, setUser, setToken, enableDevMode } = useContext(AppContext);

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.login(username, password, rememberMe);
      setToken(res.token);
      setUser(res.user);
      setLoggedIn(true);
    } catch (e) {
      setError(e.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header — orange gradient Flare design */}
        <LinearGradient
          colors={Colors.primaryGradient}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Login</Text>
          <View style={{ width: 32 }} />
        </LinearGradient>

        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <Image source={require('../../assets/cp-logo-dark-300.png')} style={{ width: 220, height: 32, resizeMode: 'contain', marginBottom: 8 }} />
          <Text style={{ fontSize: 15, fontWeight: '400', color: Colors.textLight, marginBottom: 24 }}>Powered by Flare FTSO</Text>
        </View>

        {/* Form — white background Flare design */}
        <View style={styles.form}>
          {/* Username field — underlined style */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              placeholderTextColor={Colors.textMuted}
            />
            <View style={styles.underline} />
          </View>

          {/* Password field — underlined style */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholderTextColor={Colors.textMuted}
            />
            <View style={styles.underline} />
          </View>

          {/* Remember me checkbox */}
          <TouchableOpacity
            style={styles.rememberRow}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          {/* Error message */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Continue button — blue, rounded, white text, arrow */}
          <SpringPress onPress={handleLogin}
            disabled={loading}
          >
            <View style={styles.continueBtn}>
              <Text style={styles.continueText}>
                {loading ? 'Signing in...' : 'Continue'}
              </Text>
              <Text style={styles.continueArrow}>›</Text>
            </View>
          </SpringPress>

          {/* Forgot links */}
          <View style={styles.forgotLinks}>
            <TouchableOpacity onPress={() => navigation.navigate('Forgot', { type: 'username' })}>
              <Text style={styles.forgotLink}>Forgot username?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Forgot', { type: 'password' })}>
              <Text style={styles.forgotLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dev mode bypass */}
        <TouchableOpacity style={styles.devBtn} onPress={enableDevMode}>
          <Text style={styles.devText}>Skip Login (Dev Mode)</Text>
        </TouchableOpacity>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  backBtn: { width: 32, height: 32, justifyContent: 'center' },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  form: { flex: 1, paddingHorizontal: 24, paddingTop: 32 },
  inputGroup: { marginBottom: 28 },
  label: { fontSize: 13, color: Colors.textLight, marginBottom: 4, fontWeight: '500' },
  input: { fontSize: 16, color: Colors.text, paddingVertical: 8 },
  underline: { height: 1, backgroundColor: Colors.border, marginTop: 2 },
  rememberRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  checkbox: {
    width: 20, height: 20, borderRadius: 3, borderWidth: 1,
    borderColor: Colors.border, marginRight: 10, alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.checkboxActive, borderColor: Colors.checkboxActive },
  checkmark: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  rememberText: { fontSize: 14, color: Colors.text },
  error: { color: Colors.error, fontSize: 13, marginBottom: 12 },
  continueBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  continueText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  continueArrow: { color: '#FFF', fontSize: 28, fontWeight: '300', marginLeft: 8, marginTop: -3 },
  forgotLinks: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginTop: 20, paddingHorizontal: 8,
  },
  forgotLink: { color: Colors.linkBlue, fontSize: 13, fontWeight: '500' },
  signupRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 24 },
  signupText: { color: Colors.textLight, fontSize: 14 },
  signupLink: { color: Colors.linkBlue, fontSize: 14, fontWeight: '600' },
  devBtn: {
    backgroundColor: Colors.surface, borderRadius: 12, height: 44,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, borderWidth: 1, borderColor: Colors.primary + '30',
  },
  devText: { color: Colors.primary, fontSize: 14, fontWeight: '600' },
});

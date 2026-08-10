import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Colors } from '../constants/colors';
import { FLARE_NETWORK_NAME, FLARE_CHAIN_ID, FLARE_RPC, FLARE_EXPLORER, DEMO_WALLET_ADDRESS } from '../appConfig';
import ScreenHeader from '../components/ScreenHeader';

export default function ProfileScreen({ navigation }) {
  const settings = [
    { icon: '🔐', label: 'Security', action: () => Alert.alert('Security', 'Biometric lock + PIN enabled') },
    { icon: '🔑', label: 'Export Wallet', action: () => Alert.alert('Export', 'Private key export requires authentication') },
    { icon: '🌐', label: 'Network', value: FLARE_NETWORK_NAME },
    { icon: '🔗', label: 'Chain ID', value: String(FLARE_CHAIN_ID) },
    { icon: '📡', label: 'RPC Endpoint', value: FLARE_RPC.slice(8, 40) + '...' },
    { icon: '🔍', label: 'Block Explorer', value: 'coston2-explorer.flare.network' },
    { icon: '🔔', label: 'Notifications', action: () => Alert.alert('Notifications', 'Price alerts enabled') },
    { icon: '💱', label: 'Currency', value: 'USD' },
    { icon: '🌙', label: 'Theme', value: 'Sunkist Orange' },
    { icon: 'ℹ️', label: 'About', action: () => Alert.alert('Flare Wallet', 'Built on Flare FTSOv2 oracle infrastructure for the Flare Summer Signal hackathon.') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Profile" subtitle="Settings & Security" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🦊</Text>
          </View>
          <Text style={styles.profileName}>Flare Wallet User</Text>
          <Text style={styles.profileAddress}>{DEMO_WALLET_ADDRESS.slice(0, 10)}...{DEMO_WALLET_ADDRESS.slice(-6)}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Referral')}>
            <Text style={styles.referralLink}>🎁 Invite Friends — Earn Rewards</Text>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        {settings.map((item, i) => (
          <TouchableOpacity key={i} style={styles.settingRow} onPress={item.action || (() => {})}>
            <Text style={styles.settingIcon}>{item.icon}</Text>
            <Text style={styles.settingLabel}>{item.label}</Text>
            {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
          </TouchableOpacity>
        ))}

        {/* Flare Info */}
        <View style={styles.flareCard}>
          <Text style={styles.flareTitle}>flare.network</Text>
          <Text style={styles.flareText}>
            Flare is the blockchain for data. FTSOv2 provides decentralized price feeds, FAssets bring XRP, BTC, DOGE, and more to Flare as trust-minimized wrappers.
          </Text>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={() => Alert.alert('Sign Out', 'Are you sure?', [
          { text: 'Cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: () => navigation.navigate('Login') },
        ])}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Flare Wallet v1.0.0 · Hackathon Build</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  profileCard: { backgroundColor: Colors.surface, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 40 },
  profileName: { fontSize: 20, fontWeight: '700', color: Colors.text },
  profileAddress: { fontSize: 14, color: Colors.textMuted, fontFamily: 'monospace', marginTop: 4 },
  referralLink: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: Colors.border },
  settingIcon: { fontSize: 20, marginRight: 12 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  settingValue: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  flareCard: { backgroundColor: Colors.primary + '08', borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: Colors.border },
  flareTitle: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  flareText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  signOutBtn: { backgroundColor: Colors.error + '15', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  signOutText: { color: Colors.error, fontSize: 16, fontWeight: '700' },
  version: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', marginTop: 12, marginBottom: 32 },
});

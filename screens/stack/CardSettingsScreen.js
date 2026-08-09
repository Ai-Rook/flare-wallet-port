import ScreenHeader from '../../components/ScreenHeader';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import AnimatedProgress from '../../components/AnimatedProgress';

// Card settings menu items
const CARD_SETTINGS = [
  { id: 'lock', label: 'Lock / Unlock Card', icon: '🔒', screen: null },
  { id: 'pin', label: 'Change PIN', icon: '🔑', screen: null },
  { id: 'limits', label: 'Manage Limits', icon: '👁', screen: null },
  { id: 'activate', label: 'Activate Card', icon: '✅', screen: null },
  { id: 'add', label: 'Add New Card', icon: '➕', screen: null },
];

export default function CardSettingsScreen({ navigation, route }) {
  const [cardLocked, setCardLocked] = useState(false);
  const [dailyLimit, setDailyLimit] = useState(5000);
  const [monthlyLimit, setMonthlyLimit] = useState(25000);
  const limitAnim = useState(new Animated.Value(0))[0];

  const toggleLock = () => {
    setCardLocked(!cardLocked);
    Animated.spring(limitAnim, {
      toValue: cardLocked ? 0 : 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader pageName="Card Settings" onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Card status banner */}
        <Animated.View style={[styles.statusBanner, { transform: [{ scale: limitAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }] }]}>
          <View style={styles.statusRow}>
            <Text style={styles.statusIcon}>{cardLocked ? '🔒' : '🔓'}</Text>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>{cardLocked ? 'Card Locked' : 'Card Active'}</Text>
              <Text style={styles.statusSub}>{cardLocked ? 'All transactions blocked' : 'Your card is ready to use'}</Text>
            </View>
            <Switch
              value={!cardLocked}
              onValueChange={toggleLock}
              trackColor={{ false: '#FF3B30', true: '#4CD964' }}
              thumbColor="#FFF"
            />
          </View>
        </Animated.View>

        {/* Settings cards — two-column layout matching Flare */}
        <Text style={styles.sectionTitle}>Card Management</Text>
        <View style={styles.settingsGrid}>
          {CARD_SETTINGS.map((item, i) => (
            <SpringPress key={item.id} onPress={() => {}} activeScale={0.95}>
              <View style={[styles.settingCard, i % 2 === 0 && { marginRight: 8 }]}>
                <View style={styles.settingIconWrap}>
                  <Text style={styles.settingIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
            </SpringPress>
          ))}
        </View>

        {/* Flare.ng limits */}
        <Text style={styles.sectionTitle}>Flare.ng Limits</Text>
        <View style={styles.limitsCard}>
          <View style={styles.limitRow}>
            <View style={styles.limitInfo}>
              <Text style={styles.limitLabel}>Daily Limit</Text>
              <Text style={styles.limitValue}>${dailyLimit.toLocaleString()}</Text>
            </View>
            <AnimatedProgress value={0.7} color="#5856D6" height={6} duration={800} />
          </View>
          <View style={styles.limitDivider} />
          <View style={styles.limitRow}>
            <View style={styles.limitInfo}>
              <Text style={styles.limitLabel}>Monthly Limit</Text>
              <Text style={styles.limitValue}>${monthlyLimit.toLocaleString()}</Text>
            </View>
            <AnimatedProgress value={0.45} color="#5856D6" height={6} duration={800} />
          </View>
        </View>

        {/* Recent card activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          {[
            { merchant: 'Starbucks', amount: '$4.50', status: 'Approved', color: '#4CD964' },
            { merchant: 'Amazon', amount: '$89.99', status: 'Approved', color: '#4CD964' },
            { merchant: 'Declined TX', amount: '$250.00', status: 'Declined', color: '#FF3B30' },
          ].map((tx, i) => (
            <View key={i} style={[styles.activityRow, i < 2 && styles.activityRowBorder]}>
              <View style={styles.activityDot({ color: tx.color })} />
              <Text style={styles.activityMerchant}>{tx.merchant}</Text>
              <Text style={styles.activityAmount}>{tx.amount}</Text>
              <Text style={[styles.activityStatus, { color: tx.color }]}>{tx.status}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
  },
  backBtn: { padding: 8 },
  backIcon: { color: '#FFF', fontSize: 22 },
  headerBrand: { color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  headerPage: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '400' },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  // Status banner
  statusBanner: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
    marginBottom: 20,
  },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusIcon: { fontSize: 28, marginRight: 12 },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
  statusSub: { fontSize: 12, color: '#8E8E93', marginTop: 2 },

  // Section
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 10, marginTop: 4 },

  // Settings grid — two columns like Flare
  settingsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  settingCard: {
    width: '47%', backgroundColor: '#FFFFFF', borderRadius: 14,
    padding: 16, alignItems: 'center', marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  settingIconWrap: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  settingIcon: { fontSize: 22 },
  settingLabel: { fontSize: 12, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },

  // Limits card
  limitsCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    marginBottom: 20,
  },
  limitRow: { paddingVertical: 8 },
  limitInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  limitLabel: { fontSize: 14, fontWeight: '500', color: '#8E8E93' },
  limitValue: { fontSize: 14, fontWeight: '700', color: '#1C1C1E' },
  limitDivider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 4 },

  // Activity card
  activityCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    marginBottom: 30,
  },
  activityRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
  },
  activityRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA' },
  activityDot: ({ color }) => ({
    width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 10,
  }),
  activityMerchant: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', flex: 1 },
  activityAmount: { fontSize: 14, fontWeight: '600', color: '#1C1C1E', marginRight: 12 },
  activityStatus: { fontSize: 12, fontWeight: '600' },
});

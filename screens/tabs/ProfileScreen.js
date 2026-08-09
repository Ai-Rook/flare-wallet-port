import ScreenHeader from '../../components/ScreenHeader';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch, StyleSheet, Image,
  SafeAreaView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import AnimatedProgress from '../../components/AnimatedProgress';
import PortfolioRing from '../../components/PortfolioRing';

const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'kyc', label: 'KYC Verification', icon: require('../../assets/profile-icons/kyc.png'), detail: 'Verified', color: '#4CD964', screen: 'KYC' },
      { id: 'security', label: 'Security', icon: require('../../assets/profile-icons/security.png'), detail: '2FA Enabled', color: '#5856D6', screen: 'CardSettings' },
      { id: 'linked', label: 'Linked Banks', icon: require('../../assets/profile-icons/banks.png'), detail: '1 connected', color: '#007AFF', screen: 'BankLink' },
    ],
  },
  {
    title: 'Card',
    items: [
      { id: 'lock', label: 'Lock Card', icon: require('../../assets/profile-icons/lock.png'), detail: 'Active', color: '#4CD964', toggle: true },
      { id: 'pin', label: 'Change PIN', icon: require('../../assets/profile-icons/pin.png'), detail: '', color: '#FF9500', screen: 'CardSettings' },
      { id: 'limits', label: 'Spending Limits', icon: require('../../assets/profile-icons/limits.png'), detail: '$5K/day', color: '#5856D6', screen: 'CardSettings' },
      { id: 'activate', label: 'Activate Card', icon: require('../../assets/profile-icons/activate.png'), detail: '', color: '#007AFF', screen: 'CardOrder' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: require('../../assets/profile-icons/notifications.png'), detail: 'On', color: '#FF3B30', toggle: true },
      { id: 'biometric', label: 'Biometric Login', icon: require('../../assets/profile-icons/biometric.png'), detail: 'Face ID', color: '#5856D6', toggle: true },
      { id: 'currency', label: 'Default Currency', icon: require('../../assets/profile-icons/currency.png'), detail: 'USD', color: '#4CD964', screen: 'CardSettings' },
      { id: 'language', label: 'Language', icon: require('../../assets/profile-icons/language.png'), detail: 'English', color: '#007AFF', screen: 'CardSettings' },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const [cardLocked, setCardLocked] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [biometricOn, setBiometricOn] = useState(true);

  const toggleMap = {
    lock: { value: !cardLocked, setter: () => setCardLocked(!cardLocked) },
    notifications: { value: notificationsOn, setter: () => setNotificationsOn(!notificationsOn) },
    biometric: { value: biometricOn, setter: () => setBiometricOn(!biometricOn) },
  };

  const handleItemPress = (item) => {
    if (item.toggle && toggleMap[item.id]) {
      toggleMap[item.id].setter();
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader pageName="Profile" />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
 style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JS</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>John Smith</Text>
            <Text style={styles.userEmail}>john@flarewallet.app</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified</Text>
          </View>
        </View>

        {/* Portfolio summary */}
        <View style={styles.portfolioCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <PortfolioRing
              size={80}
              thickness={5}
              segments={[
                { value: 0.45, color: '#FF9500' },
                { value: 0.25, color: '#55D987' },
                { value: 0.2, color: '#1E95EA' },
              ]}
              duration={800}
              glowColor="#5856D6"
              centerContent={
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#1C3040' }}>$87.9K</Text>
              }
            />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.portfolioLabel}>Portfolio Value</Text>
              <Text style={styles.portfolioValue}>$87,963.34</Text>
              <AnimatedProgress value={0.65} color="#4CD964" height={4} duration={800} />
              <Text style={styles.portfolioSub}>65% of portfolio in BTC</Text>
            </View>
          </View>
        </View>

        {/* Settings sections — iOS-style full-width rows */}
        {SETTINGS_SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => {
                const isLast = i === section.items.length - 1;
                return (
                  <SpringPress key={item.id} onPress={() => handleItemPress(item)} activeScale={0.98}>
                    <View style={[styles.row, !isLast && styles.rowBorder]}>
                      <View style={[styles.rowIcon, { backgroundColor: item.color + '18' }]}>
                        <Image source={item.icon} style={[styles.rowIconImg, { tintColor: item.color }]} resizeMode="contain" />
                      </View>
                      <Text style={styles.rowLabel}>{item.label}</Text>
                      <View style={styles.rowRight}>
                        {item.toggle && toggleMap[item.id] ? (
                          <Switch
                            value={toggleMap[item.id].value}
                            onValueChange={toggleMap[item.id].setter}
                            trackColor={{ false: '#E5E5EA', true: '#4CD964' }}
                            thumbColor="#FFF"
                            style={{ transform: [{ scale: 0.8 }] }}
                          />
                        ) : (
                          <>
                            {item.detail ? <Text style={styles.rowDetail}>{item.detail}</Text> : null}
                            {!item.toggle && <Text style={styles.rowChevron}>›</Text>}
                          </>
                        )}
                      </View>
                    </View>
                  </SpringPress>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout */}
        <SpringPress onPress={() => {}} activeScale={0.98}>
          <View style={styles.logoutCard}>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </SpringPress>
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
  headerBrand: { color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  headerPage: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '400' },

  content: { flex: 1, paddingTop: 12 },

  // User card
  userCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 16, marginHorizontal: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#5856D6',
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: '700', color: '#1C1C1E' },
  userEmail: { fontSize: 13, color: '#8E8E93', marginTop: 2 },
  verifiedBadge: {
    backgroundColor: '#4CD96420', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },
  verifiedText: { color: '#4CD964', fontSize: 12, fontWeight: '700' },

  // Portfolio
  portfolioCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16,
    marginHorizontal: 16, marginBottom: 20,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  portfolioLabel: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 4 },
  portfolioValue: { fontSize: 28, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 },
  portfolioSub: { fontSize: 11, color: '#8E8E93', marginTop: 4 },

  // Sections — iOS Settings style
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 6, marginHorizontal: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, marginHorizontal: 16,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },

  // Rows
  row: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12,
  },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA' },
  rowIcon: {
    width: 32, height: 32, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  rowIconImg: { width: 20, height: 20 },
  rowLabel: { flex: 1, fontSize: 16, color: '#1C1C1E', fontWeight: '500' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rowDetail: { fontSize: 15, color: '#8E8E93', fontWeight: '400' },
  rowChevron: { fontSize: 24, color: '#C7C7CC', fontWeight: '300', marginTop: -2 },

  // Logout
  logoutCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14,
    marginHorizontal: 16, paddingVertical: 14, alignItems: 'center',
    marginBottom: 40, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  logoutText: { color: '#FF3B30', fontSize: 17, fontWeight: '600' },
});

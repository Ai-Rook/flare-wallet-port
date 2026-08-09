import ScreenHeader from '../../components/ScreenHeader';
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import AnimatedProgress from '../../components/AnimatedProgress';

const REWARDS = [
  { id: 1, title: 'First Purchase', desc: 'Make your first crypto purchase', points: 100, icon: '🛒', earned: true },
  { id: 2, title: 'Card Activator', desc: 'Activate your Flare card', points: 250, icon: '💳', earned: true },
  { id: 3, title: 'Referral Master', desc: 'Refer 3 friends to Flare', points: 500, icon: '👥', earned: false, progress: '1/3' },
  { id: 4, title: 'HODLer', desc: 'Hold $1,000+ in crypto for 30 days', points: 300, icon: '💎', earned: false, progress: '12/30 days' },
  { id: 5, title: 'Trader Pro', desc: 'Complete 10 exchanges', points: 400, icon: '📊', earned: false, progress: '3/10' },
  { id: 6, title: 'Early Adopter', desc: 'Join within first 6 months', points: 150, icon: '⭐', earned: true },
];

export default function RewardsScreen({ navigation }) {
  const totalPoints = REWARDS.filter(r => r.earned).reduce((sum, r) => sum + r.points, 0);
  const totalAvailable = REWARDS.reduce((sum, r) => sum + r.points, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScreenHeader
        pageName="Rewards"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
 style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Points hero */}
        <LinearGradient
          colors={['#5856D6', '#7B79E8']}
          style={styles.pointsHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.pointsLabel}>Your Points</Text>
          <Text style={styles.pointsValue}>{totalPoints.toLocaleString()}</Text>
          <Text style={styles.pointsSub}>of {totalAvailable.toLocaleString()} available</Text>
          <AnimatedProgress value={totalPoints / totalAvailable} color="#FFFFFF" height={6} duration={1000} />
        </LinearGradient>

        {/* Tier status */}
        <View style={styles.tierRow}>
          <View style={styles.tierCard}>
            <Text style={styles.tierIcon}>🥉</Text>
            <Text style={styles.tierName}>Bronze</Text>
          </View>
          <View style={styles.tierArrow}>→</View>
          <View style={[styles.tierCard, styles.tierActive]}>
            <Text style={styles.tierIcon}>🥈</Text>
            <Text style={styles.tierName}>Silver</Text>
          </View>
          <View style={styles.tierArrow}>→</View>
          <View style={styles.tierCard}>
            <Text style={styles.tierIcon}>🥇</Text>
            <Text style={styles.tierName}>Gold</Text>
          </View>
        </View>

        {/* Rewards list */}
        <Text style={styles.sectionTitle}>Earn Rewards</Text>
        {REWARDS.map(reward => (
          <SpringPress key={reward.id} activeScale={0.97}>
            <View style={[styles.rewardCard, reward.earned && styles.rewardCardEarned]}>
              <View style={styles.rewardIconWrap}>
                <Text style={styles.rewardIcon}>{reward.icon}</Text>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, reward.earned && { color: '#8E8E93' }]}>{reward.title}</Text>
                <Text style={styles.rewardDesc}>{reward.desc}</Text>
                {reward.progress && (
                  <Text style={styles.rewardProgress}>{reward.progress}</Text>
                )}
              </View>
              <View style={styles.rewardPointsWrap}>
                {reward.earned ? (
                  <Text style={styles.rewardEarnedCheck}>✓</Text>
                ) : (
                  <Text style={styles.rewardPoints}>+{reward.points}</Text>
                )}
              </View>
            </View>
          </SpringPress>
        ))}
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
  headerIcon: { fontSize: 22 },
  profileBtn: { padding: 8 },

  content: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },

  // Points hero
  pointsHero: {
    borderRadius: 16, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 4,
  },
  pointsLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  pointsValue: { color: '#FFF', fontSize: 42, fontWeight: '700', letterSpacing: -1 },
  pointsSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, marginTop: 2, marginBottom: 12 },

  // Tier row
  tierRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, gap: 8 },
  tierCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, alignItems: 'center', width: 80,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  tierActive: { borderWidth: 2, borderColor: '#5856D6' },
  tierIcon: { fontSize: 28, marginBottom: 4 },
  tierName: { fontSize: 11, fontWeight: '700', color: '#1C1C1E' },
  tierArrow: { fontSize: 16, color: '#8E8E93' },

  // Section
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 10 },

  // Reward cards
  rewardCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF',
    borderRadius: 14, padding: 14, marginBottom: 8,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  rewardCardEarned: { opacity: 0.6 },
  rewardIconWrap: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  rewardIcon: { fontSize: 22 },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  rewardDesc: { fontSize: 12, color: '#8E8E93', marginTop: 1 },
  rewardProgress: { fontSize: 11, fontWeight: '600', color: '#5856D6', marginTop: 2 },
  rewardPointsWrap: { alignItems: 'flex-end' },
  rewardPoints: { fontSize: 15, fontWeight: '700', color: '#5856D6' },
  rewardEarnedCheck: { fontSize: 20, color: '#4CD964', fontWeight: '700' },
});

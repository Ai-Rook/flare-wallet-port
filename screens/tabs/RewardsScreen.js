import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../constants/colors';
import { useLivePrices } from '../services/LivePriceService';
import ScreenHeader from '../components/ScreenHeader';

export default function RewardsScreen({ navigation }) {
  const { prices } = useLivePrices();

  const stakingRewards = [
    { asset: 'FLR', apy: '8.5%', earned: 12.5, amount: 1250 },
    { asset: 'FXRP', apy: '6.2%', earned: 3.8, amount: 1840 },
    { asset: 'FETH', apy: '5.8%', earned: 14.2, amount: 1.205 },
  ];

  const ftsoDelegation = [
    { provider: 'Flare Labs', apy: '9.2%', delegated: 500, rank: 1 },
    { provider: 'Blaze Node', apy: '8.7%', delegated: 400, rank: 2 },
    { provider: 'Northern Node', apy: '7.9%', delegated: 350, rank: 3 },
  ];

  const totalEarned = stakingRewards.reduce((sum, r) => sum + r.earned, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Rewards" subtitle="Staking & FTSO Delegation" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Total Earned */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Rewards Earned</Text>
          <Text style={styles.totalValue}>${totalEarned.toFixed(2)}</Text>
          <Text style={styles.totalSub}>Across all staking & delegation</Text>
        </View>

        {/* Staking Rewards */}
        <Text style={styles.sectionTitle}>Staking Rewards</Text>
        {stakingRewards.map(r => {
          const priceData = prices[r.asset.replace('F', '')] || prices[r.asset];
          const usdValue = r.earned * (priceData?.price || 1);
          return (
            <View key={r.asset} style={styles.rewardCard}>
              <View style={styles.rewardIcon}>
                <Text style={styles.rewardIconText}>{r.asset.slice(0, 2)}</Text>
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardAsset}>{r.asset} Staking</Text>
                <Text style={styles.rewardAmount}>{r.amount} {r.asset} staked</Text>
              </View>
              <View style={styles.rewardRight}>
                <Text style={styles.rewardAPY}>{r.apy} APY</Text>
                <Text style={styles.rewardEarned}>+{r.earned} {r.asset}</Text>
                <Text style={styles.rewardUsd}>≈ ${usdValue.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}

        {/* FTSO Delegation */}
        <Text style={styles.sectionTitle}>FTSO Delegation</Text>
        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>💡 Delegate FLR to FTSO data providers to earn rewards. Vote-power determines your share of inflation rewards.</Text>
        </View>
        {ftsoDelegation.map(p => (
          <View key={p.provider} style={styles.providerCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{p.rank}</Text>
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{p.provider}</Text>
              <Text style={styles.providerDelegated}>{p.delegated} FLR delegated</Text>
            </View>
            <View style={styles.providerRight}>
              <Text style={styles.providerAPY}>{p.apy} APY</Text>
            </View>
          </View>
        ))}

        {/* Claim Button */}
        <TouchableOpacity style={styles.claimBtn}>
          <Text style={styles.claimBtnText}>Claim All Rewards</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  totalCard: { backgroundColor: Colors.primary, borderRadius: 20, padding: 24, marginBottom: 16 },
  totalLabel: { fontSize: 14, color: '#FFF', opacity: 0.8 },
  totalValue: { fontSize: 40, fontWeight: '800', color: '#FFF', marginTop: 4 },
  totalSub: { fontSize: 12, color: '#FFF', opacity: 0.7, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12, marginTop: 8 },
  rewardCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  rewardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rewardIconText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  rewardInfo: { flex: 1 },
  rewardAsset: { fontSize: 14, fontWeight: '700', color: Colors.text },
  rewardAmount: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  rewardRight: { alignItems: 'flex-end' },
  rewardAPY: { fontSize: 14, fontWeight: '700', color: Colors.success },
  rewardEarned: { fontSize: 12, color: Colors.text, marginTop: 2 },
  rewardUsd: { fontSize: 11, color: Colors.textMuted },
  infoBanner: { backgroundColor: Colors.primary + '10', borderRadius: 12, padding: 12, marginBottom: 12 },
  infoText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: Colors.border },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.amber + '30', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rankText: { fontSize: 14, fontWeight: '700', color: Colors.deepOrange },
  providerInfo: { flex: 1 },
  providerName: { fontSize: 14, fontWeight: '600', color: Colors.text },
  providerDelegated: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  providerRight: { alignItems: 'flex-end' },
  providerAPY: { fontSize: 14, fontWeight: '700', color: Colors.success },
  claimBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 16, marginBottom: 32 },
  claimBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

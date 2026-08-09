import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import AnimatedProgress from '../../components/AnimatedProgress';
import CardStackReveal from '../../components/CardStackReveal';

const CARD_TIERS = [
  { id: 'starter', name: 'Starter', price: 0, color1: '#8E8E93', color2: '#AEAEB2', features: ['Virtual card only', '$1K monthly limit', 'Basic rewards'] },
  { id: 'gold', name: 'Gold', price: 49, color1: '#B8860B', color2: '#DAA520', features: ['Physical + virtual', '$5K monthly limit', '2x rewards', 'Priority support'] },
  { id: 'platinum', name: 'Platinum', price: 149, color1: '#636366', color2: '#8E8E93', features: ['Metal card', '$25K monthly limit', '3x rewards', '24/7 concierge', 'Airport lounge'] },
  { id: 'black', name: 'Black', price: 499, color1: '#1C1C1E', color2: '#3A3A3C', features: ['Premium metal', 'Unlimited', '5x rewards', 'Dedicated manager', 'Lounge access', 'Insurance'] },
];

export default function CardOrderScreen({ navigation }) {
  const [selectedTier, setSelectedTier] = useState('gold');
  const [step, setStep] = useState('browse'); // browse → confirm → ordered → success
  const [successScale] = useState(new Animated.Value(0));

  const selected = CARD_TIERS.find(t => t.id === selectedTier);

  useEffect(() => {
    if (step === 'success') {
      Animated.spring(successScale, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }).start();
    }
  }, [step]);

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <View style={styles.successCircle}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Ready to Use!</Text>
            <Text style={styles.successSub}>Your {selected.name} card is active</Text>
            {/* Card stack reveal — 3D depth like Flare */}
            <CardStackReveal count={2} offset={10} stagger={100} cardStyle={{ height: 80, borderRadius: 12, backgroundColor: selected.color1 }}>
              <View style={{ height: 80, borderRadius: 14, backgroundColor: '#1C1C1E', padding: 16, justifyContent: 'center' }}>
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Flare {selected.name}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 }}>•••• 4242</Text>
              </View>
            </CardStackReveal>
            <View style={styles.trackingCard}>
              <Text style={styles.trackingLabel}>Estimated Delivery</Text>
              <Text style={styles.trackingValue}>5-7 business days</Text>
              <AnimatedProgress value={0.15} color="#4CD964" height={4} duration={600} style={{ marginTop: 8 }} />
              <Text style={styles.trackingStatus}>Order confirmed</Text>
            </View>
            <SpringPress onPress={() => { setStep('browse'); navigation.goBack?.(); }} activeScale={0.95}>
              <View style={{ backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 18, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 }}>
                <Text style={{ color: '#1E95EA', fontSize: 17, fontWeight: '700' }}>Ok</Text>
              </View>
            </SpringPress>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 'ordered') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <Text style={{ fontSize: 60, marginBottom: 16 }}>🎉</Text>
            <Text style={styles.successTitle}>Congratulations!</Text>
            <Text style={styles.successSub}>You've ordered the {selected.name} Card</Text>
            <Text style={styles.orderTotal}>${selected.price}.00</Text>
            <SpringPress onPress={() => setStep('success')} activeScale={0.95}>
              <LinearGradient colors={['#5856D6', '#7B79E8']} style={styles.actionBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.actionBtnText}>Track Order</Text>
              </LinearGradient>
            </SpringPress>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName="Order Card" onBack={() => navigation.goBack?.()} />

      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Choose Your Card</Text>

        {/* Tier cards */}
        {CARD_TIERS.map(tier => {
          const isSelected = selectedTier === tier.id;
          return (
            <SpringPress key={tier.id} onPress={() => setSelectedTier(tier.id)} activeScale={0.97}>
              <View style={[styles.tierCard, isSelected && styles.tierCardSelected]}>
                <LinearGradient
                  colors={[tier.color1, tier.color2]}
                  style={styles.tierBadge}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.tierBadgeText}>{tier.name}</Text>
                </LinearGradient>
                <Text style={styles.tierPrice}>{tier.price === 0 ? 'FREE' : `$${tier.price}`}</Text>
                <View style={styles.tierFeatures}>
                  {tier.features.map((f, i) => (
                    <Text key={i} style={styles.tierFeature}>✓ {f}</Text>
                  ))}
                </View>
                {isSelected && <View style={styles.tierCheck}><Text style={styles.tierCheckText}>✓</Text></View>}
              </View>
            </SpringPress>
          );
        })}

        {/* Order summary */}
        {selected.price > 0 && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{selected.name} Card</Text>
              <Text style={styles.summaryValue}>${selected.price}.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>Free</Text>
            </View>
            <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: '#E5E5EA', paddingTop: 8 }]}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalValue}>${selected.price}.00</Text>
            </View>
          </View>
        )}

        {/* Order button */}
        <SpringPress
          onPress={() => setStep(selected.price > 0 ? 'ordered' : 'success')}
          activeScale={0.95}
        >
          <LinearGradient colors={['#5856D6', '#7B79E8']} style={styles.actionBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.actionBtnText}>
              {selected.price === 0 ? 'Get Free Card' : `Order for $${selected.price}`}
            </Text>
          </LinearGradient>
        </SpringPress>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backBtn: { padding: 8 },
  backIcon: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', marginBottom: 16 },

  // Tier cards
  tierCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
    borderWidth: 2, borderColor: 'transparent',
  },
  tierCardSelected: { borderColor: '#5856D6' },
  tierBadge: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 8, marginBottom: 8,
  },
  tierBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  tierPrice: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 },
  tierFeatures: { gap: 4 },
  tierFeature: { fontSize: 13, color: '#3C3C43', fontWeight: '500' },
  tierCheck: {
    position: 'absolute', top: 12, right: 12, width: 24, height: 24,
    borderRadius: 12, backgroundColor: '#5856D6', alignItems: 'center', justifyContent: 'center',
  },
  tierCheckText: { color: '#FFF', fontSize: 12, fontWeight: '700' },

  // Summary
  summaryCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginVertical: 12,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1,
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginBottom: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 15, color: '#8E8E93' },
  summaryValue: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  summaryTotal: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  summaryTotalValue: { fontSize: 16, fontWeight: '700', color: '#5856D6' },

  // Buttons
  actionBtn: {
    borderRadius: 14, paddingVertical: 16, alignItems: 'center',
    marginTop: 8, marginBottom: 30,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 3,
  },
  actionBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },

  // Result screens
  resultOverlay: { flex: 1, backgroundColor: '#F2F2F7', justifyContent: 'center', paddingHorizontal: 24 },
  resultCard: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 32, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 8,
  },
  successCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#4CD964', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successIcon: { fontSize: 36, color: '#FFF', fontWeight: '700' },
  successTitle: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  successSub: { fontSize: 15, color: '#8E8E93', marginBottom: 16, textAlign: 'center' },
  orderTotal: { fontSize: 32, fontWeight: '700', color: '#5856D6', marginBottom: 16 },
  trackingCard: {
    width: '100%', backgroundColor: '#F2F2F7', borderRadius: 12, padding: 14, marginBottom: 20,
  },
  trackingLabel: { fontSize: 12, color: '#8E8E93', fontWeight: '600' },
  trackingValue: { fontSize: 16, fontWeight: '700', color: '#1C1C1E', marginTop: 2 },
  trackingStatus: { fontSize: 11, color: '#4CD964', fontWeight: '600', marginTop: 4 },
});

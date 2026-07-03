// ============================================================
// components/CardTierBadge.js — Card tier badge component
// Shows Simple (blue) / Signature (gray) / Black (gold) badge
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../constants/colors';

const TIER_CONFIG = {
  simple: { label: 'Simple', color: BRAND_COLORS.tierSimple, bg: '#E8F0FD', text: '#fff' },
  signature: { label: 'Signature', color: BRAND_COLORS.tierSignature, bg: '#EEF1F5', text: '#fff' },
  black: { label: 'Black', color: BRAND_COLORS.tierBlack, bg: '#1A1A1A', text: BRAND_COLORS.gold },
};

export function CardTierBadge({ tier = 'simple', size = 'md' }) {
  const config = TIER_CONFIG[tier] || TIER_CONFIG.simple;
  const isLarge = size === 'lg';

  return (
    <View style={[
      styles.badge,
      { backgroundColor: config.bg, borderColor: config.color },
      isLarge && styles.badgeLarge,
    ]}>
      {tier === 'black' && (
        <View style={[styles.goldLine, isLarge && styles.goldLineLarge]} />
      )}
      <Text style={[
        styles.label,
        { color: config.text, borderColor: config.color },
        isLarge && styles.labelLarge,
      ]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
       alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  badgeLarge: { paddingHorizontal: 12, paddingVertical: 6 },
  goldLine: { width: 4, height: 20, backgroundColor: BRAND_COLORS.gold, borderRadius: 2, marginRight: 6 },
  goldLineLarge: { width: 6, height: 28 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  labelLarge: { fontSize: 14 },
});

export default CardTierBadge;
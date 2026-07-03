// ============================================================
// components/BalanceRow.js — Wallet/asset balance row
// Reusable row showing: token icon | name/symbol | balance | fiat value
// ============================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TokenIcon } from './TokenIcon';
import { BRAND_COLORS } from '../constants/colors';

export function BalanceRow({ tokenId, name, symbol, balance, fiatValue, onPress, style }) {
  return (
    <TouchableOpacity
      style={[styles.row, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <TokenIcon tokenId={tokenId} size={40} style={{ marginRight: 12 }} />
      <View style={styles.info}>
        <Text style={styles.name}>{name || symbol}</Text>
        <Text style={styles.symbol}>{symbol}</Text>
      </View>
      <View style={styles.amounts}>
        <Text style={styles.balance}>{balance != null ? balance : '—'}</Text>
        {fiatValue != null && (
          <Text style={styles.fiat}>${fiatValue?.toFixed(2)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function BalanceRowSkeleton() {
  return (
    <View style={styles.row}>
      <View style={[styles.skeletonIcon]} />
      <View style={styles.info}>
        <View style={[styles.skeletonText, { width: 80 }]} />
        <View style={[styles.skeletonText, { width: 40 }]} />
      </View>
      <View style={styles.amounts}>
        <View style={[styles.skeletonText, { width: 60, alignSelf: 'flex-end' }]} />
        <View style={[styles.skeletonText, { width: 50, alignSelf: 'flex-end' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: BRAND_COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
  },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '600', color: BRAND_COLORS.textPrimary },
  symbol: { fontSize: 13, color: BRAND_COLORS.textTertiary, marginTop: 2 },
  amounts: { alignItems: 'flex-end' },
  balance: { fontSize: 15, fontWeight: '600', color: BRAND_COLORS.textPrimary },
  fiat: { fontSize: 13, color: BRAND_COLORS.textTertiary, marginTop: 2 },
  skeletonIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND_COLORS.border, marginRight: 12 },
  skeletonText: { height: 12, borderRadius: 6, backgroundColor: BRAND_COLORS.border, marginTop: 4 },
});

export default BalanceRow;
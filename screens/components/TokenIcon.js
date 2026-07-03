// ============================================================
// components/TokenIcon.js — Token/coin icon component
// Shows colored circle with symbol, fallback to emoji glyph
// ============================================================
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TOKEN_ICONS } from '../constants/tokens';

const TOKEN_EMOJI = {
  bitcoin: '₿',
  ethereum: 'Ξ',
  solana: '◎',
  ripple: '✕',
  dogecoin: 'Ð',
  cardano: '₳',
  polkadot: '●',
  litecoin: 'Ł',
};

export function TokenIcon({ tokenId, size = 40, style }) {
  const tokenInfo = TOKEN_ICONS[tokenId];
  const color = tokenInfo?.color || '#8892A0';
  const label = tokenInfo?.symbol || tokenId?.toUpperCase().slice(0, 3) || '?';

  return (
    <View style={[
      styles.container,
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      style,
    ]}>
      <Text style={[styles.label, { fontSize: size * 0.3 }]}>{label}</Text>
    </View>
  );
}

export function TokenIconLarge({ tokenId, size = 56 }) {
  return <TokenIcon tokenId={tokenId} size={size} />;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default TokenIcon;
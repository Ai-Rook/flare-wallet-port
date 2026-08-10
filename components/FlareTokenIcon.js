// FlareTokenIcon — Orange pencil-outline style token icons
// Pure React Native — no SVG library needed, no clip art
// Circle outline + symbol glyph in Sunkist orange
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

// FAsset → underlying symbol mapping for price lookups
export const FASSET_UNDERLYING = {
  FBTC: 'BTC', FETH: 'ETH', FXRP: 'XRP', FDOGE: 'DOGE',
};

// Symbol glyphs for each token — hand-picked unicode chars
const GLYPHS = {
  BTC: '₿', FBTC: '₿',
  ETH: 'Ξ', FETH: 'Ξ',
  XRP: '✕', FXRP: '✕',
  DOGE: 'Ð', FDOGE: 'Ð',
  FLR: '◉',
  SOL: '◎',
  LTC: 'Ł',
  ADA: '₳',
  USDC: '$',
  USDT: '₮',
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
};

export default function FlareTokenIcon({ symbol, size = 40, color, style }) {
  const strokeColor = color || Colors.primary;
  const sym = symbol?.toUpperCase() || '?';
  const glyph = GLYPHS[sym] || sym[0] || '?';
  const isFAsset = sym.startsWith('F') && sym !== 'FLR';
  const fontSize = size * 0.42;

  return (
    <View style={[
      styles.container,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        borderColor: strokeColor,
        borderWidth: 2.5,
      },
      style,
    ]}>
      {/* FAsset inner dashed ring */}
      {isFAsset && (
        <View style={[
          styles.innerRing,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: (size * 0.72) / 2,
            borderColor: strokeColor,
          },
        ]} />
      )}
      <Text style={[
        styles.glyph,
        { fontSize, color: strokeColor },
      ]}>
        {glyph}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  innerRing: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
    opacity: 0.35,
  },
  glyph: {
    fontWeight: '700',
    fontFamily: 'serif',
    includeFontPadding: false,
    textAlign: 'center',
  },
});

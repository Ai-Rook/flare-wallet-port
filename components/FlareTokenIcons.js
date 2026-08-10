// FlareTokenIcons.js — SVG-based icons for Flare tokens
// Generated as React components so they render crisp at any size

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ICON_SIZE = 44;

export function FlareIcon({ size = ICON_SIZE }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#FFD700' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.45 }]}>◉</Text>
    </View>
  );
}

export function FXRPIcon({ size = ICON_SIZE }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#23292F' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.4, color: '#FF9F1C' }]}>✕</Text>
    </View>
  );
}

export function FBTCIcon({ size = ICON_SIZE }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#F7931A' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.45 }]}>₿</Text>
    </View>
  );
}

export function FETHIcon({ size = ICON_SIZE }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#627EEA' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.4 }]}>Ξ</Text>
    </View>
  );
}

export function FDOGEIcon({ size = ICON_SIZE }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#C2A633' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.45 }]}>Ð</Text>
    </View>
  );
}

export function USDCIcon({ size = ICON_SIZE }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#2775CA' }]}>
      <Text style={[styles.iconText, { fontSize: size * 0.35 }]}>$</Text>
    </View>
  );
}

// Icon picker by symbol
export function FlareTokenIcon({ symbol, size = ICON_SIZE }) {
  switch (symbol) {
    case 'FLR': return <FlareIcon size={size} />;
    case 'FXRP': return <FXRPIcon size={size} />;
    case 'FBTC': return <FBTCIcon size={size} />;
    case 'FETH': return <FETHIcon size={size} />;
    case 'FDOGE': return <FDOGEIcon size={size} />;
    case 'USDC': return <USDCIcon size={size} />;
    default: return (
      <View style={[styles.circle, { width: size, height: size, borderRadius: size/2, backgroundColor: '#FF9F1C' }]}>
        <Text style={[styles.iconText, { fontSize: size * 0.4 }]}>F</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

export default FlareTokenIcon;

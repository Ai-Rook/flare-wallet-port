// TokenIcon — renders a real token icon from CoinMarketCap
// Falls back to colored rounded-square with symbol text
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export const iconMap = {
  bitcoin: require('../assets/tokens/btc.png'),
  ethereum: require('../assets/tokens/eth.png'),
  'usd-coin': require('../assets/tokens/usdc.png'),
  tether: require('../assets/tokens/usdt.png'),
  litecoin: require('../assets/tokens/ltc.png'),
  'bitcoin-cash': require('../assets/tokens/bch.png'),
  cardano: require('../assets/tokens/ada.png'),
  polkadot: require('../assets/tokens/dot.png'),
  chainlink: require('../assets/tokens/link.png'),
  uniswap: require('../assets/tokens/uni.png'),
  solana: require('../assets/tokens/sol.png'),
  ripple: require('../assets/tokens/xrp.png'),
  dogecoin: require('../assets/tokens/doge.png'),
  'shiba-inu': require('../assets/tokens/shib.png'),
  avalanche: require('../assets/tokens/avax.png'),
  polygon: require('../assets/tokens/matic.png'),
  cosmos: require('../assets/tokens/atom.png'),
  stellar: require('../assets/tokens/xlm.png'),
  // Fiat — still use our styled icons
  usd: require('../assets/tokens/usd.png'),
  cad: require('../assets/tokens/cad.png'),
  eur: require('../assets/tokens/eur.png'),
  gbp: require('../assets/tokens/gbp.png'),
  aud: require('../assets/tokens/aud.png'),
};

export default function TokenIcon({ token, size = 40, style }) {
  const iconSource = token?.id ? iconMap[token.id] : null;

  if (iconSource) {
    return (
      <Image
        source={iconSource}
        style={[{ width: size, height: size, borderRadius: size / 5 }, style]}
        resizeMode="contain"
      />
    );
  }

  // Fallback: rounded-square with text
  return (
    <View style={[styles.fallback, { backgroundColor: token?.color || '#999', width: size, height: size, borderRadius: size / 5 }, style]}>
      <Text style={[styles.fallbackText, { fontSize: size * 0.4 }]}>{token?.icon || token?.symbol?.[0] || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#FFF',
    fontWeight: '700',
  },
});

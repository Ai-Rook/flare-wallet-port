// PortfolioHero — Orange pencil-outline icon, NO clip art PNGs
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FlareTokenIcon, { FASSET_UNDERLYING } from './FlareTokenIcon';
import { Colors } from '../constants/colors';

export default function PortfolioHero({ symbol, price, change24h, holdings, fiatValue }) {
  const isPositive = change24h >= 0;

  return (
    <View style={styles.hero}>
      {/* Left: Price info */}
      <View style={styles.priceSection}>
        <Text style={styles.priceLabel}>{symbol} Price</Text>
        <Text style={styles.priceValue}>{price}</Text>
        <Text style={[styles.changeText, { color: isPositive ? Colors.success : Colors.error }]}>
          {isPositive ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}%
        </Text>
        <View style={styles.holdingsCard}>
          <Text style={styles.holdingsLabel}>Holdings</Text>
          <Text style={styles.holdingsAmount}>{holdings}</Text>
          <Text style={styles.holdingsFiat}>≈ {fiatValue}</Text>
        </View>
      </View>

      {/* Right: Token icon + card */}
      <View style={styles.cardSection}>
        <View style={styles.coinWrapper}>
          <FlareTokenIcon symbol={symbol} size={56} color={Colors.primary} />
        </View>
        <LinearGradient
          colors={[Colors.primary, Colors.deepOrange, '#1A1A2E']}
          style={styles.miniCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardTop}>
            <Text style={styles.cardBrand}>Flare</Text>
            <Text style={styles.cardType}>DEBIT</Text>
          </View>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <View style={styles.chipLine} />
              <View style={[styles.chipLine, { width: 12 }]} />
            </View>
            <Text style={styles.cardContactless}>📶</Text>
          </View>
          <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
          <View style={styles.cardBottom}>
            <View>
              <Text style={styles.cardLabel}>CVV: •••</Text>
              <Text style={styles.cardLabel}>EXP: 12/28</Text>
            </View>
            <Text style={styles.cardFooter}>DEBIT</Text>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, alignItems: 'flex-start' },
  priceSection: { flex: 1, paddingRight: 12 },
  priceLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500', marginBottom: 4 },
  priceValue: { fontSize: 28, fontWeight: '700', color: Colors.text, letterSpacing: -0.5, marginBottom: 4 },
  changeText: { fontSize: 15, fontWeight: '600', marginBottom: 16 },
  holdingsCard: { backgroundColor: Colors.background, borderRadius: 12, padding: 12 },
  holdingsLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', marginBottom: 2 },
  holdingsAmount: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  holdingsFiat: { fontSize: 13, color: Colors.textMuted },
  cardSection: { width: 180, position: 'relative' },
  coinWrapper: { position: 'absolute', top: -18, right: -8, zIndex: 2, shadowColor: '#000', shadowOffset: { width: 4, height: 6 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 10 },
  miniCard: { height: 120, borderRadius: 12, padding: 12, justifyContent: 'space-between', marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { color: '#FFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  cardType: { color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: '600', letterSpacing: 1 },
  chipRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: { width: 26, height: 20, backgroundColor: '#D4AF37', borderRadius: 3, padding: 3, justifyContent: 'space-evenly' },
  chipLine: { height: 1, backgroundColor: '#B8941F', borderRadius: 0.5, width: 16 },
  cardContactless: { fontSize: 10 },
  cardNumber: { color: '#FFF', fontSize: 11, fontWeight: '500', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 7, fontWeight: '500', marginBottom: 1 },
  cardFooter: { color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: '600', letterSpacing: 1 },
});

import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BTC_ICON = require('../assets/tokens/btc.png');

/**
 * HomeCardHero — compact CP debit card + BTC icon for the Home landing page.
 * Sits below the balance/hero area as a visual showcase.
 */
export default function HomeCardHero() {
  return (
    <View style={styles.container}>
      {/* BTC coin icon casting shadow from above-right */}
      <View style={styles.coinWrapper}>
        <Image source={BTC_ICON} style={styles.coinIcon} />
      </View>

      {/* CP Debit Card */}
      <LinearGradient
        colors={['#1A1A2E', '#16213E', '#0F3460']}
        style={styles.card}
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
            <Text style={styles.cardLabel}>CVV: ***</Text>
            <Text style={styles.cardLabel}>EXP: 12/28</Text>
          </View>
          <Text style={styles.cardFooter}>DEBIT</Text>
        </View>
      </LinearGradient>

      <Text style={styles.cardCaption}>Flare Debit Card</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    position: 'relative',
    alignItems: 'center',
  },
  coinWrapper: {
    position: 'absolute',
    top: -16,
    right: 24,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 10,
  },
  coinIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'contain',
  },
  card: {
    width: '100%',
    height: 150,
    borderRadius: 14,
    padding: 14,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardType: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chip: {
    width: 24,
    height: 18,
    backgroundColor: '#D4AF37',
    borderRadius: 3,
    padding: 3,
    justifyContent: 'space-evenly',
  },
  chipLine: {
    height: 1,
    backgroundColor: '#B8941F',
    borderRadius: 0.5,
    width: 14,
  },
  cardContactless: {
    fontSize: 9,
  },
  cardNumber: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 8,
    fontWeight: '500',
    marginBottom: 1,
  },
  cardFooter: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cardCaption: {
    color: '#8E8E93',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});

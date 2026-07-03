import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, SafeAreaView, StatusBar, Animated, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { TOKENS } from '../../constants/tokens';
import { iconMap } from '../../components/TokenIcon';
import { HeroIcon } from '../../components/HeroMorph';
import SpringPress from '../../components/SpringPress';
import marketData from '../../constants/marketData.json';

// Format helpers
const fmtPrice = (p) => {
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (p >= 1) return '$' + p.toFixed(2);
  if (p >= 0.01) return '$' + p.toFixed(4);
  return '$' + p.toFixed(8);
};
const fmtCap = (c) => {
  if (c >= 1e12) return '$' + (c / 1e12).toFixed(2) + 'T';
  if (c >= 1e9) return '$' + (c / 1e9).toFixed(2) + 'B';
  if (c >= 1e6) return '$' + (c / 1e6).toFixed(1) + 'M';
  return '$' + c.toLocaleString();
};
const fmtVol = (v) => fmtCap(v);

export default function MarketsScreen({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 1], extrapolate: 'clamp' });

  const cryptoTokens = TOKENS.filter(t => t.type === 'crypto');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader
        pageName="Markets"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        }
      />

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
      >
        {/* Market overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Global Market</Text>
          <View style={styles.overviewRow}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewLabel}>BTC Dominance</Text>
              <Text style={styles.overviewValue}>52.1%</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewLabel}>24h Volume</Text>
              <Text style={styles.overviewValue}>$78.2B</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewLabel}>Market Cap</Text>
              <Text style={styles.overviewValue}>$2.38T</Text>
            </View>
          </View>
        </View>

        {/* Token list with market data */}
        {cryptoTokens.map((token) => {
          const data = marketData[token.id] || {};
          const isExpanded = false; // removed expanded card

          return (
            <View key={token.id}>
              <SpringPress
                style={styles.assetRow}
                onPress={() => navigation.navigate('MarketDetail', { symbol: token.symbol })}
              >
                <View style={styles.rowContent}>
                  <HeroIcon id={token.id} source={iconMap[token.id]} size={40} />
                  <View style={styles.assetInfo}>
                    <Text style={styles.assetName}>{token.name}</Text>
                    <Text style={styles.assetSymbol}>{token.symbol}</Text>
                  </View>
                  <View style={styles.assetPrice}>
                    <Text style={styles.priceValue}>{fmtPrice(data.price || 0)}</Text>
                    <Text style={[
                      styles.changeValue,
                      { color: (data.change24h || 0) >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {(data.change24h || 0) >= 0 ? '+' : ''}{(data.change24h || 0).toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </SpringPress>


            </View>
          );
        })}

        <View style={{ height: 40 }} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
  },
  headerLogoText: { color: '#FFF', fontSize: 20, fontWeight: '700', marginRight: 6 },
  headerIcon: { fontSize: 22 },
  profileBtn: { padding: 8 },
  brandText: { color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  pageName: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '400' },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 16, paddingTop: 8, backgroundColor: '#F2F2F7' },

  // Global market overview
  overviewCard: {
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 12,
  },
  overviewTitle: { fontSize: 15, fontWeight: '700', color: '#1C1C1E', marginBottom: 10 },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between' },
  overviewStat: { flex: 1 },
  overviewLabel: { fontSize: 11, color: Colors.textLight, marginBottom: 2 },
  overviewValue: { fontSize: 15, fontWeight: '600', color: Colors.text },

  // Asset rows
  assetRow: {
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  rowContent: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
  },
  assetInfo: { flex: 1, marginLeft: 12 },
  assetName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  assetSymbol: { fontSize: 12, color: Colors.textLight, marginTop: 1 },
  assetPrice: { alignItems: 'flex-end' },
  priceValue: { fontSize: 15, fontWeight: '600', color: Colors.text },
  changeValue: { fontSize: 12, fontWeight: '500', marginTop: 2 },

});

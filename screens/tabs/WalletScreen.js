import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import { TOKENS, FIAT_CURRENCIES } from '../../constants/tokens';
import TokenIcon from '../../components/TokenIcon';
import { iconMap } from '../../components/TokenIcon';
import { HeroIcon } from '../../components/HeroMorph';
import { AppContext } from '../../context/AppContext';
import api from '../../services/api';

export default function WalletScreen({ navigation }) {
  const { user } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [wallets, setWallets] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all'); // all | crypto | fiat

  const filteredTokens = TOKENS.filter(t =>
    t.type === 'crypto' && (
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredFiat = FIAT_CURRENCIES.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader
        pageName="Wallet"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        {/* Search bar — matching Select Wallet Menu screen */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search coins..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {['all', 'crypto', 'fiat'].map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterBtn, activeFilter === f && styles.filterActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
 showsVerticalScrollIndicator={false}>
          {/* Wallet count */}
          <Text style={styles.walletCount}>Your Wallets {filteredTokens.length}</Text>

          {/* Crypto wallets — matching Select Wallet Menu screen layout */}
          {(activeFilter === 'all' || activeFilter === 'crypto') && filteredTokens.map((token) => (
            <TouchableOpacity
              key={token.symbol}
              style={styles.walletRow}
              onPress={() => navigation.navigate('WalletDetail', { symbol: token.symbol })}
            >
              <TokenIcon token={token} size={36} />
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>{token.name}</Text>
                <Text style={styles.walletSymbol}>{token.symbol}</Text>
              </View>
              <View style={styles.walletBalance}>
                <Text style={styles.walletAmount}>0.00</Text>
                <Text style={styles.walletFiat}>$0.00</Text>
              </View>
              <TouchableOpacity style={styles.starBtn}>
                <Text style={styles.star}>☆</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* Fiat wallets — matching Currencies screen layout */}
          {(activeFilter === 'all' || activeFilter === 'fiat') && filteredFiat.map((fiat) => (
            <TouchableOpacity
              key={fiat.code}
              style={styles.walletRow}
              onPress={() => navigation.navigate('WalletDetail', { symbol: fiat.code })}
            >
              <Text style={styles.flagIcon}>{fiat.flag}</Text>
              <View style={styles.walletInfo}>
                <Text style={styles.walletName}>{fiat.name}</Text>
                <Text style={styles.walletSymbol}>{fiat.code}</Text>
              </View>
              <View style={styles.walletBalance}>
                <Text style={styles.walletAmount}>0.00</Text>
              </View>
              {fiat.active && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
  searchContainer: {
    backgroundColor: Colors.surface, borderRadius: 12, height: 44,
    paddingHorizontal: 14, marginBottom: 12, justifyContent: 'center',
  },
  searchInput: { fontSize: 15, color: Colors.text },
  filterRow: { flexDirection: 'row', marginBottom: 12 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: Colors.surface },
  filterActive: { backgroundColor: Colors.primary },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textLight },
  filterTextActive: { color: '#FFF' },
  walletCount: { fontSize: 14, fontWeight: '600', color: Colors.textLight, marginBottom: 8 },
  walletRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
  },
  tokenIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  tokenIconText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  flagIcon: { fontSize: 28, marginRight: 12, width: 40, textAlign: 'center' },
  walletInfo: { flex: 1 },
  walletName: { fontSize: 15, fontWeight: '600', color: Colors.text },
  walletSymbol: { fontSize: 12, color: Colors.textLight, marginTop: 1 },
  walletBalance: { alignItems: 'flex-end', marginRight: 12 },
  walletAmount: { fontSize: 14, fontWeight: '600', color: Colors.text },
  walletFiat: { fontSize: 12, color: Colors.textLight, marginTop: 1 },
  starBtn: { padding: 4 },
  star: { fontSize: 16, color: Colors.textMuted },
  activeBadge: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  activeBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
});

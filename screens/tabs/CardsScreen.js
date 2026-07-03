import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import SpringPress from '../../components/SpringPress';
import { CARD_TIERS } from '../../appConfig';
import AnimatedProgress from '../../components/AnimatedProgress';
import CardSnap from '../../components/CardSnap';

// Mock card data
const ACTIVE_CARD = {
  tier: 'black',
  lastFour: '4819',
  holder: 'JOHN SMITH',
  exp: '12/28',
  dailyLimit: 5000,
  dailySpent: 3542,
};

const ALL_CARDS = [
  { ...ACTIVE_CARD, label: 'Black Card', color1: '#1A1A1A', color2: '#2D2D2D' },
  { tier: 'gold', lastFour: '7231', holder: 'JOHN SMITH', exp: '06/27', dailyLimit: 3000, dailySpent: 1200, label: 'Gold Card', color1: '#B8860B', color2: '#DAA520' },
  { tier: 'platinum', lastFour: '5590', holder: 'JOHN SMITH', exp: '09/29', dailyLimit: 10000, dailySpent: 2100, label: 'Platinum Card', color1: '#4A4A4A', color2: '#6A6A6A' },
];

// Mock transactions
const TRANSACTIONS = [
  { merchant: 'Taco Bell', amount: -5.99, status: 'Complete', icon: '🌮', date: 'Today' },
  { merchant: 'Starbucks', amount: -4.50, status: 'Complete', icon: '☕', date: 'Today' },
  { merchant: 'Xbox Live', amount: -14.99, status: 'Pending', icon: '🎮', date: 'Today' },
  { merchant: 'Amazon', amount: -89.99, status: 'Complete', icon: '📦', date: 'Yesterday' },
  { merchant: 'Uber', amount: -23.40, status: 'Complete', icon: '🚗', date: 'Yesterday' },
];

export default function CardsScreen({ navigation }) {
  const [showCard, setShowCard] = useState(true);
  const limitPercent = (ACTIVE_CARD.dailySpent / ACTIVE_CARD.dailyLimit) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <ScreenHeader
        pageName="Cards"
        rightAction={
          <TouchableOpacity onPress={() => navigation.navigate('CardSettings')} style={{ padding: 8 }}>
            <Text style={{ color: '#FFF', fontSize: 20 }}>⚙️</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
 style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleRow}>
          <Text style={styles.screenTitle}>Card</Text>
          <TouchableOpacity style={styles.headerAction2}>
            <Text style={styles.headerActionIcon2}>⚡</Text>
          </TouchableOpacity>
        </View>

        {/* Card carousel */}
        <CardSnap
          cards={ALL_CARDS}
          cardWidth={280}
          gap={14}
          renderItem={(card, i) => (
            <View key={i}>
              <LinearGradient
                colors={[card.color1, card.color2, card.color1]}
                style={styles.cardVisual}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.cardBrand}>CoinPayments</Text>
                  <Text style={styles.cardContactless}>📶</Text>
                </View>
                <View style={styles.chipArea}>
                  <View style={styles.chip}>
                    <View style={styles.chipLine} />
                    <View style={[styles.chipLine, { width: 18 }]} />
                  </View>
                </View>
                <Text style={styles.cardNumber}>•••• •••• •••• {card.lastFour}</Text>
                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.cardLabel}>CVV: •••</Text>
                    <Text style={styles.cardLabel}>EXP: {card.exp}</Text>
                  </View>
                  <Text style={styles.cardHolder}>{card.holder}</Text>
                  <Text style={styles.cardVisa}>VISA</Text>
                </View>
              </LinearGradient>
              <Text style={styles.cardLabelBelow}>{card.label}</Text>
            </View>
          )}
        />

        {/* Tap to view wallet */}
        <TouchableOpacity style={styles.tapLink} onPress={() => navigation.navigate('WalletDetail', { symbol: 'BTC' })}>
          <Text style={styles.tapLinkText}>Tap to view wallet</Text>
          <Text style={styles.tapLinkArrow}>→</Text>
        </TouchableOpacity>

        {/* Daily limit */}
        <View style={styles.limitSection}>
          <View style={styles.limitHeader}>
            <Text style={styles.limitLabel}>Daily Limit</Text>
            <View style={styles.limitValues}>
              <Text style={styles.limitCurrent}>${ACTIVE_CARD.dailySpent.toLocaleString()}</Text>
              <Text style={styles.limitTotal}> / ${ACTIVE_CARD.dailyLimit.toLocaleString()}</Text>
            </View>
          </View>
          <AnimatedProgress value={limitPercent / 100} color="#5856D6" height={6} duration={1000} style={{ marginTop: 6 }} />
        </View>

        {/* Add to Apple Wallet */}
        <TouchableOpacity style={styles.appleWalletBtn}>
          <Text style={styles.appleWalletIcon}>💳</Text>
          <Text style={styles.appleWalletText}>Add to Apple Wallet</Text>
        </TouchableOpacity>

        {/* Order new card */}
        <SpringPress onPress={() => navigation.navigate('CardOrder')} activeScale={0.95}>
          <View style={styles.orderBtn}>
            <Text style={styles.orderBtnIcon}>＋</Text>
            <Text style={styles.orderBtnText}>Order New Card</Text>
          </View>
        </SpringPress>

        {/* Transactions */}
        <View style={styles.txSection}>
          <View style={styles.txHeader}>
            <Text style={styles.txTitle}>Transactions History</Text>
            <TouchableOpacity>
              <Text style={styles.txSearchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>

          {['Today', 'Yesterday'].map(dateGroup => (
            <View key={dateGroup}>
              <Text style={styles.txDateGroup}>{dateGroup}</Text>
              {TRANSACTIONS.filter(tx => tx.date === dateGroup).map((tx, i) => (
                <SpringPress key={i}>
                  <View style={styles.txRow}>
                    <View style={styles.txLeft}>
                      <View style={styles.txIconWrap}>
                        <Text style={styles.txIcon}>{tx.icon}</Text>
                      </View>
                      <View>
                        <Text style={styles.txMerchant}>{tx.merchant}</Text>
                        <Text style={[
                          styles.txStatus,
                          { color: tx.status === 'Complete' ? '#4CD964' : '#FF9500' }
                        ]}>
                          {tx.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.txAmount}>
                      ${Math.abs(tx.amount).toFixed(2)} USD
                    </Text>
                  </View>
                </SpringPress>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8F8FC' },
  
  // Brand header
  brandHeader: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
  },
  brandText: { color: '#FFF', fontSize: 18, fontWeight: '700', letterSpacing: 0.5 },
  pageName: { color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '400' },
  headerAction: { padding: 8 },
  headerActionIcon: { fontSize: 20 },
  
  scrollView: { flex: 1 },
  
  // Title row
  titleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4,
  },
  screenTitle: { fontSize: 32, fontWeight: '700', color: '#1C1C1E' },
  headerAction2: { padding: 8 },
  headerActionIcon2: { fontSize: 22 },
  
  // Card visual
  cardContainer: { paddingHorizontal: 20, paddingTop: 8 },
  cardLabelBelow: { textAlign: 'center', fontSize: 12, fontWeight: '600', color: '#8E8E93', marginTop: 6 },
  cardVisual: {
    borderRadius: 16, padding: 16, height: 176,
    justifyContent: 'space-between', shadowColor: '#000',
    shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardBrand: { color: '#FFF', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  cardContactless: { fontSize: 16 },
  chipArea: { flexDirection: 'row' },
  chip: {
    width: 36, height: 28, backgroundColor: '#D4AF37', borderRadius: 4,
    padding: 4, justifyContent: 'space-evenly',
  },
  chipLine: { height: 1.5, backgroundColor: '#B8941F', borderRadius: 1, width: 24 },
  cardNumber: { color: '#FFF', fontSize: 16, fontWeight: '500', letterSpacing: 3, marginTop: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '500', marginBottom: 2 },
  cardHolder: { color: '#FFF', fontSize: 12, fontWeight: '600', letterSpacing: 1.5 },
  cardVisa: { color: '#FFF', fontSize: 18, fontWeight: '700', fontStyle: 'italic' },
  
  // Tap link
  tapLink: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, gap: 4,
  },
  tapLinkText: { color: '#007AFF', fontSize: 14, fontWeight: '600' },
  tapLinkArrow: { color: '#007AFF', fontSize: 16 },
  
  // Daily limit
  limitSection: { paddingHorizontal: 20, marginBottom: 16 },
  limitHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  limitLabel: { fontSize: 14, fontWeight: '600', color: '#1C1C1E' },
  limitValues: { flexDirection: 'row' },
  limitCurrent: { fontSize: 14, fontWeight: '700', color: '#5856D6' },
  limitTotal: { fontSize: 14, fontWeight: '400', color: '#8E8E93' },
  
  // Apple Wallet
  appleWalletBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, backgroundColor: '#1C1C1E', borderRadius: 12,
    paddingVertical: 14, gap: 8, marginBottom: 24,
  },
  appleWalletIcon: { fontSize: 18 },
  appleWalletText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
  
  // Order new card
  orderBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 20, borderWidth: 2, borderColor: '#5856D6', borderRadius: 12,
    paddingVertical: 14, gap: 8, marginBottom: 24,
  },
  orderBtnIcon: { color: '#5856D6', fontSize: 20, fontWeight: '700' },
  orderBtnText: { color: '#5856D6', fontSize: 15, fontWeight: '600' },
  
  // Transactions
  txSection: { paddingHorizontal: 20, paddingBottom: 20 },
  txHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  txTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  txSearchIcon: { fontSize: 18 },
  txDateGroup: { fontSize: 12, fontWeight: '600', color: '#8E8E93', marginBottom: 8, marginTop: 8 },
  txRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#E5E5EA',
  },
  txLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  txIconWrap: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  txIcon: { fontSize: 20 },
  txMerchant: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
  txStatus: { fontSize: 11, fontWeight: '600', marginTop: 1 },
  txAmount: { fontSize: 15, fontWeight: '600', color: '#1C1C1E' },
});

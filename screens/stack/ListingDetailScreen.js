import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices } from '../../services/LivePriceService';
import { MOCK_LISTINGS, formatFlrPrice, LISTING_TYPES } from '../../constants/marketplace';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';
import SpringPress from '../../components/SpringPress';

export default function ListingDetailScreen({ navigation, route }) {
  const { prices } = useLivePrices();
  const listingId = route.params?.id || 1;
  const listing = MOCK_LISTINGS.find(l => l.id === listingId) || MOCK_LISTINGS[0];
  const flrPrice = prices.FLR?.price || 0.006;

  const priceFmt = formatFlrPrice(listing.priceFlr, flrPrice);
  const buyNowFmt = listing.buyNowFlr ? formatFlrPrice(listing.buyNowFlr, flrPrice) : null;
  const highestBid = listing.bids.length > 0 ? listing.bids[listing.bids.length - 1] : null;
  const highestFmt = highestBid ? formatFlrPrice(highestBid.amount, flrPrice) : priceFmt;
  const usdTotal = listing.priceFlr * flrPrice;
  const rake = usdTotal * 0.01;
  const burn = rake * 0.5;
  const charity = rake * 0.5;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader pageName="Listing" onBack={() => navigation.goBack?.()} />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Image */}
        <View style={styles.imageSection}>
          <Text style={styles.listingEmoji}>{listing.image}</Text>
        </View>

        {/* Title + Type */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={[styles.typeBadge, { backgroundColor: Colors.primary + '20' }]}>
            <Text style={styles.typeBadgeText}>{LISTING_TYPES[listing.type]}</Text>
          </View>
        </View>

        {/* Seller info */}
        <View style={styles.sellerCard}>
          <View style={styles.sellerAvatar}>
            <Text style={styles.sellerAvatarText}>{listing.seller.name[0]}</Text>
          </View>
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{listing.seller.name}</Text>
            <Text style={styles.sellerRating}>⭐ {listing.seller.rating} · {listing.seller.sales} sales</Text>
          </View>
          <FlareTokenIcon symbol="FLR" size={32} color={Colors.primary} />
        </View>

        {/* Price */}
        <View style={styles.priceCard}>
          {listing.type === 'fixed' && (
            <>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceFlr}>{priceFmt.flr}</Text>
              <Text style={styles.priceUsd}>≈ {priceFmt.usd} USD (FTSOv2)</Text>
            </>
          )}
          {listing.type === 'auction' && (
            <>
              <Text style={styles.priceLabel}>Current Highest Bid</Text>
              <Text style={styles.priceFlr}>{highestFmt.flr}</Text>
              <Text style={styles.priceUsd}>≈ {highestFmt.usd} USD (FTSOv2)</Text>
              {listing.timeLeft && <Text style={styles.timeLeft}>⏱ {listing.timeLeft} remaining</Text>}
              {listing.reserve && <Text style={styles.reserveText}>Reserve: {formatFlrPrice(listing.reserve, flrPrice).flr} (not met)</Text>}
            </>
          )}
          {listing.type === 'hybrid' && (
            <>
              <Text style={styles.priceLabel}>Current Bid</Text>
              <Text style={styles.priceFlr}>{highestFmt.flr}</Text>
              <Text style={styles.priceUsd}>≈ {highestFmt.usd} USD</Text>
              {buyNowFmt && (
                <TouchableOpacity style={styles.buyNowBtn} onPress={() => navigation.navigate('BuySell', { symbol: 'FLR' })}>
                  <Text style={styles.buyNowBtnText}>Buy Now: {buyNowFmt.flr}</Text>
                </TouchableOpacity>
              )}
              {listing.timeLeft && <Text style={styles.timeLeft}>⏱ {listing.timeLeft} remaining</Text>}
            </>
          )}
        </View>

        {/* Fee breakdown */}
        <View style={styles.feeCard}>
          <Text style={styles.feeTitle}>🔥 Flare Marketplace Fee</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Sale Rake</Text>
            <Text style={styles.feeValue}>1% = {rake.toFixed(2)} USD</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>🔥 Burned (deflationary)</Text>
            <Text style={styles.feeValue}>0.5% = {burn.toFixed(2)} USD</Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>❤️ Flare Philanthropy</Text>
            <Text style={styles.feeValue}>0.5% = {charity.toFixed(2)} USD</Text>
          </View>
          <Text style={styles.feeNote}>vs eBay 13-30% · We save you 29%+ on fees</Text>
        </View>

        {/* Bid history */}
        {listing.bids.length > 0 && (
          <View style={styles.historyCard}>
            <Text style={styles.sectionTitle}>Bid History</Text>
            {listing.bids.map((bid, i) => (
              <View key={i} style={[styles.bidRow, i < listing.bids.length - 1 && styles.bidBorder]}>
                <Text style={styles.bidder}>{bid.bidder}</Text>
                <Text style={styles.bidAmount}>{formatFlrPrice(bid.amount, flrPrice).flr}</Text>
                <Text style={styles.bidTime}>{bid.time}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Description */}
        <View style={styles.descCard}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descText}>{listing.description}</Text>
        </View>

        {/* Payment */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Accepted Payment</Text>
          <View style={styles.paymentRow}>
            <FlareTokenIcon symbol="FLR" size={32} color={Colors.primary} />
            <Text style={styles.paymentText}>FLR (Flare native)</Text>
          </View>
          <View style={styles.paymentRow}>
            <FlareTokenIcon symbol="FXRP" size={32} color={Colors.primary} />
            <Text style={styles.paymentText}>FXRP (Flare XRP — cross-chain)</Text>
          </View>
        </View>

        {/* Action buttons */}
        {listing.type === 'fixed' && (
          <SpringPress onPress={() => {}} activeScale={0.95}>
            <View style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Buy Now for {priceFmt.flr}</Text>
            </View>
          </SpringPress>
        )}
        {listing.type === 'auction' && (
          <View style={styles.bidSection}>
            <TextInput style={styles.bidInput} placeholder="Enter bid in FLR" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" />
            <SpringPress onPress={() => {}} activeScale={0.95}>
              <View style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Place Bid</Text>
              </View>
            </SpringPress>
          </View>
        )}
        {listing.type === 'hybrid' && (
          <View style={styles.bidSection}>
            <TextInput style={styles.bidInput} placeholder="Enter bid in FLR" placeholderTextColor={Colors.textMuted} keyboardType="decimal-pad" />
            <SpringPress onPress={() => {}} activeScale={0.95}>
              <View style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Place Bid</Text>
              </View>
            </SpringPress>
            {buyNowFmt && (
              <SpringPress onPress={() => {}} activeScale={0.95}>
                <View style={styles.buyNowActionBtn}>
                  <Text style={styles.actionBtnText}>Buy Now: {buyNowFmt.flr}</Text>
                </View>
              </SpringPress>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🔥 Flare Marketplace · 1% fee · 50% burned · 50% philanthropy</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  imageSection: { height: 200, backgroundColor: Colors.creamDark, justifyContent: 'center', alignItems: 'center' },
  listingEmoji: { fontSize: 80 },
  titleSection: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text, flex: 1, marginRight: 8 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  typeBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  sellerCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, backgroundColor: Colors.surface, borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  sellerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '20', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sellerAvatarText: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 15, fontWeight: '700', color: Colors.text },
  sellerRating: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  priceCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border, alignItems: 'center' },
  priceLabel: { fontSize: 12, color: Colors.textMuted, fontWeight: '600', marginBottom: 4 },
  priceFlr: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  priceUsd: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
  timeLeft: { fontSize: 13, color: Colors.deepOrange, fontWeight: '600', marginTop: 8 },
  reserveText: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
  buyNowBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, marginTop: 12 },
  buyNowBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  feeCard: { margin: 16, backgroundColor: Colors.primary + '08', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  feeTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  feeLabel: { fontSize: 14, color: Colors.textSecondary },
  feeValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  feeNote: { fontSize: 12, color: Colors.primary, marginTop: 8, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  historyCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  bidRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  bidBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  bidder: { fontSize: 14, fontWeight: '600', color: Colors.text, flex: 1 },
  bidAmount: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  bidTime: { fontSize: 12, color: Colors.textMuted, marginLeft: 8 },
  descCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  descText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  paymentCard: { margin: 16, backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  paymentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  paymentText: { fontSize: 14, color: Colors.text, marginLeft: 12, fontWeight: '500' },
  bidSection: { paddingHorizontal: 16, marginBottom: 20 },
  bidInput: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, fontSize: 16, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  actionBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 8 },
  buyNowActionBtn: { backgroundColor: Colors.deepOrange, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  footer: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontSize: 12, fontWeight: '600', color: Colors.primary, textAlign: 'center' },
});

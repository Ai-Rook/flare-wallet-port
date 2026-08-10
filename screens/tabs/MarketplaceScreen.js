import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices } from '../../services/LivePriceService';
import { CATEGORIES, MOCK_LISTINGS, formatFlrPrice, getTypeColor, LISTING_TYPES } from '../../constants/marketplace';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';
import SpringPress from '../../components/SpringPress';

export default function MarketplaceScreen({ navigation }) {
  const { prices } = useLivePrices();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const flrPrice = prices.FLR?.price || 0.006;

  const filtered = MOCK_LISTINGS.filter(l => {
    const matchesSearch = !search || l.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || l.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const renderListing = ({ item }) => {
    const priceFmt = formatFlrPrice(item.priceFlr, flrPrice);
    const typeColor = getTypeColor(item.type);
    const buyNowFmt = item.buyNowFlr ? formatFlrPrice(item.buyNowFlr, flrPrice) : null;
    const highestBid = item.bids.length > 0 ? item.bids[item.bids.length - 1].amount : item.priceFlr;
    const highestFmt = formatFlrPrice(highestBid, flrPrice);

    return (
      <SpringPress onPress={() => navigation.navigate('ListingDetail', { id: item.id })} activeScale={0.97}>
        <View style={styles.listingCard}>
          {/* Image placeholder */}
          <View style={styles.listingImage}>
            <Text style={styles.listingLetter}>{item.title[0]}</Text>
          </View>

          {/* Content */}
          <View style={styles.listingContent}>
            <View style={styles.listingHeader}>
              <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
              <View style={[styles.typeBadge, { backgroundColor: typeColor + '20', borderColor: typeColor }]}>
                <Text style={[styles.typeBadgeText, { color: typeColor }]}>{LISTING_TYPES[item.type]}</Text>
              </View>
            </View>

            <Text style={styles.sellerName}>{item.seller.name} · ⭐ {item.seller.rating} ({item.seller.sales} sales)</Text>

            {/* Price */}
            <View style={styles.priceRow}>
              {item.type === 'fixed' && (
                <View>
                  <Text style={styles.priceFlr}>{priceFmt.flr}</Text>
                  <Text style={styles.priceUsd}>≈ {priceFmt.usd}</Text>
                </View>
              )}
              {item.type === 'auction' && (
                <View>
                  <Text style={styles.priceLabel}>Highest Bid</Text>
                  <Text style={styles.priceFlr}>{highestFmt.flr}</Text>
                  <Text style={styles.priceUsd}>≈ {highestFmt.usd}</Text>
                </View>
              )}
              {item.type === 'hybrid' && (
                <View>
                  <Text style={styles.priceFlr}>{highestFmt.flr}</Text>
                  <Text style={styles.priceUsd}>≈ {highestFmt.usd}</Text>
                  {buyNowFmt && <Text style={styles.buyNowText}>Buy Now: {buyNowFmt.flr}</Text>}
                </View>
              )}
            </View>

            {/* Time left or fee badge */}
            <View style={styles.listingFooter}>
              {item.timeLeft ? (
                <Text style={styles.timeLeft}>⏱ {item.timeLeft}</Text>
              ) : (
                <Text style={styles.timeLeft}>Available</Text>
              )}
              <Text style={styles.feeBadge}>🔥 1% fee · 50% burned</Text>
            </View>
          </View>
        </View>
      </SpringPress>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Marketplace" subtitle="Buy & sell on Flare" />
      <View style={styles.content}>
        {/* Search */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search listings..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={Colors.textMuted}
          />
          <TouchableOpacity style={styles.sellBtn} onPress={() => navigation.navigate('CreateListing')}>
            <Text style={styles.sellBtnText}>+ Sell</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, activeCategory === cat.id && styles.catChipActive]}
              onPress={() => setActiveCategory(cat.id)}
            >
              <Text style={[styles.catLabel, activeCategory === cat.id && styles.catLabelActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listings */}
        <Text style={styles.resultCount}>{filtered.length} listings</Text>
        <FlatList
          data={filtered}
          renderItem={renderListing}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 16 },
  searchRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  searchInput: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1, borderColor: Colors.border },
  sellBtn: { backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center' },
  sellBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  catRow: { flexDirection: 'row', marginBottom: 12 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catLabel: { fontSize: 13, fontWeight: '600', color: Colors.text },
  catLabelActive: { color: '#FFF' },
  resultCount: { fontSize: 13, color: Colors.textMuted, marginBottom: 8, fontWeight: '500' },
  listingCard: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  listingImage: { width: 80, height: 100, backgroundColor: Colors.primary + '12', justifyContent: 'center', alignItems: 'center', borderRightWidth: 0 },
  listingLetter: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  listingContent: { flex: 1, padding: 12 },
  listingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  listingTitle: { fontSize: 14, fontWeight: '700', color: Colors.text, flex: 1, marginRight: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  typeBadgeText: { fontSize: 10, fontWeight: '700' },
  sellerName: { fontSize: 11, color: Colors.textMuted, marginBottom: 8 },
  priceRow: { marginBottom: 8 },
  priceLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
  priceFlr: { fontSize: 16, fontWeight: '800', color: Colors.primary },
  priceUsd: { fontSize: 12, color: Colors.textSecondary },
  buyNowText: { fontSize: 11, color: Colors.deepOrange, fontWeight: '600', marginTop: 2 },
  listingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  timeLeft: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  feeBadge: { fontSize: 9, color: Colors.primary, fontWeight: '600' },
});

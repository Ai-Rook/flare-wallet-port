import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import { useLivePrices } from '../../services/LivePriceService';
import { CATEGORIES, LISTING_TYPES, AUCTION_DURATIONS } from '../../constants/marketplace';
import ScreenHeader from '../../components/ScreenHeader';
import FlareTokenIcon from '../../components/FlareTokenIcon';
import SpringPress from '../../components/SpringPress';

export default function CreateListingScreen({ navigation }) {
  const { prices } = useLivePrices();
  const flrPrice = prices.FLR?.price || 0.006;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('electronics');
  const [listingType, setListingType] = useState('fixed');
  const [price, setPrice] = useState('');
  const [buyNowPrice, setBuyNowPrice] = useState('');
  const [duration, setDuration] = useState(3);
  const [reserve, setReserve] = useState('');
  const [useReserve, setUseReserve] = useState(false);
  const [created, setCreated] = useState(false);

  const usdValue = price ? (parseFloat(price) * flrPrice).toFixed(2) : '0.00';
  const reserveUsd = reserve ? (parseFloat(reserve) * flrPrice).toFixed(2) : '0.00';
  const reserveFee = reserve ? (parseFloat(reserve) * flrPrice * 0.005).toFixed(2) : '0.00';

  if (created) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader pageName="Listing Created" onBack={() => navigation.goBack?.()} />
        <View style={styles.successWrap}>
          <Text style={styles.successEmoji}>🎉</Text>
          <Text style={styles.successTitle}>Listing Created!</Text>
          <Text style={styles.successText}>Your item is now live on Flare Marketplace</Text>
          <View style={styles.successDetails}>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Title</Text><Text style={styles.detailValue}>{title}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Price</Text><Text style={styles.detailValue}>{price} FLR (≈ ${usdValue})</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Type</Text><Text style={styles.detailValue}>{LISTING_TYPES[listingType]}</Text></View>
            <View style={styles.detailRow}><Text style={styles.detailLabel}>Fee</Text><Text style={styles.detailValue}>1% on sale (50% burned)</Text></View>
          </View>
          <TouchableOpacity style={styles.successBtn} onPress={() => { setCreated(false); setTitle(''); setPrice(''); navigation.navigate('Marketplace'); }}>
            <Text style={styles.successBtnText}>View Marketplace</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader pageName="Create Listing" onBack={() => navigation.goBack?.()} />
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Title */}
        <Text style={styles.label}>Item Title</Text>
        <TextInput style={styles.input} placeholder="e.g. Vintage Rolex Submariner" value={title} onChangeText={setTitle} placeholderTextColor={Colors.textMuted} />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textarea]} placeholder="Describe your item..." value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholderTextColor={Colors.textMuted} />

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catRow}>
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
            <TouchableOpacity key={cat.id} style={[styles.catChip, category === cat.id && styles.catChipActive]} onPress={() => setCategory(cat.id)}>
              <Text style={styles.catIcon}>{cat.icon}</Text>
              <Text style={[styles.catText, category === cat.id && styles.catTextActive]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listing type */}
        <Text style={styles.label}>Listing Type</Text>
        <View style={styles.typeRow}>
          {Object.entries(LISTING_TYPES).map(([key, label]) => (
            <TouchableOpacity key={key} style={[styles.typeBtn, listingType === key && styles.typeBtnActive]} onPress={() => setListingType(key)}>
              <Text style={[styles.typeBtnText, listingType === key && styles.typeBtnTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price */}
        <Text style={styles.label}>{listingType === 'fixed' ? 'Price (FLR)' : 'Starting Bid (FLR)'}</Text>
        <View style={styles.priceInputRow}>
          <TextInput style={styles.priceInput} placeholder="0" value={price} onChangeText={setPrice} keyboardType="decimal-pad" placeholderTextColor={Colors.textMuted} />
          <FlareTokenIcon symbol="FLR" size={28} color={Colors.primary} />
          <Text style={styles.priceSuffix}>FLR</Text>
        </View>
        {price && <Text style={styles.usdHint}>≈ ${usdValue} USD (FTSOv2 live rate)</Text>}

        {/* Buy Now (hybrid only) */}
        {listingType === 'hybrid' && (
          <>
            <Text style={styles.label}>Buy It Now Price (FLR)</Text>
            <View style={styles.priceInputRow}>
              <TextInput style={styles.priceInput} placeholder="0" value={buyNowPrice} onChangeText={setBuyNowPrice} keyboardType="decimal-pad" placeholderTextColor={Colors.textMuted} />
              <FlareTokenIcon symbol="FLR" size={28} color={Colors.primary} />
              <Text style={styles.priceSuffix}>FLR</Text>
            </View>
          </>
        )}

        {/* Auction duration */}
        {listingType !== 'fixed' && (
          <>
            <Text style={styles.label}>Auction Duration</Text>
            <View style={styles.durationRow}>
              {AUCTION_DURATIONS.map(d => (
                <TouchableOpacity key={d.days} style={[styles.durationBtn, duration === d.days && styles.durationBtnActive]} onPress={() => setDuration(d.days)}>
                  <Text style={[styles.durationText, duration === d.days && styles.durationTextActive]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Reserve price */}
        {listingType !== 'fixed' && (
          <View style={styles.reserveSection}>
            <TouchableOpacity style={styles.reserveToggle} onPress={() => setUseReserve(!useReserve)}>
              <View style={[styles.checkbox, useReserve && styles.checkboxActive]} />
              <Text style={styles.reserveToggleText}>Set Reserve Price (0.5% extra fee)</Text>
            </TouchableOpacity>
            {useReserve && (
              <>
                <View style={styles.priceInputRow}>
                  <TextInput style={styles.priceInput} placeholder="0" value={reserve} onChangeText={setReserve} keyboardType="decimal-pad" placeholderTextColor={Colors.textMuted} />
                  <FlareTokenIcon symbol="FLR" size={28} color={Colors.primary} />
                  <Text style={styles.priceSuffix}>FLR</Text>
                </View>
                {reserve && (
                  <View style={styles.reserveInfo}>
                    <Text style={styles.reserveInfoText}>Reserve: ≈ ${reserveUsd} USD</Text>
                    <Text style={styles.reserveFeeText}>Reserve fee: ${reserveFee} USD (paid at listing)</Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Fee info */}
        <View style={styles.feeCard}>
          <Text style={styles.feeTitle}>🔥 Fee Structure</Text>
          <Text style={styles.feeLine}>• 1% rake on sale (50% burned, 50% philanthropy)</Text>
          {useReserve && <Text style={styles.feeLine}>• 0.5% reserve price fee (paid now)</Text>}
          <Text style={styles.feeLine}>• No listing fee · No payment processing fee</Text>
          <Text style={styles.feeCompare}>eBay charges 13-30% — you save 29%+</Text>
        </View>

        {/* Submit */}
        <SpringPress onPress={() => title && price && setCreated(true)} activeScale={0.95}>
          <View style={[styles.submitBtn, (!title || !price) && styles.submitBtnDisabled]}>
            <Text style={styles.submitBtnText}>Create Listing</Text>
          </View>
        </SpringPress>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1, padding: 16 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.text, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: Colors.surface, borderRadius: 12, padding: 14, fontSize: 15, borderWidth: 1, borderColor: Colors.border, marginBottom: 4 },
  textarea: { minHeight: 80 },
  catRow: { flexDirection: 'row', marginBottom: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginRight: 8 },
  catChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  catIcon: { fontSize: 14, marginRight: 4 },
  catText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  catTextActive: { color: '#FFF' },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  typeBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  typeBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  typeBtnText: { fontSize: 12, fontWeight: '700', color: Colors.text },
  typeBtnTextActive: { color: '#FFF' },
  priceInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: Colors.border, marginBottom: 4 },
  priceInput: { flex: 1, fontSize: 20, fontWeight: '700', color: Colors.text },
  priceSuffix: { fontSize: 14, fontWeight: '700', color: Colors.primary, marginLeft: 8 },
  usdHint: { fontSize: 12, color: Colors.primary, fontWeight: '600', marginBottom: 8 },
  durationRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  durationBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1.5, borderColor: Colors.border },
  durationBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  durationText: { fontSize: 13, fontWeight: '700', color: Colors.text },
  durationTextActive: { color: '#FFF' },
  reserveSection: { marginTop: 8, marginBottom: 8 },
  reserveToggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: Colors.primary, marginRight: 10 },
  checkboxActive: { backgroundColor: Colors.primary },
  reserveToggleText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  reserveInfo: { backgroundColor: Colors.surface, borderRadius: 10, padding: 12, marginTop: 8, borderWidth: 1, borderColor: Colors.border },
  reserveInfoText: { fontSize: 13, color: Colors.text, fontWeight: '600' },
  reserveFeeText: { fontSize: 12, color: Colors.deepOrange, marginTop: 4 },
  feeCard: { backgroundColor: Colors.primary + '08', borderRadius: 14, padding: 16, marginTop: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  feeTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  feeLine: { fontSize: 13, color: Colors.textSecondary, marginBottom: 4 },
  feeCompare: { fontSize: 13, fontWeight: '700', color: Colors.primary, marginTop: 8 },
  submitBtn: { backgroundColor: Colors.primary, borderRadius: 16, paddingVertical: 18, alignItems: 'center', marginBottom: 20 },
  submitBtnDisabled: { backgroundColor: Colors.border },
  submitBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  // Success
  successWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  successEmoji: { fontSize: 48, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: '800', color: Colors.text, marginBottom: 8 },
  successText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  successDetails: { width: '100%', backgroundColor: Colors.surface, borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailLabel: { fontSize: 14, color: Colors.textMuted },
  detailValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  successBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center', width: '100%' },
  successBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

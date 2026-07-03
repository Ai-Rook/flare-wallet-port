import ScreenHeader from '../../components/ScreenHeader';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/colors';
import TokenIcon from '../../components/TokenIcon';
import { CARD_TIERS } from '../../constants/tokens';
import api from '../../services/api';

export default function CardDetailScreen({ navigation, route }) {
  const tier = route.params?.tier || CARD_TIERS[0];
  const card = route.params?.card;
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(card ? 'manage' : 'order'); // order | activate | manage

  const handleOrder = async () => {
    setLoading(true);
    try {
      await api.orderCard(tier.id);
      Alert.alert('Card Ordered', `Your ${tier.name} is on the way!`);
      setMode('activate');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  const handleActivate = async () => {
    if (!pin || pin.length < 4) { Alert.alert('Error', 'Enter a 4-digit PIN'); return; }
    if (pin !== confirmPin) { Alert.alert('Error', 'PINs do not match'); return; }
    setLoading(true);
    try {
      await api.activateCard(card?.id || 'new', pin);
      Alert.alert('Card Activated', 'Your card is now active');
    } catch (e) { Alert.alert('Error', e.message); }
    setLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScreenHeader pageName={tier?.name || 'Card'} onBack={() => navigation.goBack()} />
      <ScrollView style={styles.content}
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Card visual — matching CoinPayments card mockups */}
        <View style={[styles.cardVisual, { backgroundColor: tier.color }]}>
          <Text style={[styles.cardName, tier.id === 'black' && { color: Colors.cardBlackGold }]}>{tier.name}</Text>
          <View style={styles.cardChip} />
          <Text style={[styles.cardBrand, tier.id === 'black' && { color: Colors.cardBlackGold }]}>COINPAYMENTS™</Text>
          {card && <Text style={styles.cardNumber}>•••• {card.last4 || '0000'}</Text>}
        </View>

        {mode === 'order' && (
          <View style={styles.orderSection}>
            <Text style={styles.sectionTitle}>Order This Card</Text>
            {tier.features.map((f, i) => (
              <View key={i} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.orderBtn} onPress={handleOrder} disabled={loading}>
              <Text style={styles.orderText}>{loading ? 'Ordering...' : 'Order Now'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'activate' && (
          <View style={styles.activateSection}>
            <Text style={styles.sectionTitle}>Activate Card</Text>
            <Text style={styles.label}>Set PIN</Text>
            <TextInput style={styles.pinInput} value={pin} onChangeText={setPin} keyboardType="number-pad" maxLength={4} secureTextEntry placeholder="••••" placeholderTextColor={Colors.textMuted} />
            <Text style={styles.label}>Confirm PIN</Text>
            <TextInput style={styles.pinInput} value={confirmPin} onChangeText={setConfirmPin} keyboardType="number-pad" maxLength={4} secureTextEntry placeholder="••••" placeholderTextColor={Colors.textMuted} />
            <TouchableOpacity style={styles.activateBtn} onPress={handleActivate} disabled={loading}>
              <Text style={styles.activateText}>{loading ? 'Activating...' : 'Activate'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'manage' && card && (
          <View style={styles.manageSection}>
            <Text style={styles.sectionTitle}>Card Settings</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('BankLink')}>
              <Text style={styles.menuLabel}>Change PIN</Text><Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Lock Card</Text><Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>International Use</Text><Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuLabel}>Card Limits</Text><Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  backIcon: { color: '#FFF', fontSize: 32, fontWeight: '300', marginTop: -4 },
  headerTitle: { color: '#FFF', fontSize: 18, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  cardVisual: { height: 200, borderRadius: 16, padding: 24, marginBottom: 24, position: 'relative', overflow: 'hidden' },
  cardName: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  cardChip: { width: 48, height: 34, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 24 },
  cardBrand: { color: '#FFF', fontSize: 14, fontWeight: '700', position: 'absolute', bottom: 20, right: 24, letterSpacing: 2 },
  cardNumber: { color: 'rgba(255,255,255,0.8)', fontSize: 16, position: 'absolute', bottom: 48, left: 24, letterSpacing: 3 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  featureCheck: { color: Colors.success, fontSize: 14, marginRight: 8, fontWeight: '700' },
  featureText: { fontSize: 14, color: Colors.text },
  orderBtn: { backgroundColor: Colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  orderText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  label: { fontSize: 13, color: Colors.textLight, fontWeight: '500', marginBottom: 6, marginTop: 8 },
  pinInput: { backgroundColor: Colors.surface, borderRadius: 10, height: 48, paddingHorizontal: 14, fontSize: 18, color: Colors.text, textAlign: 'center', marginBottom: 8, letterSpacing: 8 },
  activateBtn: { backgroundColor: Colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  activateText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  menuArrow: { fontSize: 20, color: Colors.textMuted },
});

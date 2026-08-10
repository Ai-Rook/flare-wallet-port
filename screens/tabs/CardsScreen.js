import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../constants/colors';
import ScreenHeader from '../../components/ScreenHeader';

const DEMO_CARDS = [
  { id: 1, type: 'Sunkist', number: '4242', balance: 2500, spent: 340, limit: 5000, frozen: false, color: Colors.primary },
  { id: 2, type: 'Flare Black', number: '5555', balance: 8200, spent: 1200, limit: 15000, frozen: false, color: '#1A1A1A' },
];

export default function CardsScreen({ navigation }) {
  const [cards, setCards] = useState(DEMO_CARDS);

  const toggleFreeze = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, frozen: !c.frozen } : c));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Cards" subtitle="Virtual Card Management" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {cards.map(card => (
          <View key={card.id} style={styles.cardWrap}>
            {/* Card Visual */}
            <View style={[styles.card, { backgroundColor: card.color }]}>
              <Text style={styles.cardType}>{card.type}</Text>
              <Text style={styles.cardNumber}>•••• {card.number}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardLimit}>Limit: ${card.limit.toLocaleString()}</Text>
                <Text style={styles.cardSpent}>Spent: ${card.spent}</Text>
              </View>
            </View>

            {/* Card Controls */}
            <View style={styles.cardControls}>
              <TouchableOpacity style={styles.controlBtn} onPress={() => navigation.navigate('CardDetail', { cardId: card.id })}>
                <Text style={styles.controlBtnText}>⚙️ Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, card.frozen && styles.controlBtnFrozen]} onPress={() => toggleFreeze(card.id)}>
                <Text style={styles.controlBtnText}>{card.frozen ? '🧊 Frozen' : '❄️ Freeze'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Order New Card */}
        <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('CardOrder')}>
          <Text style={styles.orderCardText}>＋ Order New Card</Text>
        </TouchableOpacity>

        {/* Spending Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Monthly Spending</Text>
          <Text style={styles.summaryTotal}>$1,540 / $20,000</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '7.7%' }]} />
          </View>
          <Text style={styles.summaryHint}>7.7% of total limit used</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { padding: 16 },
  cardWrap: { marginBottom: 16 },
  card: { borderRadius: 20, padding: 24, height: 180, justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  cardType: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  cardNumber: { fontSize: 20, fontWeight: '600', color: '#FFF', fontFamily: 'monospace', letterSpacing: 2 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardLimit: { fontSize: 13, color: '#FFF', opacity: 0.8 },
  cardSpent: { fontSize: 13, color: '#FFF', opacity: 0.8 },
  cardControls: { flexDirection: 'row', gap: 8, marginTop: 12 },
  controlBtn: { flex: 1, backgroundColor: Colors.surface, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  controlBtnFrozen: { backgroundColor: Colors.error + '15', borderColor: Colors.error },
  controlBtnText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  orderCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: Colors.primary, borderStyle: 'dashed', marginBottom: 16 },
  orderCardText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  summaryCard: { backgroundColor: Colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.border },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 8 },
  summaryTotal: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 12 },
  progressBar: { height: 8, backgroundColor: Colors.border, borderRadius: 4, marginBottom: 8 },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  summaryHint: { fontSize: 12, color: Colors.textMuted },
});

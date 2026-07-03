import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { Colors } from '../constants/colors';

const { height: SCREEN_H } = Dimensions.get('window');

// Semantic icon config per transaction type
const TYPE_CONFIG = {
  send:     { title: 'Sent',       circle: '#FFF3CD', arrow: '#FFC107', direction: 'up',    sign: '-' },
  buy:      { title: 'Bought',     circle: '#D4EDDA', arrow: '#28A745', direction: 'down',  sign: '' },
  sell:     { title: 'Sold',       circle: '#F8D7DA', arrow: '#DC3545', direction: 'up',    sign: '-' },
  receive:  { title: 'Received',   circle: '#D1ECF1', arrow: '#17A2B8', direction: 'down',  sign: '' },
  exchange: { title: 'Exchanged',  circle: '#E8DAEF', arrow: '#8E44AD', direction: 'swap', sign: '' },
};

export default function TransactionSheet({ visible, onClose, type, amount, symbol, details, status }) {
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.send;
  const [slideY] = useState(new Animated.Value(SCREEN_H));

  useEffect(() => {
    if (visible) {
      Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 12 }).start();
    } else {
      Animated.timing(slideY, { toValue: SCREEN_H, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  const title = `${config.title} ${symbol || 'BTC'}`;
  const displayAmount = `${config.sign} ${amount || '0.3345'} ${symbol || 'BTC'}`;

  return (
    <Modal visible={visible} animationType="none" transparent onRequestClose={onClose}>
      {/* Dimmed background */}
      <View style={styles.scrim}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
      </View>

      {/* Bottom sheet */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideY }] }]}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Semantic icon */}
        <View style={[styles.iconCircle, { backgroundColor: config.circle }]}>
          <Text style={[styles.iconArrow, { color: config.arrow }]}>
            {config.direction === 'up' ? '↑' : config.direction === 'down' ? '↓' : '↔'}
          </Text>
        </View>

        {/* Amount */}
        <Text style={styles.amountText}>{displayAmount}</Text>

        {/* Transaction details card */}
        {details && Object.keys(details).length > 0 && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailsLabel}>Transaction Details</Text>
            {Object.entries(details).map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <Text style={styles.detailKey}>{key}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Confirm CTA (only for status=confirm) */}
        {status === 'confirm' && (
          <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
            <Text style={styles.confirmText}>Confirm with Face ID</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40,
    maxHeight: SCREEN_H * 0.85,
  },
  dragHandle: { width: 36, height: 5, borderRadius: 2.5, backgroundColor: '#D1D1D6', alignSelf: 'center', marginBottom: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  closeBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  closeIcon: { fontSize: 18, color: '#8E8E93' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 },
  iconArrow: { fontSize: 24, fontWeight: '700' },
  amountText: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', textAlign: 'center', marginBottom: 20 },
  detailsCard: { backgroundColor: '#F8F8FC', borderRadius: 12, padding: 16, marginBottom: 16 },
  detailsLabel: { fontSize: 13, fontWeight: '600', color: '#8E8E93', marginBottom: 10 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },
  detailKey: { fontSize: 13, color: '#8E8E93' },
  detailValue: { fontSize: 13, fontWeight: '600', color: '#1C1C1E' },
  confirmBtn: { backgroundColor: Colors.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  confirmText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

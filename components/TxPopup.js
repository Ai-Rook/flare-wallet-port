import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Modal } from 'react-native';

/**
 * TxPopup — Spend-style transaction result popup.
 * White modal overlay with: transaction title, colored icon circle,
 * crypto amount + badge, Transaction Details white card, close button.
 *
 * Props:
 *   visible — show/hide
 *   type — 'bought' | 'sold' | 'sent' | 'received' | 'exchanged'
 *   amount — crypto amount string (e.g. "0.3345")
 *   badge — ticker badge text (e.g. "BTC", "ETH")
 *   badgeColor — badge background color
 *   details — array of { label, value } for Transaction Details card
 *   onDismiss — close callback
 *   iconColor — override the icon circle color
 */
const TYPE_CONFIG = {
  bought:    { icon: '↓', color: '#4CD964', label: 'Bought' },
  sold:      { icon: '↑', color: '#D4555A', label: 'Sold' },
  sent:      { icon: '↑', color: '#8E8E93', label: 'Sent' },
  received:  { icon: '↓', color: '#4CD964', label: 'Received' },
  exchanged: { icon: '⇄', color: '#5856D6', label: 'Exchanged' },
};

export default function TxPopup({
  visible = false,
  type = 'bought',
  amount = '0.3345',
  badge = 'BTC',
  badgeColor = '#FF9500',
  details = [],
  onDismiss,
  iconColor,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.bought;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 40, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, { toValue: 0.8, duration: 150, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const circleColor = iconColor || config.color;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{config.label} {badge}</Text>
            <TouchableOpacity onPress={onDismiss} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction icon circle */}
          <View style={[styles.iconCircle, { backgroundColor: circleColor }]}>
            <Text style={styles.iconText}>{config.icon}</Text>
          </View>

          {/* Amount + Badge */}
          <View style={styles.amountRow}>
            <Text style={styles.amountText}>
              {type === 'received' ? '+' : type === 'exchanged' ? '' : '-'} {amount}
            </Text>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          </View>

          {/* Transaction Details card */}
          {details.length > 0 && (
            <View style={styles.detailsCard}>
              <Text style={styles.detailsTitle}>Transaction Details</Text>
              {details.map((row, i) => (
                <View key={i} style={[styles.detailsRow, i < details.length - 1 && styles.detailsBorder]}>
                  <Text style={styles.detailsLabel}>{row.label}</Text>
                  <Text style={[styles.detailsValue, row.highlight && { color: '#1E95EA' }]}>{row.value}</Text>
                </View>
              ))}
              {/* Status row */}
              <View style={[styles.detailsRow, styles.detailsBorder]}>
                <Text style={styles.detailsLabel}>Status</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: '#4CD964', fontSize: 14, marginRight: 4 }}>✓</Text>
                  <Text style={[styles.detailsValue, { color: '#4CD964' }]}>Complete</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C3040',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  amountText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C3040',
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  detailsCard: {
    backgroundColor: '#F9F9FB',
    borderRadius: 14,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailsBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  detailsLabel: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  detailsValue: {
    fontSize: 14,
    color: '#1C3040',
    fontWeight: '600',
  },
});

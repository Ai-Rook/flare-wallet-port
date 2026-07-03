import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Modal } from 'react-native';

/**
 * BiometricConfirm — Spend-style "Confirm with Face ID / Touch ID / Password / Passcode" screen.
 * White sheet with: back arrow + "Confirm" header + close X,
 * crypto icon circle with glow, amount + badge,
 * Transaction Details card (Rate, Price, Fee, Total),
 * blue biometric confirmation button.
 *
 * Props:
 *   visible — show/hide
 *   icon — crypto icon character (e.g. "₿")
 *   iconColor — circle color (default '#FF9500' for BTC)
 *   amount — crypto amount string (e.g. "2.087")
 *   badge — ticker badge text (e.g. "BTC")
 *   badgeColor — badge background color
 *   details — array of { label, value, highlight? }
 *   confirmMethod — 'face-id' | 'touch-id' | 'password' | 'passcode'
 *   onConfirm — confirm callback
 *   onCancel — cancel/close callback
 *   onBack — back callback
 */
const METHOD_LABELS = {
  'face-id': 'Confirm with Face ID',
  'touch-id': 'Confirm with Touch ID',
  'password': 'Confirm with Password',
  'passcode': 'Confirm with Passcode',
};

export default function BiometricConfirm({
  visible = false,
  icon = '₿',
  iconColor = '#FF9500',
  amount = '2.087',
  badge = 'BTC',
  badgeColor = '#FF9500',
  details = [],
  confirmMethod = 'face-id',
  onConfirm,
  onCancel,
  onBack,
}) {
  const slideAnim = useRef(new Animated.Value(1)).current;
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.spring(slideAnim, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => setShow(false));
    }
  }, [visible]);

  if (!show) return null;

  return (
    <Modal visible={show} transparent animationType="none" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 600] }) }] }]}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={onBack} style={styles.headerBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Confirm</Text>
            <TouchableOpacity onPress={onCancel} style={styles.headerBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Drag handle */}
          <View style={styles.dragHandle} />

          {/* Crypto icon circle with glow */}
          <View style={[styles.iconCircleOuter, { shadowColor: iconColor }]}>
            <View style={[styles.iconCircle, { backgroundColor: iconColor }]}>
              <Text style={styles.iconText}>{icon}</Text>
            </View>
          </View>

          {/* Amount + Badge */}
          <View style={styles.amountRow}>
            <Text style={styles.amountText}>{amount}</Text>
            <View style={[styles.badge, { backgroundColor: badgeColor }]}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          </View>

          {/* Transaction Details card */}
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Transaction Details</Text>
            {details.map((row, i) => (
              <View key={i} style={[styles.detailsRow, i < details.length - 1 && styles.detailsBorder]}>
                <Text style={styles.detailsLabel}>{row.label}</Text>
                <Text style={[styles.detailsValue, row.highlight && { color: '#1E95EA' }]}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Blue confirm button */}
          <TouchableOpacity onPress={onConfirm} style={styles.confirmBtn} activeOpacity={0.7}>
            <Text style={styles.confirmBtnText}>{METHOD_LABELS[confirmMethod] || 'Confirm'}</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity onPress={onCancel} style={styles.cancelBtn} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    maxHeight: '85%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 22, color: '#1C3040', fontWeight: '600' },
  closeIcon: { fontSize: 18, color: '#8E8E93', fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1C3040' },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 20,
  },
  iconCircleOuter: {
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignSelf: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 32,
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
    fontSize: 34,
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
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 10,
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
  confirmBtn: {
    backgroundColor: '#1E95EA',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#1E95EA',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelBtnText: {
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '600',
  },
});

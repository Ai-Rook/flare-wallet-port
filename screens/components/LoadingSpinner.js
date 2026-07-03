// ============================================================
// components/LoadingSpinner.js — Full-screen loading overlay
// ============================================================
import React from 'react';
import { View, Text, Modal, ActivityIndicator, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../constants/colors';

export function LoadingSpinner({ visible = false, message = 'Loading…' }) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color={BRAND_COLORS.primary} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  message: { marginTop: 16, fontSize: 14, color: BRAND_COLORS.textSecondary, fontWeight: '500' },
});

export default LoadingSpinner;
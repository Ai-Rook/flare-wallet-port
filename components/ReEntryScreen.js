import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity, Modal } from 'react-native';

/**
 * ReEntryScreen — Flare-style biometric re-entry screen.
 * Full-screen gradient with centered auth card.
 *
 * Props:
 *   visible — show/hide
 *   gradientColors — top/bottom gradient (default Flare blue-to-purple)
 *   brandText — brand name shown in auth card (default "Flare")
 *   authType — 'face-id' | 'touch-id' | 'passcode'
 *   onAuthenticate — success callback
 *   onFallback — fallback to passcode/password
 */
const AUTH_CONFIG = {
  'face-id':   { icon: '👤', label: 'Face ID' },
  'touch-id':  { icon: '👆', label: 'Touch ID' },
  'passcode':  { icon: '#', label: 'Passcode' },
};

export default function ReEntryScreen({
  visible = false,
  gradientColors = ['#5856D6', '#7B79E8', '#8E6CC7'],
  brandText = 'Flare',
  authType = 'face-id',
  onAuthenticate,
  onFallback,
}) {
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 50, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(cardScale, { toValue: 0.9, duration: 200, useNativeDriver: true }),
        Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const config = AUTH_CONFIG[authType] || AUTH_CONFIG['face-id'];

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.container}>
        {/* Gradient background */}
        <View style={[styles.gradientBg, { backgroundColor: gradientColors[0] }]}>
          {/* Simulate gradient with layered views */}
          <View style={[styles.gradientLayer1, { backgroundColor: gradientColors[1] }]} />
          <View style={[styles.gradientLayer2, { backgroundColor: gradientColors[2] }]} />
        </View>

        {/* Brand text top */}
        <View style={styles.brandArea}>
          <Text style={styles.brandLabel}>{brandText}</Text>
        </View>

        {/* Auth card */}
        <Animated.View style={[styles.authCard, { transform: [{ scale: cardScale }], opacity: cardOpacity }]}>
          <Text style={styles.authIcon}>{config.icon}</Text>
          <Text style={styles.authLabel}>{config.label}</Text>
          <TouchableOpacity onPress={onAuthenticate} style={styles.authBtn} activeOpacity={0.7}>
            <Text style={styles.authBtnText}>Authenticate</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFallback} style={styles.fallbackBtn} activeOpacity={0.7}>
            <Text style={styles.fallbackText}>Use Passcode Instead</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientLayer1: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.6,
  },
  gradientLayer2: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.4,
  },
  brandArea: {
    position: 'absolute',
    top: 80,
    alignItems: 'center',
  },
  brandLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
  authCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 24,
    paddingHorizontal: 40,
    paddingVertical: 48,
    alignItems: 'center',
    width: '80%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  authIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  authLabel: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 32,
  },
  authBtn: {
    backgroundColor: '#1E95EA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1E95EA',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  authBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  fallbackBtn: {
    marginTop: 16,
    paddingVertical: 8,
  },
  fallbackText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
});

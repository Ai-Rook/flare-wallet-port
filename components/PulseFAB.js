// ============================================================
// PulseFAB — Floating action button with pulse glow
// Uses standard RN Animated (no Reanimated dependency)
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function PulseFAB({ onPress, icon = '$', color = '#5856D6', size = 48, style }) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1.4, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <View style={[styles.container, style]}>
      {/* Pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size + 16, height: size + 16, borderRadius: (size + 16) / 2,
            backgroundColor: color + '40',
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
        ]}
      />
      {/* Button */}
      <TouchableOpacity
        style={[styles.button, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.icon, { color: '#FFF', fontSize: size * 0.38 }]}>{icon}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute' },
  button: {
    alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  icon: { fontWeight: '700' },
});

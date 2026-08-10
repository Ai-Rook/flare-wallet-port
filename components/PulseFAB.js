// ============================================================
// PulseFAB — Glossy orange soda floating action button
// Carbonation pop animation on press, liquid gloss finish.
// ============================================================
import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function PulseFAB({ onPress, icon = '+', color = '#FF6300', size = 48, style }) {
  const pulseScale = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.4)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1.35, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0, duration: 1500, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulseScale, { toValue: 1, duration: 0, useNativeDriver: true }),
          Animated.timing(pulseOpacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handlePressIn = () => {
    // Carbonation pop: quick squish then fizzle
    Animated.sequence([
      Animated.spring(pressScale, { toValue: 0.85, friction: 8, tension: 400, useNativeDriver: true }),
    ]).start();
  };

  const handlePressOut = () => {
    // Spring back with overshoot — like a bubble bouncing
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 3,
      tension: 200,
      overshootClamping: false,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, style]}>
      {/* Pulse ring — orange carbonation glow */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: size + 16, height: size + 16, borderRadius: (size + 16) / 2,
            backgroundColor: 'rgba(255,99,0,0.25)',
            transform: [{ scale: pulseScale }],
            opacity: pulseOpacity,
          },
        ]}
      />
      {/* Glossy button */}
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#FFB627', '#FF6300', '#E85D04']}
            style={[styles.button, { width: size, height: size, borderRadius: size / 2 }]}
            start={{ x: 0.3, y: 0 }}
            end={{ x: 0.7, y: 1 }}
          >
            {/* Gloss highlight — soda surface shine */}
            <View style={[styles.glossHighlight, { left: size * 0.15, width: size * 0.7, height: size * 0.3 }]} />
            <Text style={[styles.icon, { color: '#FFF', fontSize: size * 0.4 }]}>{icon}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute' },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#FF6300',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  glossHighlight: {
    position: 'absolute',
    top: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  icon: { fontWeight: '700' },
});

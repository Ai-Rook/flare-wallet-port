import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ onFinish }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence: logo springs in → text fades in → pause → fade everything out
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.timing(fadeOut, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start(() => {
      if (onFinish) onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeOut }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#5856D6', '#7B79E8', '#6A56E0']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
      <Animated.View style={{ transform: [{ scale: logoScale }], opacity: logoOpacity, alignItems: 'center' }}>
        <Image source={require('../../assets/cp-logo-white-300.png')} style={{ height: 56, width: undefined, aspectRatio: 2.5 }} resizeMode="contain" />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 12 }}>
        <Text style={styles.tagline}>Next-Gen Crypto Wallet</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 12, elevation: 8,
  },
  logoText: { fontSize: 32, fontWeight: '800', color: '#5856D6' },
  brandText: { fontSize: 32, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.5 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4, fontWeight: '500' },
});

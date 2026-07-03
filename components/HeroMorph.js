// HeroMorph — hero transition for token icons
// List icons: static 40px. Detail icons: spring scale from 0.5→1.0 on mount
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

// ── HeroIcon ──────────────────────────────────────────────
// In list: renders at normal size, no animation
// In detail (isDetail=true): springs in from 50% scale with overshoot
export function HeroIcon({ id, source, size = 40, style, isDetail = false }) {
  const scale = useSharedValue(isDetail ? 0.3 : 1);
  const opacity = useSharedValue(isDetail ? 0 : 1);
  const borderRadius = useSharedValue(isDetail ? size : size / 5);

  useEffect(() => {
    if (isDetail) {
      // Spring in with overshoot — the "hero moment"
      scale.value = withSpring(1, {
        damping: 10,
        stiffness: 90,
        overshootClamping: false,
      });
      opacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
      borderRadius.value = withTiming(size / 5, { duration: 300, easing: Easing.out(Easing.ease) });
    }
  }, [isDetail, id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    borderRadius: borderRadius.value,
  }));

  if (source) {
    return (
      <Animated.Image
        source={source}
        style={[
          { width: size, height: size, borderRadius: size / 5 },
          isDetail && animatedStyle,
          style,
        ]}
        resizeMode="contain"
      />
    );
  }

  return (
    <Animated.View
      style={[
        { width: size, height: size, borderRadius: size / 5, alignItems: 'center', justifyContent: 'center', backgroundColor: '#999' },
        isDetail && animatedStyle,
        style,
      ]}
    >
      <Text style={{ color: '#FFF', fontSize: size * 0.4, fontWeight: '700' }}>?</Text>
    </Animated.View>
  );
}

// ── HeroProvider (placeholder for cross-screen shared element in future) ──
export function HeroProvider({ children }) {
  return children;
}

export function useHero() {
  return null;
}

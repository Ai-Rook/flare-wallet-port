// ============================================================
// useScreenEntrance — Fade + slide-up animation on mount
// Drop into any screen component for instant entrance animation
// ============================================================
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export default function useScreenEntrance({ delay = 0, slideY = 20, duration = 400 } = {}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(slideY)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return { opacity, translateY };
}

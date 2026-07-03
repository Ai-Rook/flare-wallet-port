// ============================================================
// Components — AnimatedProgress
// Progress bar that fills with animation
// ============================================================
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const DEFAULT_THEME = {
  primary: '#009AFF',
  accent: '#28CC8C',
  surface: '#E5E5EA',
};

export default function AnimatedProgress({
  value = 0,
  color,
  height = 8,
  animated = true,
  duration = 800,
  theme = {},
  style,
}) {
  const { primary } = { ...DEFAULT_THEME, ...theme };
  const fillColor = color || primary;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      progress.value = withTiming(Math.min(Math.max(value, 0), 1), {
        duration,
        easing: Easing.out(Easing.quad),
      });
    } else {
      progress.value = Math.min(Math.max(value, 0), 1);
    }
  }, [value, animated, duration]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    height: '100%',
    borderRadius: height / 2,
  }));

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <Animated.View style={[fillStyle, { backgroundColor: fillColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: '#E5E5EA',
    overflow: 'hidden',
  },
});

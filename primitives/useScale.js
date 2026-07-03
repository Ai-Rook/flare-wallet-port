// ============================================================
// Primitives — useScale
// Scale up/down with spring animation
// ============================================================
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const DEFAULT_SPRING = { damping: 12, stiffness: 180 };

export function useScale({ from = 0, to = 1, duration = 300, easing = Easing.out(Easing.quad), delay = 0, springConfig } = {}) {
  const scale = useSharedValue(from);

  const animateIn = (cb) => {
    if (springConfig) {
      scale.value = withSpring(to, { ...DEFAULT_SPRING, ...springConfig }, cb);
    } else {
      scale.value = withTiming(to, { duration, easing, delay }, cb);
    }
  };

  const animateOut = (cb) => {
    if (springConfig) {
      scale.value = withSpring(from, { ...DEFAULT_SPRING, ...springConfig }, cb);
    } else {
      scale.value = withTiming(from, { duration, easing, delay }, cb);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, animateIn, animateOut };
}

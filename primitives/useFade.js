// ============================================================
// Primitives — useFade
// Fade in/out with configurable duration and easing
// ============================================================
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const DEFAULT_SPRING = { damping: 20, stiffness: 200 };

export function useFade({ duration = 300, easing = Easing.out(Easing.quad), delay = 0, springConfig } = {}) {
  const opacity = useSharedValue(0);

  const animateIn = (cb) => {
    if (springConfig) {
      opacity.value = withSpring(1, { ...DEFAULT_SPRING, ...springConfig }, cb);
    } else {
      opacity.value = withTiming(1, { duration, easing, delay }, cb);
    }
  };

  const animateOut = (cb) => {
    if (springConfig) {
      opacity.value = withSpring(0, { ...DEFAULT_SPRING, ...springConfig }, cb);
    } else {
      opacity.value = withTiming(0, { duration, easing, delay }, cb);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return { animatedStyle, animateIn, animateOut };
}

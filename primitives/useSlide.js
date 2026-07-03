// ============================================================
// Primitives — useSlide
// Slide in/out on X or Y axis with spring or timing
// ============================================================
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const DEFAULT_SPRING = { damping: 20, stiffness: 200 };

export function useSlide({ axis = 'y', from = 300, to = 0, duration = 400, easing = Easing.out(Easing.quad), delay = 0, springConfig } = {}) {
  const offset = useSharedValue(from);

  const animateIn = (cb) => {
    if (springConfig) {
      offset.value = withSpring(to, { ...DEFAULT_SPRING, ...springConfig }, cb);
    } else {
      offset.value = withTiming(to, { duration, easing, delay }, cb);
    }
  };

  const animateOut = (cb) => {
    if (springConfig) {
      offset.value = withSpring(from, { ...DEFAULT_SPRING, ...springConfig }, cb);
    } else {
      offset.value = withTiming(from, { duration, easing, delay }, cb);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    const transform = axis === 'x'
      ? [{ translateX: offset.value }]
      : [{ translateY: offset.value }];
    return { transform };
  });

  return { animatedStyle, animateIn, animateOut };
}

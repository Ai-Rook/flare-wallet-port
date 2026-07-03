// ============================================================
// Primitives — useStagger
// Stagger children animations with configurable delay per item
// Returns an array of animated styles, one per child
// ============================================================
import { useState, useEffect } from 'react';
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';

const DEFAULT_SPRING = { damping: 20, stiffness: 200 };

export function useStagger({ count, staggerDelay = 80, duration = 400, easing = Easing.out(Easing.quad), springConfig } = {}) {
  const offsets = Array.from({ length: count }, () => useSharedValue(30));
  const opacities = Array.from({ length: count }, () => useSharedValue(0));
  const [triggered, setTriggered] = useState(false);

  const animateIn = () => {
    setTriggered(true);
    offsets.forEach((offset, i) => {
      const delay = i * staggerDelay;
      if (springConfig) {
        offset.value = withSpring(0, { ...DEFAULT_SPRING, ...springConfig });
        opacities[i].value = withSpring(1, { ...DEFAULT_SPRING, ...springConfig });
      } else {
        offset.value = withTiming(0, { duration, easing, delay });
        opacities[i].value = withTiming(1, { duration, easing, delay });
      }
    });
  };

  const animateOut = () => {
    setTriggered(false);
    offsets.forEach((offset, i) => {
      const delay = i * staggerDelay;
      if (springConfig) {
        offset.value = withSpring(30, { ...DEFAULT_SPRING, ...springConfig });
        opacities[i].value = withSpring(0, { ...DEFAULT_SPRING, ...springConfig });
      } else {
        offset.value = withTiming(30, { duration, easing, delay });
        opacities[i].value = withTiming(0, { duration, easing, delay });
      }
    });
  };

  const animatedStyles = offsets.map((offset, i) =>
    useAnimatedStyle(() => ({
      opacity: opacities[i].value,
      transform: [{ translateY: offset.value }],
    }))
  );

  return { animatedStyles, animateIn, animateOut };
}

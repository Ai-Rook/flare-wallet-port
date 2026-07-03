import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

/**
 * GlowPulse — soft breathing shadow animation on a wrapped element.
 * Creates the "alive" premium feel like Spend card hover states.
 *
 * Props:
 *   color — shadow color (default '#5856D6')
 *   minOpacity — minimum shadow opacity (default 0.15)
 *   maxOpacity — maximum shadow opacity (default 0.4)
 *   duration — pulse cycle in ms (default 2000)
 *   radius — shadow blur radius (default 16)
 *   offsetY — shadow vertical offset (default 4)
 */
export default function GlowPulse({
  color = '#5856D6',
  minOpacity = 0.15,
  maxOpacity = 0.4,
  duration = 2000,
  radius = 16,
  offsetY = 4,
  style,
  children,
}) {
  const shadowOpacity = useRef(new Animated.Value(minOpacity)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shadowOpacity, {
          toValue: maxOpacity,
          duration: duration / 2,
          useNativeDriver: false, // shadow props need JS driver
        }),
        Animated.timing(shadowOpacity, {
          toValue: minOpacity,
          duration: duration / 2,
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [minOpacity, maxOpacity, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          shadowColor: color,
          shadowOpacity,
          shadowRadius: radius,
          shadowOffset: { width: 0, height: offsetY },
          elevation: 6,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

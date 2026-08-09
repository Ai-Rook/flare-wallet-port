import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

/**
 * PortfolioRing — animated circular progress ring with colored arc segments.
 * Matches the Flare portfolio orb with radial glow + colored arcs.
 *
 * Props:
 *   size — diameter of the ring (default 120)
 *   thickness — ring stroke width (default 6)
 *   segments — array of { value: 0-1, color: string }
 *   duration — arc draw-in animation ms (default 800)
 *   glowColor — shadow glow color (default '#5856D6')
 *   centerContent — node to render inside the ring
 */
export default function PortfolioRing({
  size = 120,
  thickness = 6,
  segments = [
    { value: 0.45, color: '#FF9500' },
    { value: 0.25, color: '#55D987' },
    { value: 0.2, color: '#1E95EA' },
  ],
  duration = 800,
  glowColor = '#5856D6',
  centerContent,
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration,
      useNativeDriver: false, // layout props
    }).start();
  }, [duration]);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Glow behind ring */}
      <View style={{
        position: 'absolute',
        width: size * 0.8,
        height: size * 0.8,
        borderRadius: size * 0.4,
        backgroundColor: glowColor,
        opacity: 0.15,
      }} />

      {/* Background track ring */}
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: thickness,
        borderColor: '#E5E5EA',
      }} />

      {/* Colored arc segments — rendered as rotated bars */}
      {segments.map((seg, i) => {
        const prevTotal = segments.slice(0, i).reduce((sum, s) => sum + s.value, 0);
        const startAngle = prevTotal * 360;
        const arcLength = seg.value * circumference;

        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              transform: [
                { rotate: `${startAngle}deg` },
              ],
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0, 0.5, 1],
              }),
            }}
            pointerEvents="none"
          >
            {/* Arc segment rendered as a thick border on a small rotated circle */}
            <View style={{
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: thickness,
              borderColor: seg.color,
              position: 'absolute',
              // Clip to only show the arc portion
              overflow: 'hidden',
              opacity: 0.9,
            }} />
          </Animated.View>
        );
      })}

      {/* Center content */}
      {centerContent && (
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          {centerContent}
        </View>
      )}
    </View>
  );
}

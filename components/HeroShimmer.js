import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * HeroShimmer — a gradient light sweep that animates across a hero area.
 * Gives the "lit from within" premium fintech feel like Flare.
 *
 * Usage: Wrap any hero content. The shimmer sweeps left-to-right on a loop.
 *
 * Props:
 *   width, height — dimensions of the shimmer overlay
 *   duration — sweep cycle in ms (default 2500)
 *   pause — stop the loop (default false)
 *   color — shimmer tint (default 'rgba(255,255,255,0.12)')
 */
export default function HeroShimmer({
  width = '100%',
  height = 200,
  duration = 2500,
  pause = false,
  color = 'rgba(255,255,255,0.12)',
  style,
  children,
}) {
  const shimmerX = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    if (pause) return;
    const loop = Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 2,
        duration,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [pause, duration]);

  const translateX = shimmerX.interpolate({
    inputRange: [-1, 2],
    outputRange: [-300, 900],
  });

  return (
    <View style={[{ width, height, overflow: 'hidden' }, style]}>
      {children}
      {/* Shimmer sweep layer */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateX }],
          opacity: pause ? 0 : 1,
        }}
        pointerEvents="none"
      >
        <LinearGradient
          colors={[
            'transparent',
            'transparent',
            color,
            'transparent',
            'transparent',
          ]}
          locations={[0, 0.3, 0.5, 0.7, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

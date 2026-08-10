// FizzBubbles — animated rising carbonation bubbles
// Pure CSS/Animated, no dependencies. Lightweight ~15 bubbles.
import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function FizzBubbles({ count = 12, color = 'rgba(255,255,255,0.15)', style }) {
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,           // % across width
      size: 3 + Math.random() * 8,       // 3-11px
      duration: 2000 + Math.random() * 3000, // 2-5s
      delay: Math.random() * 4000,       // stagger
      drift: (Math.random() - 0.5) * 20,  // horizontal drift px
      opacity: 0.1 + Math.random() * 0.25,
    }));
  }, [count]);

  return (
    <View style={[styles.container, style]} pointerEvents="none">
      {bubbles.map(b => (
        <Bubble key={b.id} {...b} color={color} />
      ))}
    </View>
  );
}

function Bubble({ x, size, duration, delay, drift, opacity, color }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const fadeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -200,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: drift,
            duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(fadeOpacity, { toValue: opacity, duration: duration * 0.2, useNativeDriver: true }),
            Animated.timing(fadeOpacity, { toValue: 0, duration: duration * 0.8, useNativeDriver: true }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver: true }),
          Animated.timing(translateX, { toValue: 0, duration: 0, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: `${x}%`,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: fadeOpacity,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    bottom: -20,
  },
});

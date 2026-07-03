// ============================================================
// Components — CounterRoll
// Animated number counter that rolls digits
// ============================================================
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedProps, withTiming, Easing } from 'react-native-reanimated';

const DEFAULT_THEME = {
  text: '#333333',
  primary: '#009AFF',
};

export default function CounterRoll({
  value = 0,
  duration = 1200,
  decimals = 2,
  prefix = '',
  suffix = '',
  fontSize = 32,
  fontWeight = '700',
  theme = {},
  style,
}) {
  const { text: textColor } = { ...DEFAULT_THEME, ...theme };
  const current = useSharedValue(0);
  const targetRef = useRef(null);

  useEffect(() => {
    current.value = withTiming(value, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [value, duration]);

  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const start = parseFloat(displayValue.replace(/[^0-9.\-]/g, '')) || 0;
    const end = value;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
      const current = start + (end - start) * eased;
      setDisplayValue(current.toFixed(decimals));

      if (progress >= 1) {
        clearInterval(timer);
        setDisplayValue(end.toFixed(decimals));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration, decimals]);

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, { fontSize, fontWeight, color: textColor }]}>
        {prefix}{displayValue}{suffix}
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontVariant: ['tabular-nums'],
  },
});

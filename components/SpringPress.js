// SpringPress — TouchableOpacity with spring physics on press
// Scale down on press, spring back with overshoot on release
import React, { useRef, useCallback } from 'react';
import { Animated, TouchableOpacity, Easing } from 'react-native';

export default function SpringPress({ children, onPress, style, activeScale = 0.94, disabled = false }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: activeScale,
      friction: 8,
      tension: 300,
      useNativeDriver: true,
    }).start();
  }, [activeScale]);

  const handlePressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 200,
      overshootClamping: false,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        disabled={disabled}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}

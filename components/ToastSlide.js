import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

/**
 * ToastSlide — animated notification toast that slides in from the top.
 * Matches Spend's blue snackbar / toast notification style.
 *
 * Props:
 *   visible — show/hide (default false)
 *   message — text content
 *   color — background color (default '#1E95EA')
 *   duration — auto-dismiss in ms (default 3000), 0 = stay
 *   onDismiss — callback when toast auto-dismisses or X pressed
 *   icon — optional left icon (text/emoji)
 */
export default function ToastSlide({
  visible = false,
  message = '',
  color = '#1E95EA',
  duration = 3000,
  onDismiss,
  icon,
}) {
  const slideY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, friction: 7, tension: 40, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      // Auto-dismiss
      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          dismiss();
        }, duration);
      }
    } else {
      dismiss();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideY, { toValue: -80, duration: 200, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 50,
        left: 12,
        right: 12,
        zIndex: 100,
        transform: [{ translateY: slideY }],
        opacity,
      }}
    >
      <View style={{
        backgroundColor: color,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: color,
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}>
        {icon && <Text style={{ fontSize: 18, marginRight: 10 }}>{icon}</Text>}
        <Text style={{ flex: 1, color: '#FFF', fontSize: 15, fontWeight: '600' }}>{message}</Text>
        <Text
          onPress={dismiss}
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, fontWeight: '700', marginLeft: 10 }}
        >
          ✕
        </Text>
      </View>
    </Animated.View>
  );
}

// ============================================================
// Components — SlideUpSheet
// Bottom sheet that slides up from bottom
// ============================================================
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing, runOnJS } from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const DEFAULT_HEIGHT = SCREEN_HEIGHT * 0.6;

const DEFAULT_THEME = {
  surface: '#FFFFFF',
  border: '#E5E5EA',
  text: '#333333',
};

export default function SlideUpSheet({
  visible = false,
  onDismiss,
  children,
  height = DEFAULT_HEIGHT,
  duration = 400,
  theme = {},
  style,
}) {
  const { surface } = { ...DEFAULT_THEME, ...theme };
  const translateY = useSharedValue(height);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
    } else {
      translateY.value = withTiming(height, { duration, easing: Easing.in(Easing.quad) });
    }
  }, [visible, height, duration]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible && translateY.value >= height) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={visible ? 'auto' : 'none'}>
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.sheet, { height, backgroundColor: surface }, sheetStyle, style]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D1D6',
    alignSelf: 'center',
    marginBottom: 12,
  },
});

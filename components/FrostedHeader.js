// ============================================================
// FrostedHeader — Reusable frosted glass header for stack screens
// Appears on scroll, matches Flare design
// ============================================================
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Image } from 'react-native';
import { BlurView } from 'expo-blur';

export default function FrostedHeader({ title, onBack, scrollY, brandText = 'Flare', rightAction }) {
  const headerOpacity = scrollY ? scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  }) : 0;

  return (
    <Animated.View style={[styles.container, { opacity: headerOpacity }]} pointerEvents={headerOpacity.__getValue?.() > 0.3 ? 'auto' : 'none'}>
      <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
        {rightAction || <View style={{ width: 32 }} />}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 56, zIndex: 10,
  },
  content: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
  },
  backBtn: { padding: 8 },
  backIcon: { color: '#FFF', fontSize: 22 },
  title: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});

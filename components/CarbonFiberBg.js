// CarbonFiberBg — renders carbon fiber texture as background
// Used for headers, cards, and accent borders
import React from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';

const carbonFiber = require('../assets/carbon-fiber.png');

export function CarbonFiberBackground({ children, style, opacity = 0.3 }) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={carbonFiber}
        style={[styles.texture, { opacity }]}
        resizeMode="repeat"
      />
      <View style={StyleSheet.absoluteFill}>
        {children}
      </View>
    </View>
  );
}

// Thin carbon fiber border strip
export function CarbonFiberBorder({ height = 3, style }) {
  return (
    <Image
      source={carbonFiber}
      style={[{ width: '100%', height, opacity: 0.6 }, style]}
      resizeMode="repeat"
    />
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  texture: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
});

// ============================================================
// CardSnap — Horizontal card carousel with snap
// Uses standard RN Animated (no Reanimated dependency)
// ============================================================
import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CardSnap({ cards = [], renderItem, cardWidth = SCREEN_WIDTH * 0.78, gap = 14, style }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  return (
    <Animated.ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
      scrollEventThrottle={16}
      decelerationRate="fast"
      snapToInterval={cardWidth + gap}
      snapToAlignment="start"
      contentContainerStyle={[styles.content, { gap }]}
      style={style}
    >
      {cards.map((card, i) => {
        const inputRange = [
          (i - 1) * (cardWidth + gap),
          i * (cardWidth + gap),
          (i + 1) * (cardWidth + gap),
        ];
        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [0.92, 1, 0.92],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.6, 1, 0.6],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View key={i} style={{ width: cardWidth, transform: [{ scale }], opacity }}>
            {renderItem ? renderItem(card, i) : <View style={styles.defaultCard} />}
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingVertical: 8 },
  defaultCard: { height: 180, borderRadius: 16, backgroundColor: '#E5E5EA' },
});

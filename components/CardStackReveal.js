import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

/**
 * CardStackReveal — offset cards behind the main card that slide into position.
 * Creates the "card stack / carousel" 3D depth effect from Spend success screens.
 *
 * Props:
 *   count — number of background cards (default 2)
 *   stagger — delay between each card in ms (default 80)
 *   offset — vertical pixel offset between stacked cards (default 8)
 *   duration — slide animation duration (default 500)
 *   cardStyle — style for each background card
 */
export default function CardStackReveal({
  count = 2,
  stagger = 80,
  offset = 8,
  duration = 500,
  cardStyle,
  children,
}) {
  const anims = useRef(Array.from({ length: count }, () => new Animated.Value(30))).current;

  useEffect(() => {
    const animations = anims.map((a, i) =>
      Animated.sequence([
        Animated.delay(i * stagger),
        Animated.spring(a, {
          toValue: 0,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(stagger, animations).start();
  }, []);

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Background cards — stacked behind with offset */}
      {anims.map((anim, i) => {
        const translateY = anim;
        const stackIndex = count - i; // furthest back = highest index
        return (
          <Animated.View
            key={i}
            style={[
              {
                position: 'absolute',
                top: -(stackIndex * offset),
                left: stackIndex * 2,
                right: stackIndex * 2,
                opacity: 0.15 + (i * 0.1),
                transform: [{ translateY }],
                zIndex: -stackIndex,
              },
              cardStyle,
            ]}
            pointerEvents="none"
          />
        );
      })}

      {/* Main card — on top */}
      <View style={{ zIndex: 10 }}>
        {children}
      </View>
    </View>
  );
}

// ============================================================
// SparklineChart — Minimal dot sparkline for wallet cards
// Pure RN Animated, no SVG dependency
// ============================================================
import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function SparklineChart({
  data = [],
  width = 40,
  height = 20,
  color = '#4CD964',
  fillColor,
  strokeWidth = 1.5,
  animated = true,
  style,
}) {
  const opacityAnim = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, []);

  if (!data || data.length < 2) return <View style={[{ width, height }, style]} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Generate dot positions — small circles connected visually
  const dotRadius = 1.5;
  const stepX = (width - dotRadius * 2) / (data.length - 1);

  const dots = data.map((val, i) => {
    const x = dotRadius + i * stepX;
    const y = height - dotRadius - ((val - min) / range) * (height - dotRadius * 2);
    const isLast = i === data.length - 1;
    return { x, y, isLast };
  });

  // Generate line segments as thin views between dots
  const segments = [];
  for (let i = 0; i < dots.length - 1; i++) {
    const d = dots[i];
    const dNext = dots[i + 1];
    const dx = dNext.x - d.x;
    const dy = dNext.y - d.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    segments.push({ x: d.x, y: d.y, length, angle });
  }

  const lineColor = fillColor || `${color}60`;

  return (
    <Animated.View style={[{ width, height, opacity: opacityAnim }, style]}>
      {/* Line segments */}
      {segments.map((seg, i) => (
        <View
          key={`s${i}`}
          style={{
            position: 'absolute',
            left: seg.x,
            top: seg.y + dotRadius,
            width: seg.length,
            height: 1,
            backgroundColor: lineColor,
            transform: [{ rotate: `${seg.angle}deg` }],
            transformOrigin: '0 0',
          }}
          pointerEvents="none"
        />
      ))}

      {/* Dots */}
      {dots.map((dot, i) => (
        <View
          key={`d${i}`}
          style={{
            position: 'absolute',
            left: dot.x - dotRadius,
            top: dot.y - dotRadius,
            width: dotRadius * 2,
            height: dotRadius * 2,
            borderRadius: dotRadius,
            backgroundColor: dot.isLast ? color : lineColor,
          }}
          pointerEvents="none"
        />
      ))}

      {/* Last dot glow — slightly larger with shadow */}
      {dots.length > 0 && (
        <View
          style={{
            position: 'absolute',
            left: dots[dots.length - 1].x - dotRadius * 1.5,
            top: dots[dots.length - 1].y - dotRadius * 1.5,
            width: dotRadius * 3,
            height: dotRadius * 3,
            borderRadius: dotRadius * 1.5,
            backgroundColor: color,
            opacity: 0.3,
          }}
          pointerEvents="none"
        />
      )}
    </Animated.View>
  );
}

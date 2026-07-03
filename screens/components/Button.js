// ============================================================
// components/Button.js — Primary/secondary/ghost button variants
// ============================================================
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BRAND_COLORS } from '../constants/colors';

export function Button({
  title,
  onPress,
  variant = 'primary', // primary | secondary | ghost | danger
  size = 'md',         // sm | md | lg
  disabled = false,
  loading = false,
  icon,
  style,
}) {
  const variantStyles = {
    primary: { bg: BRAND_COLORS.primary, text: '#fff', border: 'transparent' },
    secondary: { bg: '#fff', text: BRAND_COLORS.primary, border: BRAND_COLORS.primary },
    ghost: { bg: 'transparent', text: BRAND_COLORS.primary, border: 'transparent' },
    danger: { bg: BRAND_COLORS.error, text: '#fff', border: 'transparent' },
  }[variant] || {};

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
    md: { paddingVertical: 14, paddingHorizontal: 24, fontSize: 15 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, fontSize: 17 },
  }[size] || {};

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: variantStyles.bg, borderColor: variantStyles.border || 'transparent', borderWidth: 1 },
        variant === 'secondary' && styles.secondaryBorder,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variantStyles.text} size="small" />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[
            styles.label,
            { color: variantStyles.text, ...sizeStyles },
            icon ? { marginLeft: 8 } : {},
          ]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryBorder: { borderWidth: 1.5 },
  disabled: { opacity: 0.5 },
  label: { fontWeight: '700', textAlign: 'center' },
});

export default Button;
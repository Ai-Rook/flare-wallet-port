// ============================================================
// components/AmountInput.js — Amount input with currency toggle
// Used in buy/sell, exchange, send screens
// ============================================================
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { BRAND_COLORS } from '../constants/colors';

export function AmountInput({
  label = 'Amount',
  value,
  onChangeText,
  currency = 'USD',
  currencies = ['USD', 'BTC', 'ETH'],
  onCurrencyChange,
  placeholder = '0.00',
  fiatValue,
  showFiatEquivalent = true,
  error,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={BRAND_COLORS.textTertiary}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
        {currencies.length > 1 && (
          <TouchableOpacity
            style={styles.currencyPicker}
            onPress={() => {
              const idx = currencies.indexOf(currency);
              const next = currencies[(idx + 1) % currencies.length];
              onCurrencyChange?.(next);
            }}
          >
            <Text style={styles.currencyLabel}>{currency}</Text>
            <Text style={styles.currencyArrow}>▼</Text>
          </TouchableOpacity>
        )}
        {currencies.length === 1 && (
          <Text style={styles.currencyLabel}>{currency}</Text>
        )}
      </View>
      {showFiatEquivalent && fiatValue != null && (
        <Text style={styles.fiatEquivalent}>
          ≈ ${fiatValue?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: BRAND_COLORS.textSecondary, marginBottom: 8 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputRowError: { borderColor: BRAND_COLORS.error },
  input: { flex: 1, fontSize: 24, fontWeight: '700', color: BRAND_COLORS.textPrimary },
  currencyPicker: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12 },
  currencyLabel: { fontSize: 16, fontWeight: '600', color: BRAND_COLORS.primary, marginRight: 4 },
  currencyArrow: { fontSize: 10, color: BRAND_COLORS.primary },
  fiatEquivalent: { fontSize: 13, color: BRAND_COLORS.textTertiary, marginTop: 6, textAlign: 'right' },
  error: { fontSize: 12, color: BRAND_COLORS.error, marginTop: 4 },
});

export default AmountInput;
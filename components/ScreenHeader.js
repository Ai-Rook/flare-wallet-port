import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FizzBubbles from './FizzBubbles';

/**
 * ScreenHeader — Sunkist orange gradient header with fizz bubble animation.
 * Layout: [← back] | [logo] [page name] ... [right action]
 */
export default function ScreenHeader({
  pageName = '',
  onBack,
  rightAction,
  editing = false,
  onCancel,
  onDone,
  noBorder = false,
}) {
  return (
    <LinearGradient
      colors={['#FF6300', '#FF8C1A', '#E85D04']}
      style={[styles.header, noBorder && styles.noBorder]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Fizz bubbles rising in header */}
      <FizzBubbles count={8} color="rgba(255,255,255,0.12)" />

      {/* Left: back arrow or edit cancel */}
      {editing ? (
        <TouchableOpacity onPress={onCancel} style={styles.headerBtn}>
          <Text style={styles.headerBtnText}>Cancel</Text>
        </TouchableOpacity>
      ) : onBack ? (
        <TouchableOpacity
          onPress={onBack}
          style={styles.backBtn}
          hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      ) : null}

      {/* Brand: logo + page name */}
      <View style={styles.brandRow}>
        <Text style={styles.logoText}>🍊</Text>
        {pageName ? (
          <Text style={styles.pageLabel}>{pageName}</Text>
        ) : null}
      </View>

      {/* Right: edit done or custom action */}
      {editing ? (
        <TouchableOpacity onPress={onDone} style={styles.headerBtn}>
          <Text style={[styles.headerBtnText, { fontWeight: '700' }]}>Done</Text>
        </TouchableOpacity>
      ) : rightAction ? (
        <View style={styles.headerBtn}>{rightAction}</View>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '400',
  },
  headerBtn: {
    minWidth: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  headerBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 4,
  },
  logoText: {
    fontSize: 20,
  },
  pageLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 6,
  },
});

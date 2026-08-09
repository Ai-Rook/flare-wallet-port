import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * ScreenHeader — UNIFORM purple gradient header across ALL screens.
 * Layout: [← back] | [CP logo] [page name] ... [right action]
 *
 * Brand left-aligned, right action pinned right.
 * Combined logo image (icon + "Flare" in one PNG).
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
      colors={['#5856D6', '#7B79E8']}
      style={[styles.header, noBorder && styles.noBorder]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
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

      {/* Brand: logo image + page name — left aligned, flex to fill */}
      <View style={styles.brandRow}>
        <Image
          source={require('../assets/cp-logo-white-300.png')}
          style={styles.logo}
          resizeMode="contain"
        />
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
    borderBottomColor: 'rgba(255,255,255,0.12)',
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
  logo: {
    height: 24,
    width: undefined,
    aspectRatio: 2.5,
  },
  pageLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 16,
    fontWeight: '400',
    marginLeft: 6,
  },
});

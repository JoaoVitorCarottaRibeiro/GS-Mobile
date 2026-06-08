import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface BadgeProps {
  label: string;
  textColor?: string;
  bgColor?: string;
  style?: ViewStyle;
}

export function Badge({
  label,
  textColor = '#FFFFFF',
  bgColor = '#0088CC',
  style,
}: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }, style]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

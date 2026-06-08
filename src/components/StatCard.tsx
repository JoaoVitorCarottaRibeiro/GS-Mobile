import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  accentColor?: string;
  style?: ViewStyle;
}

export function StatCard({ icon, label, value, accentColor, style }: StatCardProps) {
  const { colors } = useTheme();
  const color = accentColor ?? colors.primary;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
        style,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginHorizontal: Spacing.xs,
  },
  icon: { fontSize: 26, marginBottom: 6 },
  value: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: 2 },
  label: { fontSize: FontSize.xs, textAlign: 'center', lineHeight: 16 },
});

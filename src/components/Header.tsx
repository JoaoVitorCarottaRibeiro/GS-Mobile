import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { FontSize, Spacing } from '../theme';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onRightPress?: () => void;
}

export function Header({ title, subtitle, rightElement, onRightPress }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.texts}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>
      {rightElement ? (
        <TouchableOpacity onPress={onRightPress} style={styles.right} hitSlop={8}>
          {rightElement}
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  texts: { flex: 1 },
  title: { fontSize: FontSize.xxl, fontWeight: '700', letterSpacing: -0.5 },
  subtitle: { fontSize: FontSize.sm, marginTop: 2 },
  right: { padding: Spacing.xs },
});

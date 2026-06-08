import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, Spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, onPress, style, padding = Spacing.md }: CardProps) {
  const { colors } = useTheme();

  const base: ViewStyle = {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.lg,
    padding,
    marginBottom: Spacing.md,
  };

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress} style={[base, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[base, style]}>{children}</View>;
}

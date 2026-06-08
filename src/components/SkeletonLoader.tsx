import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, Spacing } from '../theme';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonProps) {
  const { isDark } = useTheme();
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 0.7, duration: 700, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.3, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          opacity: anim,
          backgroundColor: isDark ? '#1E3A5F' : '#CBD5E0',
        },
        style,
      ]}
    />
  );
}

export function CardSkeleton() {
  return (
    <View style={styles.wrap}>
      <Skeleton height={180} borderRadius={BorderRadius.lg} style={{ marginBottom: Spacing.sm }} />
      <Skeleton height={18} width="65%" style={{ marginBottom: 6 }} />
      <Skeleton height={13} width="100%" style={{ marginBottom: 4 }} />
      <Skeleton height={13} width="85%" />
    </View>
  );
}

export function StatRowSkeleton() {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} height={80} width="30%" borderRadius={BorderRadius.md} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
});

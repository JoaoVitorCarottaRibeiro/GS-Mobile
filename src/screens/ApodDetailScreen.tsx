import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { RootStackParamList } from '../navigation/types';
import { Badge } from '../components/Badge';
import { FontSize, Spacing, BorderRadius } from '../theme';
import { formatDate } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'ApodDetail'>;

export function ApodDetailScreen({ route }: Props) {
  const { apod } = route.params;
  const { colors } = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const favorited = isFavorite(apod.date);

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(apod.date);
    } else {
      addFavorite({ id: apod.date, type: 'apod', data: apod });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Imagem / vídeo */}
        {apod.media_type === 'image' ? (
          <Image source={{ uri: apod.hdurl ?? apod.url }} style={styles.image} resizeMode="cover" />
        ) : (
          <TouchableOpacity
            style={[styles.videoBox, { backgroundColor: colors.card }]}
            onPress={() => Linking.openURL(apod.url)}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 52 }}>▶️</Text>
            <Text style={[styles.videoLabel, { color: colors.textSecondary }]}>
              Toque para abrir o vídeo
            </Text>
            <Text style={[styles.videoUrl, { color: colors.primary }]} numberOfLines={1}>
              {apod.url}
            </Text>
          </TouchableOpacity>
        )}

        <View style={styles.content}>
          {/* Title row */}
          <View style={styles.row}>
            <Badge label="NASA APOD" bgColor={colors.primaryDim} />
            <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn} hitSlop={8}>
              <Text style={{ fontSize: 26 }}>{favorited ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{apod.title}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(apod.date)}</Text>

          {apod.copyright ? (
            <Text style={[styles.copyright, { color: colors.textMuted }]}>
              © {apod.copyright.replace('\n', ' ')}
            </Text>
          ) : null}

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            📖 Explicação
          </Text>
          <Text style={[styles.explanation, { color: colors.text }]}>{apod.explanation}</Text>

          {apod.hdurl && apod.media_type === 'image' ? (
            <TouchableOpacity
              style={[styles.hdBtn, { borderColor: colors.primary }]}
              onPress={() => Linking.openURL(apod.hdurl!)}
              activeOpacity={0.8}
            >
              <Text style={[styles.hdBtnText, { color: colors.primary }]}>
                🖼️ Ver imagem em HD
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: Spacing.xxl },
  image: { width: '100%', height: 280 },
  videoBox: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  videoLabel: { fontSize: FontSize.md, marginTop: Spacing.sm },
  videoUrl: { fontSize: FontSize.xs, marginTop: Spacing.xs },
  content: { padding: Spacing.md },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.sm,
  },
  favBtn: { padding: Spacing.xs },
  title: { fontSize: FontSize.xl, fontWeight: '700', marginBottom: 4, lineHeight: 28 },
  date: { fontSize: FontSize.sm, marginBottom: 4 },
  copyright: { fontSize: FontSize.xs, fontStyle: 'italic', marginBottom: Spacing.sm },
  divider: { height: 1, marginVertical: Spacing.md },
  sectionLabel: { fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.sm },
  explanation: { fontSize: FontSize.md, lineHeight: 24, letterSpacing: 0.1 },
  hdBtn: {
    marginTop: Spacing.lg,
    borderWidth: 1.5,
    borderRadius: BorderRadius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  hdBtnText: { fontSize: FontSize.md, fontWeight: '600' },
});

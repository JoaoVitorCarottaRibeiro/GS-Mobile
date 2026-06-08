import React from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { Spacing, FontSize, BorderRadius, ThemeColors } from '../theme';
import {
  Simulation, SIM_TYPE_META, SIM_STATUS_META, riskColor, riskLabel,
} from '../types/cityorbit';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

function FavCard({ sim, onPress, onRemove }: {
  sim: Simulation; onPress: () => void; onRemove: () => void;
}) {
  const { colors } = useTheme();
  const s          = makeStyles(colors);
  const meta       = SIM_TYPE_META[sim.type];
  const status     = SIM_STATUS_META[sim.status];

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      <View style={s.cardTop}>
        <View style={[s.iconBox, { backgroundColor: meta.color + '22' }]}>
          <Text style={{ fontSize: 24 }}>{meta.icon}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={s.title} numberOfLines={1}>{meta.label}</Text>
          <Text style={s.city}>{sim.city.name}, {sim.city.state}</Text>
        </View>
        <TouchableOpacity onPress={onRemove} style={s.removeBtn}>
          <Text style={s.removeText}>✕</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.desc} numberOfLines={2}>{sim.description}</Text>
      <View style={s.row}>
        <View style={[s.badge, { backgroundColor: status.color + '22' }]}>
          <Text style={[s.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
        {sim.riskScore !== undefined && (
          <View style={[s.badge, { backgroundColor: riskColor(sim.riskScore) + '22' }]}>
            <Text style={[s.badgeText, { color: riskColor(sim.riskScore) }]}>
              Risco {riskLabel(sim.riskScore)} · {sim.riskScore}/100
            </Text>
          </View>
        )}
        {sim.nasaData && (
          <View style={[s.badge, { backgroundColor: colors.primary + '1A' }]}>
            <Text style={[s.badgeText, { color: colors.primary }]}>NASA POWER</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function FavoritesScreen() {
  const { colors }                              = useTheme();
  const { favorites, removeFavorite, loading } = useFavorites();
  const navigation                             = useNavigation<Nav>();
  const s                                      = makeStyles(colors);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={s.header}>
        <Text style={s.headerTitle}>⭐ Favoritos</Text>
        <Text style={s.headerSub}>{favorites.length} salvo(s)</Text>
      </View>

      {loading ? (
        <View style={s.empty}>
          <Text style={s.emptyText}>Carregando...</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: Spacing.md, paddingTop: Spacing.sm }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => (
            <FavCard
              sim={item}
              onPress={() => navigation.navigate('SimDetail', { simulation: item })}
              onRemove={() => removeFavorite(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>⭐</Text>
              <Text style={s.emptyTitle}>Nenhum favorito ainda</Text>
              <Text style={s.emptyText}>
                Abra uma simulação e toque em ⭐ para salvar aqui.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    header:      { paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm, flexDirection: 'row', alignItems: 'baseline', gap: Spacing.sm },
    headerTitle: { color: c.text, fontSize: FontSize.xl, fontWeight: '800' },
    headerSub:   { color: c.textMuted, fontSize: FontSize.sm },
    card:        { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, padding: Spacing.md },
    cardTop:     { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
    iconBox:     { width: 48, height: 48, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
    title:       { color: c.text, fontSize: FontSize.md, fontWeight: '700' },
    city:        { color: c.textSecondary, fontSize: FontSize.sm },
    desc:        { color: c.textMuted, fontSize: FontSize.sm, lineHeight: 18, marginBottom: Spacing.sm },
    row:         { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    badge:       { borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText:   { fontSize: FontSize.xs, fontWeight: '700' },
    removeBtn:   { padding: 6, borderRadius: BorderRadius.full, backgroundColor: c.danger + '22' },
    removeText:  { color: c.danger, fontSize: FontSize.sm, fontWeight: '700' },
    empty:       { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: Spacing.xl },
    emptyTitle:  { color: c.text, fontSize: FontSize.lg, fontWeight: '700', marginBottom: 8 },
    emptyText:   { color: c.textMuted, fontSize: FontSize.md, textAlign: 'center', lineHeight: 22 },
  });
}

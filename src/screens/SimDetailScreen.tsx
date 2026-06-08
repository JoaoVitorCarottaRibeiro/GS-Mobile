import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import { useTheme }     from '../contexts/ThemeContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useData }      from '../contexts/DataContext';
import { Spacing, FontSize, BorderRadius, ThemeColors } from '../theme';
import {
  SIM_TYPE_META, SIM_STATUS_META, riskColor, riskLabel,
} from '../types/cityorbit';
import { RootStackParamList } from '../navigation/types';

type Route = RouteProp<RootStackParamList, 'SimDetail'>;

function InfoRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
      <Text style={{ color: colors.textSecondary, fontSize: FontSize.sm }}>{label}</Text>
      <Text style={{ color: valueColor ?? colors.text, fontSize: FontSize.sm, fontWeight: '600', flexShrink: 1, marginLeft: 16, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

export function SimDetailScreen() {
  const { colors }                                   = useTheme();
  const { isFavorite, addFavorite, removeFavorite }  = useFavorites();
  const { simulations }                              = useData();
  const navigation                                   = useNavigation();
  const route                                        = useRoute<Route>();
  const { simulationId }                             = route.params;

  const sim = simulations.find((s) => s.id === simulationId);

  if (!sim) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: colors.textMuted, fontSize: FontSize.lg }}>Simulação não encontrada.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontWeight: '700' }}>← Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const s      = makeStyles(colors);
  const meta   = SIM_TYPE_META[sim.type];
  const status = SIM_STATUS_META[sim.status];
  const fav    = isFavorite(sim.id);
  const risk   = sim.riskScore;

  const toggleFav = async () => {
    if (fav) await removeFavorite(sim.id);
    else     await addFavorite(sim);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <Text style={{ color: colors.primary, fontSize: FontSize.md, fontWeight: '700' }}>← Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFav} style={s.favBtn}>
          <Text style={{ fontSize: 26 }}>{fav ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[s.heroBox, { backgroundColor: meta.color + '15', borderColor: meta.color + '44' }]}>
          <Text style={{ fontSize: 60 }}>{meta.icon}</Text>
          <Text style={[s.typeLabel, { color: meta.color }]}>{meta.label}</Text>
          <Text style={s.cityLabel}>{sim.city.name}, {sim.city.state}</Text>
        </View>

        {/* Badges */}
        <View style={s.badgeRow}>
          <View style={[s.badge, { backgroundColor: status.color + '22' }]}>
            <Text style={[s.badgeText, { color: status.color }]}>{status.label}</Text>
          </View>
          {risk !== undefined && (
            <View style={[s.badge, { backgroundColor: riskColor(risk) + '22' }]}>
              <Text style={[s.badgeText, { color: riskColor(risk) }]}>
                Risco {riskLabel(risk)} · {risk}/100
              </Text>
            </View>
          )}
          {sim.nasaData && (
            <View style={[s.badge, { backgroundColor: colors.primary + '1A' }]}>
              <Text style={[s.badgeText, { color: colors.primary }]}>NASA POWER</Text>
            </View>
          )}
        </View>

        {/* Risk Bar */}
        {risk !== undefined && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Pontuação de Risco</Text>
            <View style={s.riskBg}>
              <View style={[s.riskFill, { width: `${risk}%` as any, backgroundColor: riskColor(risk) }]} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={{ color: colors.success, fontSize: FontSize.xs }}>0 — Baixo</Text>
              <Text style={{ color: riskColor(risk), fontSize: FontSize.md, fontWeight: '800' }}>{risk}/100</Text>
              <Text style={{ color: colors.danger, fontSize: FontSize.xs }}>Alto — 100</Text>
            </View>
          </View>
        )}

        {/* Descrição */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Descrição</Text>
          <Text style={s.desc}>{sim.description}</Text>
        </View>

        {/* Info */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Informações</Text>
          <View style={s.divider} />
          <InfoRow label="ID"               value={`#${sim.id}`} />
          <View style={s.divider} />
          <InfoRow label="Tipo"             value={meta.label}   valueColor={meta.color} />
          <View style={s.divider} />
          <InfoRow label="Status"           value={status.label} valueColor={status.color} />
          <View style={s.divider} />
          <InfoRow label="Data"             value={sim.createdAt} />
          <View style={s.divider} />
          <InfoRow label="Cidade"           value={`${sim.city.name} — ${sim.city.state}`} />
          <View style={s.divider} />
          <InfoRow label="LIDAR"
            value={sim.city.lidar ? '✓ Disponível' : '✗ Indisponível'}
            valueColor={sim.city.lidar ? colors.success : colors.textMuted}
          />
          <View style={s.divider} />
          <InfoRow label="Resolução Sat."   value={sim.city.satelliteRes ?? '—'} />
          <View style={s.divider} />
          <InfoRow label="NASA POWER"
            value={sim.nasaData ? '✓ Integrado' : '✗ Sem dados'}
            valueColor={sim.nasaData ? colors.primary : colors.textMuted}
          />
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    topBar:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
    backBtn:  { padding: Spacing.xs },
    favBtn:   { padding: Spacing.xs },
    scroll:   { padding: Spacing.md, paddingTop: 0 },
    heroBox:  { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.md },
    typeLabel:{ fontSize: FontSize.xxl, fontWeight: '800', textAlign: 'center', marginTop: 8 },
    cityLabel:{ color: c.textSecondary, fontSize: FontSize.md, textAlign: 'center', marginTop: 4 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.md },
    badge:    { borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 4 },
    badgeText:{ fontSize: FontSize.sm, fontWeight: '700' },
    card:     { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, padding: Spacing.md, marginBottom: Spacing.md },
    cardTitle:{ color: c.text, fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
    desc:     { color: c.textSecondary, fontSize: FontSize.md, lineHeight: 22 },
    divider:  { height: 1, backgroundColor: c.border },
    riskBg:   { height: 10, backgroundColor: c.border, borderRadius: BorderRadius.full, marginVertical: Spacing.sm, overflow: 'hidden' },
    riskFill: { height: '100%', borderRadius: BorderRadius.full },
  });
}

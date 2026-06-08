import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme }  from '../contexts/ThemeContext';
import { useData }   from '../contexts/DataContext';
import { Spacing, FontSize, BorderRadius, ThemeColors } from '../theme';
import {
  Simulation, SIM_TYPE_META, SIM_STATUS_META, riskColor, riskLabel,
} from '../types/cityorbit';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={{
      flex: 1, minWidth: '45%',
      backgroundColor: colors.card, borderRadius: BorderRadius.md,
      borderWidth: 1, borderColor: colors.border, padding: Spacing.md,
      borderTopColor: accent, borderTopWidth: 3,
    }}>
      <Text style={{ color: colors.text, fontSize: FontSize.xxl, fontWeight: '800' }}>{value}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: FontSize.xs, marginTop: 2 }}>{label}</Text>
      {sub ? <Text style={{ color: colors.textMuted, fontSize: FontSize.xs }}>{sub}</Text> : null}
    </View>
  );
}

function SimRow({ sim, onPress }: { sim: Simulation; onPress: () => void }) {
  const { colors } = useTheme();
  const meta   = SIM_TYPE_META[sim.type];
  const status = SIM_STATUS_META[sim.status];

  return (
    <TouchableOpacity
      style={{ flexDirection: 'row', alignItems: 'center', padding: Spacing.md }}
      onPress={onPress} activeOpacity={0.8}
    >
      <View style={{
        width: 44, height: 44, borderRadius: BorderRadius.sm,
        backgroundColor: meta.color + '22', alignItems: 'center', justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 20 }}>{meta.icon}</Text>
      </View>
      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
        <Text style={{ color: colors.text, fontSize: FontSize.sm, fontWeight: '600' }} numberOfLines={1}>
          {meta.label} — {sim.city.name}
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, marginTop: 2 }} numberOfLines={1}>
          {sim.description}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={{ borderRadius: BorderRadius.full, paddingHorizontal: 6, paddingVertical: 2, backgroundColor: status.color + '22' }}>
          <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: status.color }}>{status.label}</Text>
        </View>
        {sim.riskScore !== undefined && (
          <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: riskColor(sim.riskScore), marginTop: 4 }}>
            {sim.riskScore}/100
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const { colors }              = useTheme();
  const { cities, simulations } = useData();
  const navigation              = useNavigation<Nav>();
  const s                       = makeStyles(colors);

  const completed = simulations.filter((s) => s.status === 'COMPLETED');
  const withRisk  = completed.filter((s) => s.riskScore !== undefined);
  const avgRisk   = withRisk.length
    ? Math.round(withRisk.reduce((acc, s) => acc + s.riskScore!, 0) / withRisk.length) : 0;
  const recent    = simulations.slice(0, 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Cabeçalho clicável → LP ── */}
        <TouchableOpacity
          style={s.header}
          onPress={() => navigation.navigate('Landing')}
          activeOpacity={0.75}
        >
          <View>
            <Text style={s.logoText}>CityOrbit</Text>
            <Text style={s.logoSub}>Digital Twin Platform</Text>
          </View>
          <View style={[s.badge, { backgroundColor: colors.primary + '1A', paddingHorizontal: 10, paddingVertical: 5 }]}>
            <Text style={[s.badgeText, { color: colors.primary }]}>NASA POWER</Text>
          </View>
        </TouchableOpacity>

        {/* ── Boas-vindas ── */}
        <View style={s.heroCard}>
          <Text style={s.heroTitle}>Dashboard de Monitoramento</Text>
          <Text style={s.heroSub}>
            Gemêos digitais de cidades brasileiras com simulações de
            eventos climáticos e urbanos em tempo real.
          </Text>
        </View>

        {/* ── Stats ── */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md }}>
          <StatCard label="Cidades"     value={cities.length}      accent={colors.primary}   />
          <StatCard label="Simulações"  value={simulations.length} accent={colors.secondary} />
          <StatCard label="Concluídas"  value={completed.length}   accent={colors.success}   />
          <StatCard label="Risco Médio" value={avgRisk} sub="/100" accent={riskColor(avgRisk)} />
        </View>

        {/* ── Cidades ── */}
        <Text style={s.sectionTitle}>Cidades Monitoradas</Text>
        {cities.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: FontSize.sm, marginBottom: Spacing.md }}>
            Nenhuma cidade cadastrada ainda. Acesse a aba Cidades para adicionar.
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
            {cities.map((city) => (
              <View key={city.id} style={s.cityChip}>
                <Text style={{ color: colors.text, fontSize: FontSize.sm, fontWeight: '700' }}>{city.name}</Text>
                <Text style={{ color: colors.textMuted, fontSize: FontSize.xs }}>{city.state}</Text>
                {city.lidar && (
                  <View style={[s.badge, { backgroundColor: colors.primary + '22', marginTop: 4 }]}>
                    <Text style={[s.badgeText, { color: colors.primary }]}>LIDAR</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {/* ── Simulações recentes ── */}
        <Text style={s.sectionTitle}>Simulações Recentes</Text>
        <View style={s.card}>
          {recent.length === 0 ? (
            <Text style={{ color: colors.textMuted, textAlign: 'center', padding: Spacing.lg, fontSize: FontSize.sm }}>
              Nenhuma simulação ainda. Acesse a aba Simulações para criar.
            </Text>
          ) : recent.map((sim, i) => (
            <React.Fragment key={sim.id}>
              <SimRow
                sim={sim}
                onPress={() => navigation.navigate('SimDetail', { simulationId: sim.id })}
              />
              {i < recent.length - 1 && (
                <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: Spacing.md }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* ── Tipos ── */}
        <Text style={s.sectionTitle}>Tipos de Simulação</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl }}>
          {(['FLOOD', 'TRAFFIC', 'CONSTRUCTION', 'HEAT_ISLAND'] as const).map((type) => {
            const m = SIM_TYPE_META[type];
            return (
              <View key={type} style={[s.typeCard, { borderColor: m.color + '55', borderTopColor: m.color, borderTopWidth: 2 }]}>
                <Text style={{ fontSize: 26, marginBottom: 6 }}>{m.icon}</Text>
                <Text style={{ fontSize: FontSize.sm, fontWeight: '700', color: m.color }}>{m.label}</Text>
              </View>
            );
          })}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    scroll:       { padding: Spacing.md },
    header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: c.border },
    logoText:     { color: c.primary, fontSize: FontSize.xl, fontWeight: '800', letterSpacing: 0.5 },
    logoSub:      { color: c.textMuted, fontSize: FontSize.xs, marginTop: 2 },
    heroCard:     { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, padding: Spacing.md, marginBottom: Spacing.md },
    heroTitle:    { color: c.text, fontSize: FontSize.lg, fontWeight: '700', marginBottom: 6 },
    heroSub:      { color: c.textSecondary, fontSize: FontSize.sm, lineHeight: 20 },
    sectionTitle: { color: c.text, fontSize: FontSize.md, fontWeight: '700', marginBottom: Spacing.sm },
    card:         { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, marginBottom: Spacing.md, overflow: 'hidden' },
    cityChip:     { backgroundColor: c.card, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: c.border, padding: Spacing.sm, marginRight: Spacing.sm, minWidth: 90, alignItems: 'center' },
    badge:        { borderRadius: BorderRadius.full, paddingHorizontal: 6, paddingVertical: 2 },
    badgeText:    { fontSize: FontSize.xs, fontWeight: '700' },
    typeCard:     { flex: 1, minWidth: '44%', backgroundColor: c.card, borderRadius: BorderRadius.md, borderWidth: 1, padding: Spacing.md, alignItems: 'center' },
  });
}

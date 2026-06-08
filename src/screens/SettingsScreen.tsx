import React, { useState } from 'react';
import {
  View, Text, Switch, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme }      from '../contexts/ThemeContext';
import { useFavorites }  from '../contexts/FavoritesContext';
import { useData }       from '../contexts/DataContext';
import { ConfirmModal }  from '../components/ConfirmModal';
import { StorageService } from '../storage/storage';
import { Spacing, FontSize, BorderRadius, ThemeColors } from '../theme';

function Row({ label, sub, right }: { label: string; sub?: string; right: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm }}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontSize: FontSize.md, fontWeight: '600' }}>{label}</Text>
        {sub ? <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, marginTop: 2 }}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1, paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.xs, textTransform: 'uppercase' }}>
      {title}
    </Text>
  );
}

export function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { favorites }                   = useFavorites();
  const { cities, simulations }         = useData();
  const s                               = makeStyles(colors);
  const [confirmOpen, setConfirmOpen]   = useState(false);

  const doClean = async () => {
    await StorageService.clearAll();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: Spacing.md }}>
        <Text style={{ color: colors.text, fontSize: FontSize.xl, fontWeight: '800' }}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Aparência */}
        <SectionHeader title="Aparência" />
        <View style={s.card}>
          <Row label="Tema escuro" sub="Alterna entre modo escuro e claro"
            right={
              <Switch value={isDark} onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary + '88' }}
                thumbColor={isDark ? colors.primary : colors.textMuted}
              />
            }
          />
        </View>

        {/* Dados */}
        <SectionHeader title="Dados" />
        <View style={s.card}>
          <Row label="Cidades cadastradas"
            right={<Text style={[s.val, { color: colors.primary }]}>{cities.length}</Text>} />
          <View style={s.div} />
          <Row label="Simulações"
            right={<Text style={[s.val, { color: colors.secondary }]}>{simulations.length}</Text>} />
          <View style={s.div} />
          <Row label="Favoritos"
            right={<Text style={[s.val, { color: colors.accent }]}>{favorites.length}</Text>} />
          <View style={s.div} />
          <Row label="Armazenamento" sub="AsyncStorage local"
            right={<Text style={[s.val, { color: colors.success }]}>✓ Ativo</Text>} />
        </View>

        {/* Sobre */}
        <SectionHeader title="Sobre o Projeto" />
        <View style={s.card}>
          <View style={{ padding: Spacing.md }}>
            <Text style={{ color: colors.text, fontSize: FontSize.xl, fontWeight: '800', marginBottom: 4 }}>
              CityOrbit Mobile
            </Text>
            <Text style={{ color: colors.primary, fontSize: FontSize.sm, fontWeight: '600', marginBottom: Spacing.sm }}>
              v1.0.0 — FIAP Global Solution 2026
            </Text>
            <Text style={{ color: colors.textSecondary, fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.sm }}>
              Plataforma de Digital Twin para monitoramento e simulação de eventos urbanos
              em cidades brasileiras. Simulações de enchentes, tráfego, obras e ilhas de
              calor com integração à API NASA POWER.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {[
                { label: 'React Native', color: colors.primary   },
                { label: 'Expo SDK 55', color: colors.secondary },
                { label: 'TypeScript',  color: '#3b82f6'        },
                { label: 'NASA POWER',  color: colors.accent    },
                { label: 'AsyncStorage',color: colors.success   },
              ].map((chip) => (
                <View key={chip.label} style={{
                  borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 4,
                  borderWidth: 1, backgroundColor: chip.color + '22', borderColor: chip.color + '55',
                }}>
                  <Text style={{ fontSize: FontSize.xs, fontWeight: '700', color: chip.color }}>{chip.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Ações */}
        <SectionHeader title="Ações" />
        <View style={s.card}>
          <TouchableOpacity style={{ padding: Spacing.md }} onPress={() => setConfirmOpen(true)}>
            <Text style={{ color: colors.danger, fontSize: FontSize.md, fontWeight: '600' }}>Limpar todos os dados</Text>
            <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, marginTop: 2 }}>
              Remove favoritos e recarrega os exemplos ao reiniciar
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>

      <ConfirmModal
        visible={confirmOpen}
        title="Limpar todos os dados?"
        message="Isso remove favoritos e dados persistidos. Os dados de exemplo voltarão ao reiniciar o app."
        confirmLabel="Limpar"
        onConfirm={doClean}
        onCancel={() => setConfirmOpen(false)}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    card: { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, marginHorizontal: Spacing.md, marginBottom: Spacing.sm, overflow: 'hidden' },
    div:  { height: 1, backgroundColor: c.border, marginHorizontal: Spacing.md },
    val:  { fontSize: FontSize.md, fontWeight: '700' },
  });
}

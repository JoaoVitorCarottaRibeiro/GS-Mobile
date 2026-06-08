import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../contexts/ThemeContext';
import { RootStackParamList } from '../navigation/types';
import { BorderRadius, FontSize, Spacing, ThemeColors } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Landing'>;

function GridOverlay() {
  const { width, height } = useWindowDimensions();
  const cols = 8, rows = 6;
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* vertical lines */}
      {Array.from({ length: cols }).map((_, i) => (
        <View key={`v${i}`} style={{
          position: 'absolute', top: 0, bottom: 0,
          left: (width / cols) * i,
          width: 1, backgroundColor: 'rgba(0,212,255,0.05)',
        }} />
      ))}
      {/* horizontal lines */}
      {Array.from({ length: rows }).map((_, i) => (
        <View key={`h${i}`} style={{
          position: 'absolute', left: 0, right: 0,
          top: (height * 0.65 / rows) * i,
          height: 1, backgroundColor: 'rgba(0,212,255,0.05)',
        }} />
      ))}
      {/* glow blobs */}
      <View style={{ position: 'absolute', top: -60, right: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(0,212,255,0.06)' }} />
      <View style={{ position: 'absolute', bottom: -40, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(124,58,237,0.07)' }} />
    </View>
  );
}

function StatBar() {
  const { colors } = useTheme();
  const stats = [
    { value: '+5',   label: 'Cidades' },
    { value: '4',    label: 'Tipos de evento' },
    { value: 'NASA', label: 'POWER API' },
    { value: '100%', label: 'TypeScript' },
  ];
  return (
    <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
      {stats.map((s, i) => (
        <View key={s.label} style={{
          flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
          borderRightWidth: i < stats.length - 1 ? 1 : 0,
          borderRightColor: 'rgba(255,255,255,0.08)',
        }}>
          <Text style={{ color: colors.primary, fontSize: FontSize.xl, fontWeight: '900' }}>{s.value}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: FontSize.xs, marginTop: 2, textAlign: 'center' }}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

function Chip({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: colors.primary + '22', borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 4, marginBottom: Spacing.sm, borderWidth: 1, borderColor: colors.primary + '44' }}>
      <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1 }}>{label}</Text>
    </View>
  );
}

function MissionCard({ title, desc }: { title: string; desc: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: colors.border, padding: Spacing.md, marginBottom: Spacing.sm, borderLeftWidth: 3, borderLeftColor: colors.primary }}>
      <Text style={{ color: colors.text, fontSize: FontSize.md, fontWeight: '700', marginBottom: 4 }}>{title}</Text>
      <Text style={{ color: colors.textMuted, fontSize: FontSize.sm, lineHeight: 18 }}>{desc}</Text>
    </View>
  );
}

export function LandingScreen() {
  const { colors }   = useTheme();
  const navigation   = useNavigation<Nav>();
  const insets       = useSafeAreaInsets();
  const { height }   = useWindowDimensions();
  const [aboutOpen, setAboutOpen] = useState(false);

  const goToDash = () => navigation.replace('Main');

  return (
    <View style={{ flex: 1, backgroundColor: '#060b18' }}>
      {/* ── NAVBAR ── */}
      <View style={[styles.navbar, { paddingTop: insets.top + 8 }]}>
        <Text style={[styles.navLogo, { color: colors.primary }]}>CityOrbit</Text>
        <TouchableOpacity style={[styles.navBtn, { borderColor: colors.primary + '55' }]} onPress={goToDash}>
          <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '700' }}>Entrar →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
        {/* ── HERO ── */}
        <View style={[styles.hero, { minHeight: height * 0.62 }]}>
          <GridOverlay />

          {/* content */}
          <View style={styles.heroContent}>
            <View style={styles.heroChip}>
              <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 1 }}>
                FIAP GLOBAL SOLUTION 2026
              </Text>
            </View>

            <Text style={styles.heroHeading}>
              Transformando{'\n'}cidades com{'\n'}
              <Text style={{ color: colors.primary }}>inteligência{'\n'}digital</Text>
            </Text>

            <Text style={styles.heroSub}>
              Simulações de eventos urbanos em tempo real.{'\n'}
              Dados NASA POWER. Gemêo digital de cidades brasileiras.
            </Text>

            <View style={styles.ctaRow}>
              <TouchableOpacity style={[styles.ctaPrimary, { backgroundColor: colors.primary }]} onPress={goToDash}>
                <Text style={{ color: '#060b18', fontSize: FontSize.md, fontWeight: '800' }}>Acessar Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.ctaSecondary, { borderColor: colors.primary + '55' }]}
                onPress={() => setAboutOpen((v) => !v)}>
                <Text style={{ color: colors.primary, fontSize: FontSize.md, fontWeight: '700' }}>
                  {aboutOpen ? 'Fechar ↑' : 'Saiba mais ↓'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* bottom fade */}
          <View style={styles.heroFade} />
        </View>

        {/* ── STATS BAR ── */}
        <StatBar />

        {/* ── SOBRE O PROJETO ── */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Chip label="SOBRE O PROJETO" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Tecnologia urbana para{'\n'}transformar cidades brasileiras
          </Text>

          <View style={{ flexDirection: 'row', gap: Spacing.md, flexWrap: 'wrap' }}>
            {/* texto */}
            <View style={{ flex: 2, minWidth: 240 }}>
              <Text style={{ color: colors.textSecondary, fontSize: FontSize.md, lineHeight: 24, marginBottom: Spacing.md }}>
                O CityOrbit nasceu com o propósito de aproximar gestores públicos de dados
                precisos sobre eventos urbanos. Nossa plataforma permite que prefeituras
                registrem e simulem enchentes, travamentos de tráfego, impactos de obras
                e ilhas de calor com dados reais da NASA.
              </Text>
              <Text style={{ color: colors.textSecondary, fontSize: FontSize.md, lineHeight: 24 }}>
                Através da integração com a <Text style={{ color: colors.primary, fontWeight: '700' }}>API NASA POWER</Text> e
                escaneamentos LIDAR, tornamos o processo de tomada de decisão mais
                transparente, eficiente e acessível para todos.
              </Text>

              {/* micro stats */}
              <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.lg, flexWrap: 'wrap' }}>
                {[
                  { n: '+5',   l: 'cidades\nmonitoradas' },
                  { n: '4',    l: 'tipos de\nsimulação' },
                  { n: '24h',  l: 'monitoramento\ncontinuo' },
                ].map((s) => (
                  <View key={s.n} style={{ flex: 1, minWidth: 80, backgroundColor: colors.card, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: colors.border, padding: Spacing.md, alignItems: 'center' }}>
                    <Text style={{ color: colors.primary, fontSize: FontSize.xxl, fontWeight: '900' }}>{s.n}</Text>
                    <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* cards missão */}
            <View style={{ flex: 1, minWidth: 200 }}>
              <MissionCard title="Nossa missão"  desc="Melhorar a gestão urbana através de simulações inteligentes e dados climáticos reais." />
              <MissionCard title="Nosso objetivo" desc="Tornar as análises de risco urbano mais rápidas, organizadas e eficientes com tecnologia." />
              <MissionCard title="Nosso impacto"  desc="Incentivar a participação ativa de gestores na melhoria das cidades." />
            </View>
          </View>
        </View>

        {/* ── COMO FUNCIONA ── */}
        <View style={[styles.section, { backgroundColor: colors.surface ?? '#0d1525' }]}>
          <Chip label="COMO FUNCIONA" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Simples de usar,{'\n'}poderoso nos resultados
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}>
            {[
              { n: '01', t: 'Cadastre cidades',      d: 'Adicione as cidades com dados de sensoriamento e resolução de satélite.' },
              { n: '02', t: 'Crie simulações',        d: 'Escolha o tipo de evento, defina o risco e integre com NASA POWER.' },
              { n: '03', t: 'Analise os resultados', d: 'Acompanhe o status no dashboard com pontuação de risco em tempo real.' },
              { n: '04', t: 'Salve o que importa',   d: 'Marque simulações críticas como favoritas para acesso rápido.' },
            ].map((step) => (
              <View key={step.n} style={{ flex: 1, minWidth: 160, backgroundColor: colors.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: Spacing.md }}>
                <Text style={{ color: colors.primary, fontSize: FontSize.xxl, fontWeight: '900', marginBottom: 8 }}>{step.n}</Text>
                <Text style={{ color: colors.text, fontSize: FontSize.md, fontWeight: '700', marginBottom: 4 }}>{step.t}</Text>
                <Text style={{ color: colors.textMuted, fontSize: FontSize.sm, lineHeight: 18 }}>{step.d}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── SIMULAÇÕES ── */}
        <View style={[styles.section, { backgroundColor: colors.background }]}>
          <Chip label="TIPOS DE SIMULAÇÃO" />
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quatro categorias de eventos urbanos</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm }}>
            {[
              { icon: '🌊', title: 'Enchente',      desc: 'Alagamentos e cheias com dados de precipitação NASA.', color: '#3b82f6' },
              { icon: '🚗', title: 'Tráfego',       desc: 'Colapso viário em obras e eventos de alto impacto.',   color: '#f59e0b' },
              { icon: '🏗️', title: 'Obra Urbana',   desc: 'Impacto de grandes obras na mobilidade local.',        color: '#eab308' },
              { icon: '🌡️', title: 'Ilha de Calor', desc: 'Zonas de calor extremo em áreas metropolitanas.',      color: '#ef4444' },
            ].map((f) => (
              <View key={f.title} style={{ flex: 1, minWidth: '44%', backgroundColor: colors.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: f.color + '33', padding: Spacing.md, borderTopWidth: 3, borderTopColor: f.color }}>
                <Text style={{ fontSize: 32, marginBottom: 8 }}>{f.icon}</Text>
                <Text style={{ color: f.color, fontSize: FontSize.md, fontWeight: '700', marginBottom: 4 }}>{f.title}</Text>
                <Text style={{ color: colors.textMuted, fontSize: FontSize.sm, lineHeight: 18 }}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── NASA POWER ── */}
        <View style={{ backgroundColor: colors.primary + '0D', borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.primary + '33', padding: Spacing.xl, marginHorizontal: 0 }}>
          <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '800', letterSpacing: 2, marginBottom: 8 }}>INTEGRAÇÃO</Text>
          <Text style={{ color: colors.text, fontSize: FontSize.xl, fontWeight: '800', marginBottom: Spacing.sm }}>NASA POWER API</Text>
          <Text style={{ color: colors.textSecondary, fontSize: FontSize.md, lineHeight: 24 }}>
            Os dados climáticos das simulações provêm da API pública
            <Text style={{ color: colors.primary, fontWeight: '700' }}> NASA POWER</Text> (Prediction Of Worldwide Energy Resources),
            que fornece dados meteorológicos históricos e em tempo real para qualquer
            ponto do planeta — sem custo.
          </Text>
        </View>

        {/* ── FINAL CTA ── */}
        <View style={[styles.section, { backgroundColor: colors.background, alignItems: 'center' }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, textAlign: 'center' }]}>
            Pronto para começar?
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: FontSize.md, textAlign: 'center', marginBottom: Spacing.lg, lineHeight: 22 }}>
            Acesse o dashboard e monitore cidades em tempo real.
          </Text>
          <TouchableOpacity style={[styles.ctaPrimary, { backgroundColor: colors.primary, paddingHorizontal: 48 }]} onPress={goToDash}>
            <Text style={{ color: '#060b18', fontSize: FontSize.md, fontWeight: '800' }}>Acessar Dashboard →</Text>
          </TouchableOpacity>
        </View>

        {/* footer */}
        <View style={{ backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, padding: Spacing.lg, alignItems: 'center' }}>
          <Text style={{ color: colors.primary, fontSize: FontSize.md, fontWeight: '800', marginBottom: 4 }}>CityOrbit</Text>
          <Text style={{ color: colors.textMuted, fontSize: FontSize.xs }}>FIAP Global Solution 2026 · Digital Twin Platform</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  navLogo:     { fontSize: FontSize.xl, fontWeight: '900', letterSpacing: 1.5 },
  navBtn:      { borderWidth: 1, borderRadius: BorderRadius.full, paddingHorizontal: 14, paddingVertical: 6 },
  hero:        { justifyContent: 'flex-end', backgroundColor: '#060b18', overflow: 'hidden' },
  heroContent: { padding: Spacing.lg, paddingBottom: Spacing.xl, zIndex: 1 },
  heroChip:    { alignSelf: 'flex-start', backgroundColor: 'rgba(0,212,255,0.12)', borderRadius: BorderRadius.full, paddingHorizontal: 12, paddingVertical: 4, marginBottom: Spacing.md, borderWidth: 1, borderColor: 'rgba(0,212,255,0.3)' },
  heroHeading: { color: '#ffffff', fontSize: 38, fontWeight: '900', lineHeight: 44, letterSpacing: -0.5, marginBottom: Spacing.md },
  heroSub:     { color: 'rgba(255,255,255,0.55)', fontSize: FontSize.md, lineHeight: 22, marginBottom: Spacing.lg },
  ctaRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  ctaPrimary:  { borderRadius: BorderRadius.full, paddingHorizontal: 24, paddingVertical: 13 },
  ctaSecondary:{ borderRadius: BorderRadius.full, paddingHorizontal: 20, paddingVertical: 13, borderWidth: 1 },
  heroFade:    { height: 40, backgroundColor: 'transparent' },
  section:     { padding: Spacing.lg, paddingVertical: Spacing.xl },
  sectionTitle:{ fontSize: FontSize.xxl, fontWeight: '800', lineHeight: 30, marginBottom: Spacing.lg },
});

import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput,
  Modal, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme }       from '../contexts/ThemeContext';
import { useData }        from '../contexts/DataContext';
import { useFavorites }   from '../contexts/FavoritesContext';
import { ConfirmModal }   from '../components/ConfirmModal';
import { Spacing, FontSize, BorderRadius, ThemeColors } from '../theme';
import {
  Simulation, SimulationType, SimulationStatus,
  SIM_TYPE_META, SIM_STATUS_META, riskColor, riskLabel,
} from '../types/cityorbit';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const ALL_TYPES:    (SimulationType   | 'ALL')[] = ['ALL','FLOOD','TRAFFIC','CONSTRUCTION','HEAT_ISLAND'];
const ALL_STATUSES: (SimulationStatus | 'ALL')[] = ['ALL','PENDING','PROCESSING','COMPLETED','FAILED'];
const ALL_SIM_TYPES: SimulationType[]             = ['FLOOD','TRAFFIC','CONSTRUCTION','HEAT_ISLAND'];
const ALL_SIM_STATUS: SimulationStatus[]          = ['PENDING','PROCESSING','COMPLETED','FAILED'];

interface SimForm {
  cityId: string; type: SimulationType; status: SimulationStatus;
  riskScore: string; nasaData: boolean; description: string;
}
const EMPTY_FORM: SimForm = { cityId: '', type: 'FLOOD', status: 'PENDING', riskScore: '', nasaData: false, description: '' };

function SimModal({ visible, editSim, onClose }: { visible: boolean; editSim: Simulation | null; onClose: () => void }) {
  const { colors }                           = useTheme();
  const { cities, addSimulation, updateSimulation } = useData();
  const [form, setForm]                      = useState<SimForm>(EMPTY_FORM);
  const [err, setErr]                        = useState('');
  const s = makeModalStyles(colors);

  React.useEffect(() => {
    setErr('');
    if (editSim) {
      setForm({ cityId: editSim.city.id, type: editSim.type, status: editSim.status, riskScore: editSim.riskScore !== undefined ? String(editSim.riskScore) : '', nasaData: editSim.nasaData, description: editSim.description });
    } else {
      setForm({ ...EMPTY_FORM, cityId: cities[0]?.id ?? '' });
    }
  }, [editSim, visible, cities]);

  const set = <K extends keyof SimForm>(field: K, value: SimForm[K]) => setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.cityId)             { setErr('Selecione uma cidade.'); return; }
    if (!form.description.trim()) { setErr('Descrição é obrigatória.'); return; }
    const risk = form.riskScore.trim() ? parseInt(form.riskScore) : undefined;
    if (risk !== undefined && (isNaN(risk) || risk < 0 || risk > 100)) { setErr('Risco deve ser 0–100.'); return; }
    setErr('');
    if (editSim) {
      await updateSimulation({ ...editSim, city: cities.find((c) => c.id === form.cityId) ?? editSim.city, type: form.type, status: form.status, riskScore: risk, nasaData: form.nasaData, description: form.description.trim() });
    } else {
      await addSimulation({ cityId: form.cityId, type: form.type, status: form.status, riskScore: risk, nasaData: form.nasaData, description: form.description.trim() });
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>{editSim ? 'Editar Simulação' : 'Nova Simulação'}</Text>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                <Text style={{ color: colors.textMuted, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Cidade */}
              <Text style={s.label}>Cidade</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.sm }}>
                {cities.map((c) => {
                  const active = form.cityId === c.id;
                  return (
                    <TouchableOpacity key={c.id} onPress={() => set('cityId', c.id)}
                      style={[s.pill, active && { backgroundColor: colors.primary + '33', borderColor: colors.primary }]}>
                      <Text style={[s.pillText, active && { color: colors.primary }]}>{c.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Tipo */}
              <Text style={s.label}>Tipo de Simulação</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm }}>
                {ALL_SIM_TYPES.map((t) => {
                  const m = SIM_TYPE_META[t]; const active = form.type === t;
                  return (
                    <TouchableOpacity key={t} onPress={() => set('type', t)}
                      style={[s.pill, active && { backgroundColor: m.color + '33', borderColor: m.color }]}>
                      <Text style={[s.pillText, active && { color: m.color }]}>{m.icon} {m.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Status */}
              <Text style={s.label}>Status</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: Spacing.sm }}>
                {ALL_SIM_STATUS.map((st) => {
                  const m = SIM_STATUS_META[st]; const active = form.status === st;
                  return (
                    <TouchableOpacity key={st} onPress={() => set('status', st)}
                      style={[s.pill, active && { backgroundColor: m.color + '33', borderColor: m.color }]}>
                      <Text style={[s.pillText, active && { color: m.color }]}>{m.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Risco */}
              <Text style={s.label}>Pontuação de Risco (0–100, opcional)</Text>
              <TextInput style={s.input} value={form.riskScore} onChangeText={(v) => set('riskScore', v)}
                placeholder="ex: 72" placeholderTextColor={colors.textMuted} keyboardType="numeric" />

              {/* NASA */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm }}>
                <Text style={s.label}>Integração NASA POWER</Text>
                <TouchableOpacity onPress={() => set('nasaData', !form.nasaData)}
                  style={[s.pill, form.nasaData && { backgroundColor: colors.primary + '33', borderColor: colors.primary }]}>
                  <Text style={[s.pillText, form.nasaData && { color: colors.primary }]}>
                    {form.nasaData ? 'Ativo' : 'Inativo'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Descrição */}
              <Text style={s.label}>Descrição *</Text>
              <TextInput style={[s.input, { height: 80, textAlignVertical: 'top' }]}
                value={form.description} onChangeText={(v) => set('description', v)}
                placeholder="Descreva a simulação..." placeholderTextColor={colors.textMuted} multiline />

              {err ? <Text style={{ color: colors.danger, fontSize: FontSize.sm, marginBottom: 8 }}>{err}</Text> : null}

              <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                <Text style={s.saveBtnText}>{editSim ? 'Salvar alterações' : 'Criar simulação'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function FilterChip({ label, active, onPress, color }: { label: string; active: boolean; onPress: () => void; color: string }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={{
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: BorderRadius.full, borderWidth: 1.5,
      borderColor: active ? color : colors.border,
      backgroundColor: active ? color + '22' : colors.card, marginRight: 8,
    }}>
      <Text style={{ color: active ? color : colors.textMuted, fontSize: FontSize.xs, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
}

function SimCard({ sim, onPress, onEdit, onDelete, onFav }: {
  sim: Simulation; onPress: () => void; onEdit: () => void; onDelete: () => void; onFav: () => void;
}) {
  const { colors }     = useTheme();
  const { isFavorite } = useFavorites();
  const s              = makeCardStyles(colors);
  const meta           = SIM_TYPE_META[sim.type];
  const status         = SIM_STATUS_META[sim.status];
  const fav            = isFavorite(sim.id);
  const risk           = sim.riskScore;

  return (
    <View style={s.card}>
      {/* top — clica abre detalhe */}
      <TouchableOpacity style={s.top} onPress={onPress} activeOpacity={0.85}>
        <View style={[s.typeIcon, { backgroundColor: meta.color + '22' }]}>
          <Text style={{ fontSize: 22 }}>{meta.icon}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={s.cardTitle} numberOfLines={1}>{meta.label}</Text>
          <Text style={s.cardCity}>{sim.city.name}, {sim.city.state}</Text>
        </View>
        <View style={[s.statusBadge, { backgroundColor: status.color + '22' }]}>
          <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </TouchableOpacity>

      <Text style={s.desc} numberOfLines={2}>{sim.description}</Text>

      {/* badges */}
      <View style={s.badges}>
        <Text style={s.date}>📅 {sim.createdAt}</Text>
        {sim.nasaData && (
          <View style={[s.badge, { backgroundColor: colors.primary + '1A' }]}>
            <Text style={[s.badgeText, { color: colors.primary }]}>NASA POWER</Text>
          </View>
        )}
        {risk !== undefined && (
          <View style={[s.badge, { backgroundColor: riskColor(risk) + '22' }]}>
            <Text style={[s.badgeText, { color: riskColor(risk) }]}>{riskLabel(risk)} {risk}/100</Text>
          </View>
        )}
      </View>

      {/* ações */}
      <View style={s.actions}>
        <TouchableOpacity style={[s.actionBtn, { backgroundColor: fav ? colors.accent + '33' : colors.card, borderColor: fav ? colors.accent : colors.border }]}
          onPress={onFav}>
          <Text style={{ color: fav ? colors.accent : colors.textMuted, fontSize: FontSize.xs, fontWeight: '700' }}>
            {fav ? 'Favoritado' : 'Favoritar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.primary + '22', borderColor: colors.primary + '55' }]}
          onPress={onEdit}>
          <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '700' }}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.danger + '22', borderColor: colors.danger + '55' }]}
          onPress={onDelete}>
          <Text style={{ color: colors.danger, fontSize: FontSize.xs, fontWeight: '700' }}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function SimulationsScreen() {
  const { colors }                        = useTheme();
  const { simulations, deleteSimulation } = useData();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const navigation                        = useNavigation<Nav>();

  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState<SimulationType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<SimulationStatus | 'ALL'>('ALL');
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editTarget,   setEditTarget]   = useState<Simulation | null>(null);
  const [confirm,      setConfirm]      = useState<{ open: boolean; sim: Simulation | null }>({ open: false, sim: null });

  const filtered = useMemo(() => {
    return simulations.filter((sim) => {
      const mt = typeFilter   === 'ALL' || sim.type   === typeFilter;
      const ms = statusFilter === 'ALL' || sim.status === statusFilter;
      const q  = search.toLowerCase();
      const mq = !q || sim.city.name.toLowerCase().includes(q) || sim.description.toLowerCase().includes(q) || SIM_TYPE_META[sim.type].label.toLowerCase().includes(q);
      return mt && ms && mq;
    });
  }, [search, typeFilter, statusFilter, simulations]);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (s: Simulation) => { setEditTarget(s); setModalOpen(true); };
  const close    = () => { setModalOpen(false); setEditTarget(null); };

  const askDelete = (sim: Simulation) => setConfirm({ open: true, sim });
  const doDelete  = async () => {
    if (confirm.sim) await deleteSimulation(confirm.sim.id);
    setConfirm({ open: false, sim: null });
  };

  const toggleFav = async (sim: Simulation) => {
    if (isFavorite(sim.id)) await removeFavorite(sim.id);
    else                    await addFavorite(sim);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm }}>
        <View>
          <Text style={{ color: colors.text, fontSize: FontSize.xl, fontWeight: '800' }}>Simulações</Text>
          <Text style={{ color: colors.textMuted, fontSize: FontSize.xs }}>{filtered.length} resultado(s)</Text>
        </View>
        <TouchableOpacity onPress={openAdd}
          style={{ backgroundColor: colors.primary, borderRadius: BorderRadius.md, paddingHorizontal: 14, paddingVertical: 8 }}>
          <Text style={{ color: '#060b18', fontSize: FontSize.sm, fontWeight: '800' }}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: colors.card, borderRadius: BorderRadius.md,
        borderWidth: 1, borderColor: colors.border,
        marginHorizontal: Spacing.md, marginBottom: Spacing.sm,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
      }}>
        <Text style={{ color: colors.textMuted, marginRight: 8 }}>🔍</Text>
        <TextInput style={{ flex: 1, color: colors.text, fontSize: FontSize.md }}
          placeholder="Buscar..." placeholderTextColor={colors.textMuted}
          value={search} onChangeText={setSearch} />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: colors.textMuted, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tipo filter */}
      <View style={{ marginBottom: 6 }}>
        <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, fontWeight: '700', paddingHorizontal: Spacing.md, marginBottom: 6, letterSpacing: 1 }}>TIPO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md }}>
          <FilterChip label="Todos"        active={typeFilter==='ALL'}          onPress={() => setTypeFilter('ALL')}          color={colors.primary} />
          <FilterChip label="🌊 Enchente"  active={typeFilter==='FLOOD'}        onPress={() => setTypeFilter('FLOOD')}        color="#3b82f6" />
          <FilterChip label="🚗 Tráfego"   active={typeFilter==='TRAFFIC'}      onPress={() => setTypeFilter('TRAFFIC')}      color="#f59e0b" />
          <FilterChip label="🏗️ Obra"      active={typeFilter==='CONSTRUCTION'} onPress={() => setTypeFilter('CONSTRUCTION')} color="#eab308" />
          <FilterChip label="🌡️ Ilha Calor" active={typeFilter==='HEAT_ISLAND'} onPress={() => setTypeFilter('HEAT_ISLAND')}  color="#ef4444" />
        </ScrollView>
      </View>

      {/* Status filter */}
      <View style={{ marginBottom: Spacing.sm }}>
        <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, fontWeight: '700', paddingHorizontal: Spacing.md, marginBottom: 6, letterSpacing: 1 }}>STATUS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: Spacing.md }}>
          <FilterChip label="Todos"       active={statusFilter==='ALL'}        onPress={() => setStatusFilter('ALL')}        color={colors.textSecondary} />
          <FilterChip label="Pendente"    active={statusFilter==='PENDING'}    onPress={() => setStatusFilter('PENDING')}    color="#f59e0b" />
          <FilterChip label="Processando" active={statusFilter==='PROCESSING'} onPress={() => setStatusFilter('PROCESSING')} color="#3b82f6" />
          <FilterChip label="Completo"    active={statusFilter==='COMPLETED'}  onPress={() => setStatusFilter('COMPLETED')}  color="#10b981" />
          <FilterChip label="Falhou"      active={statusFilter==='FAILED'}     onPress={() => setStatusFilter('FAILED')}     color="#ef4444" />
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <SimCard
            sim={item}
            onPress={() => navigation.navigate('SimDetail', { simulationId: item.id })}
            onEdit={() => openEdit(item)}
            onDelete={() => askDelete(item)}
            onFav={() => toggleFav(item)}
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <Text style={{ fontSize: 40, marginBottom: 12 }}>🔬</Text>
            <Text style={{ color: colors.textMuted, fontSize: FontSize.md }}>Nenhuma simulação encontrada</Text>
          </View>
        }
      />

      <SimModal visible={modalOpen} editSim={editTarget} onClose={close} />

      <ConfirmModal
        visible={confirm.open}
        title="Excluir simulação?"
        message={confirm.sim ? `${SIM_TYPE_META[confirm.sim.type].label} em ${confirm.sim.city.name}. Esta ação não pode ser desfeita.` : ''}
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, sim: null })}
      />
    </SafeAreaView>
  );
}

function makeCardStyles(c: ThemeColors) {
  return StyleSheet.create({
    card:        { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, padding: Spacing.md, overflow: 'hidden' },
    top:         { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
    typeIcon:    { width: 46, height: 46, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
    cardTitle:   { color: c.text, fontSize: FontSize.md, fontWeight: '700' },
    cardCity:    { color: c.textSecondary, fontSize: FontSize.sm, marginTop: 2 },
    desc:        { color: c.textMuted, fontSize: FontSize.sm, lineHeight: 18, marginBottom: Spacing.sm },
    statusBadge: { borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 3 },
    statusText:  { fontSize: FontSize.xs, fontWeight: '700' },
    badges:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.sm },
    badge:       { borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText:   { fontSize: FontSize.xs, fontWeight: '700' },
    date:        { color: c.textMuted, fontSize: FontSize.xs, alignSelf: 'center' },
    actions:     { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: c.border, paddingTop: Spacing.sm },
    actionBtn:   { flex: 1, borderRadius: BorderRadius.sm, paddingVertical: 7, alignItems: 'center', borderWidth: 1 },
  });
}

function makeModalStyles(c: ThemeColors) {
  return StyleSheet.create({
    overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    sheet:       { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, maxHeight: '92%' },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    sheetTitle:  { color: c.text, fontSize: FontSize.lg, fontWeight: '800' },
    label:       { color: c.textSecondary, fontSize: FontSize.xs, fontWeight: '700', marginBottom: 6 },
    input:       { backgroundColor: c.background, color: c.text, borderRadius: BorderRadius.md, borderWidth: 1, borderColor: c.border, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.md, marginBottom: Spacing.sm },
    pill:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, borderWidth: 1.5, borderColor: c.border, backgroundColor: c.background },
    pillText:    { color: c.textMuted, fontSize: FontSize.xs, fontWeight: '700' },
    saveBtn:     { backgroundColor: c.primary, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
    saveBtnText: { color: '#060b18', fontSize: FontSize.md, fontWeight: '800' },
  });
}

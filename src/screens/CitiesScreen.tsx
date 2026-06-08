import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, TextInput, Switch, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme }        from '../contexts/ThemeContext';
import { useData }         from '../contexts/DataContext';
import { ConfirmModal }    from '../components/ConfirmModal';
import { City }            from '../types/cityorbit';
import { Spacing, FontSize, BorderRadius, ThemeColors } from '../theme';

interface CityForm {
  name:         string;
  state:        string;
  country:      string;
  lidar:        boolean;
  satelliteRes: string; 
}

const EMPTY_FORM: CityForm = { name: '', state: '', country: 'Brasil', lidar: false, satelliteRes: '' };
const SAT_OPTIONS = ['0.5m', '1.0m', '1.5m'];

function cityToForm(c: City): CityForm {
  return { name: c.name, state: c.state, country: c.country, lidar: c.lidar, satelliteRes: c.satelliteRes ?? '' };
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: Spacing.sm }}>
      <Text style={{ color: colors.textSecondary, fontSize: FontSize.xs, fontWeight: '700', marginBottom: 6 }}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function CityModal({ visible, editCity, onClose }: {
  visible: boolean; editCity: City | null; onClose: () => void;
}) {
  const { colors }              = useTheme();
  const { addCity, updateCity } = useData();
  const [form, setForm]         = useState<CityForm>(EMPTY_FORM);
  const [err, setErr]           = useState('');
  const s = makeStyles(colors);

  React.useEffect(() => {
    setForm(editCity ? cityToForm(editCity) : EMPTY_FORM);
    setErr('');
  }, [editCity, visible]);

  const set = (field: keyof CityForm, value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSave = async () => {
    if (!form.name.trim())  { setErr('Nome é obrigatório.'); return; }
    if (!form.state.trim()) { setErr('Estado (UF) é obrigatório.'); return; }
    setErr('');
    const payload = {
      name:         form.name.trim(),
      state:        form.state.trim().toUpperCase().slice(0, 2),
      country:      form.country.trim() || 'Brasil',
      lidar:        form.lidar,
      satelliteRes: form.satelliteRes || undefined,
      lat:          0,
      lon:          0,
    };
    if (editCity) await updateCity({ ...editCity, ...payload });
    else          await addCity(payload);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.overlay}>
          <View style={s.sheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>{editCity ? 'Editar Cidade' : 'Nova Cidade'}</Text>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                <Text style={{ color: colors.textMuted, fontSize: 20 }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Field label="Nome da cidade *">
                <TextInput style={s.input} value={form.name}
                  onChangeText={(v) => set('name', v)}
                  placeholder="ex: Florianópolis" placeholderTextColor={colors.textMuted} />
              </Field>

              <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
                <View style={{ flex: 1 }}>
                  <Field label="UF *">
                    <TextInput style={s.input} value={form.state}
                      onChangeText={(v) => set('state', v)}
                      placeholder="SC" placeholderTextColor={colors.textMuted}
                      maxLength={2} autoCapitalize="characters" />
                  </Field>
                </View>
                <View style={{ flex: 2 }}>
                  <Field label="País">
                    <TextInput style={s.input} value={form.country}
                      onChangeText={(v) => set('country', v)}
                      placeholder="Brasil" placeholderTextColor={colors.textMuted} />
                  </Field>
                </View>
              </View>

              {/* Resolução Satélite — picker visual */}
              <Field label="Resolução do Satélite">
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['', ...SAT_OPTIONS].map((opt) => {
                    const active = form.satelliteRes === opt;
                    const label  = opt === '' ? 'Nenhuma' : opt;
                    return (
                      <TouchableOpacity key={label}
                        onPress={() => set('satelliteRes', opt)}
                        style={[s.satBtn, active && { backgroundColor: colors.primary + '22', borderColor: colors.primary }]}
                      >
                        <Text style={[s.satBtnText, active && { color: colors.primary }]}>{label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </Field>

              {/* LIDAR */}
              <View style={s.switchRow}>
                <View>
                  <Text style={{ color: colors.text, fontSize: FontSize.md, fontWeight: '600' }}>Escaneamento LIDAR</Text>
                  <Text style={{ color: colors.textMuted, fontSize: FontSize.xs, marginTop: 2 }}>Disponível para esta cidade</Text>
                </View>
                <Switch value={form.lidar} onValueChange={(v) => set('lidar', v)}
                  trackColor={{ false: colors.border, true: colors.primary + '88' }}
                  thumbColor={form.lidar ? colors.primary : colors.textMuted}
                />
              </View>

              {err ? <Text style={{ color: colors.danger, fontSize: FontSize.sm, marginBottom: Spacing.sm }}>{err}</Text> : null}

              <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                <Text style={s.saveBtnText}>{editCity ? 'Salvar alterações' : 'Cadastrar cidade'}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function CityCard({ city, onEdit, onDelete }: {
  city: City; onEdit: () => void; onDelete: () => void;
}) {
  const { colors } = useTheme();
  const s = makeStyles(colors);

  return (
    <View style={s.card}>
      <View style={s.cardTop}>
        <View style={[s.avatar, { backgroundColor: colors.primary + '22' }]}>
          <Text style={{ fontSize: 22 }}>🏙️</Text>
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text style={s.cityName}>{city.name}</Text>
          <Text style={s.citySub}>{city.state} · {city.country}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.primary + '22' }]} onPress={onEdit}>
            <Text style={{ color: colors.primary, fontSize: FontSize.xs, fontWeight: '700' }}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.actionBtn, { backgroundColor: colors.danger + '22' }]} onPress={onDelete}>
            <Text style={{ color: colors.danger, fontSize: FontSize.xs, fontWeight: '700' }}>Excluir</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.chips}>
        {city.lidar && (
          <View style={[s.chip, { backgroundColor: colors.primary + '1A', borderColor: colors.primary + '44' }]}>
            <Text style={[s.chipText, { color: colors.primary }]}>LIDAR</Text>
          </View>
        )}
        {city.satelliteRes && (
          <View style={[s.chip, { backgroundColor: colors.secondary + '1A', borderColor: colors.secondary + '44' }]}>
            <Text style={[s.chipText, { color: colors.secondary }]}>Sat. {city.satelliteRes}</Text>
          </View>
        )}
        <View style={[s.chip, { backgroundColor: colors.success + '1A', borderColor: colors.success + '44' }]}>
          <Text style={[s.chipText, { color: colors.success }]}>{city.simulationCount} simulação(ões)</Text>
        </View>
      </View>
    </View>
  );
}

export function CitiesScreen() {
  const { colors }                 = useTheme();
  const { cities, deleteCity }     = useData();
  const [modalOpen, setModalOpen]  = useState(false);
  const [editTarget, setEditTarget]= useState<City | null>(null);
  const [confirm, setConfirm]      = useState<{ open: boolean; city: City | null }>({ open: false, city: null });
  const s = makeStyles(colors);

  const openAdd  = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (c: City) => { setEditTarget(c); setModalOpen(true); };
  const close    = () => { setModalOpen(false); setEditTarget(null); };

  const askDelete = (city: City) => setConfirm({ open: true, city });
  const doDelete  = async () => {
    if (confirm.city) await deleteCity(confirm.city.id);
    setConfirm({ open: false, city: null });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Cidades</Text>
          <Text style={s.headerSub}>{cities.length} cadastrada(s)</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={openAdd}>
          <Text style={s.addBtnText}>+ Nova cidade</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: Spacing.md, paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
        renderItem={({ item }) => (
          <CityCard city={item} onEdit={() => openEdit(item)} onDelete={() => askDelete(item)} />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🏙️</Text>
            <Text style={{ color: colors.text, fontSize: FontSize.lg, fontWeight: '700', marginBottom: 6 }}>
              Nenhuma cidade
            </Text>
            <Text style={{ color: colors.textMuted, fontSize: FontSize.md }}>
              Toque em "+ Nova cidade" para começar.
            </Text>
          </View>
        }
      />

      <CityModal visible={modalOpen} editCity={editTarget} onClose={close} />

      <ConfirmModal
        visible={confirm.open}
        title={`Excluir "${confirm.city?.name}"?`}
        message="Todas as simulações desta cidade também serão removidas. Esta ação não pode ser desfeita."
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, city: null })}
      />
    </SafeAreaView>
  );
}

function makeStyles(c: ThemeColors) {
  return StyleSheet.create({
    header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
    headerTitle: { color: c.text, fontSize: FontSize.xl, fontWeight: '800' },
    headerSub:   { color: c.textMuted, fontSize: FontSize.xs, marginTop: 2 },
    addBtn:      { backgroundColor: c.primary, borderRadius: BorderRadius.md, paddingHorizontal: 14, paddingVertical: 8 },
    addBtnText:  { color: '#060b18', fontSize: FontSize.sm, fontWeight: '800' },
    card:        { backgroundColor: c.card, borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: c.border, padding: Spacing.md },
    cardTop:     { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
    avatar:      { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
    cityName:    { color: c.text, fontSize: FontSize.md, fontWeight: '700' },
    citySub:     { color: c.textSecondary, fontSize: FontSize.sm },
    actionBtn:   { borderRadius: BorderRadius.sm, paddingHorizontal: 10, paddingVertical: 6 },
    chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip:        { borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
    chipText:    { fontSize: FontSize.xs, fontWeight: '700' },
    // Modal
    overlay:     { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    sheet:       { backgroundColor: c.card, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.lg, maxHeight: '90%' },
    sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    sheetTitle:  { color: c.text, fontSize: FontSize.lg, fontWeight: '800' },
    input:       {
      backgroundColor: c.background, color: c.text,
      borderRadius: BorderRadius.md, borderWidth: 1, borderColor: c.border,
      paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: FontSize.md,
    },
    satBtn:      {
      flex: 1, borderRadius: BorderRadius.md, borderWidth: 1.5, borderColor: c.border,
      backgroundColor: c.background, paddingVertical: 10, alignItems: 'center',
    },
    satBtnText:  { color: c.textMuted, fontSize: FontSize.sm, fontWeight: '700' },
    switchRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    saveBtn:     { backgroundColor: c.primary, borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center', marginTop: Spacing.sm, marginBottom: Spacing.lg },
    saveBtnText: { color: '#060b18', fontSize: FontSize.md, fontWeight: '800' },
  });
}

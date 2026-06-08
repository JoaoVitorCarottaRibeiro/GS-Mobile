import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface Props {
  visible:   boolean;
  title:     string;
  message:   string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmModal({ visible, title, message, confirmLabel = 'Excluir', onConfirm, onCancel }: Props) {
  const { colors } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.box, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.msg,   { color: colors.textSecondary }]}>{message}</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.border }]}
              onPress={onCancel}
            >
              <Text style={[styles.btnText, { color: colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: colors.danger }]}
              onPress={() => { onConfirm(); onCancel(); }}
            >
              <Text style={[styles.btnText, { color: '#fff' }]}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)', justifyContent: 'center', alignItems: 'center', padding: 32 },
  box:     { borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.lg, width: '100%', maxWidth: 400 },
  title:   { fontSize: FontSize.lg, fontWeight: '800', marginBottom: 8 },
  msg:     { fontSize: FontSize.sm, lineHeight: 20, marginBottom: Spacing.lg },
  row:     { flexDirection: 'row', gap: 12 },
  btn:     { flex: 1, borderRadius: BorderRadius.md, padding: 12, alignItems: 'center' },
  btnText: { fontSize: FontSize.md, fontWeight: '700' },
});

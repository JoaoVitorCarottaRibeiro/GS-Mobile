import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { BorderRadius, FontSize, Spacing } from '../theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  value?: string;
}

export function SearchBar({ placeholder = 'Buscar...', onSearch, onClear, value }: SearchBarProps) {
  const { colors } = useTheme();
  const [query, setQuery] = useState(value ?? '');

  const handleChange = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={handleChange}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} hitSlop={8}>
          <Text style={[styles.clear, { color: colors.textMuted }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  icon: { fontSize: FontSize.md, marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.md, paddingVertical: 0 },
  clear: { fontSize: FontSize.sm, fontWeight: '600' },
});

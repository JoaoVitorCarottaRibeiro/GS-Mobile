export const Colors = {
  dark: {
    background: '#060b18',
    surface:    '#0d1525',
    card:       '#0f1b30',
    cardAlt:    '#111e35',
    border:     '#1e3050',
    primary:    '#00d4ff',   // cyan
    primaryDim: '#0097b8',
    secondary:  '#7c3aed',   // purple
    accent:     '#f59e0b',   // orange
    text:       '#f0f6ff',
    textSecondary: '#b8cce4',
    textMuted:  '#6b8db5',
    success:    '#10b981',
    warning:    '#f59e0b',
    danger:     '#ef4444',
    overlay:    'rgba(6,11,24,0.92)',
  },
  light: {
    background: '#f0f4fa',
    surface:    '#ffffff',
    card:       '#ffffff',
    cardAlt:    '#f5f8ff',
    border:     '#d1ddf0',
    primary:    '#0097b8',
    primaryDim: '#007a99',
    secondary:  '#6d28d9',
    accent:     '#d97706',
    text:       '#0a1020',
    textSecondary: '#3d5a7a',
    textMuted:  '#6b8db5',
    success:    '#059669',
    warning:    '#d97706',
    danger:     '#dc2626',
    overlay:    'rgba(240,244,250,0.92)',
  },
};

export const Spacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const FontSize = {
  xs: 10, sm: 12, md: 14, lg: 16, xl: 20, xxl: 24, xxxl: 30,
};

export const BorderRadius = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 9999,
};

export type ThemeColors = typeof Colors.dark;

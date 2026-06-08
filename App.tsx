import React, { Component, ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme }   from './src/contexts/ThemeContext';
import { FavoritesProvider }         from './src/contexts/FavoritesContext';
import { DataProvider }              from './src/contexts/DataContext';
import { RootNavigator }             from './src/navigation/RootNavigator';


interface EBState { error: Error | null; info: string }

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  state: EBState = { error: null, info: '' };

  static getDerivedStateFromError(error: Error): EBState {
    return { error, info: '' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info: info.componentStack ?? '' });
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: '#060b18', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ color: '#ef4444', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>
            ⚠️ Erro detectado
          </Text>
          <ScrollView style={{ maxHeight: 300 }}>
            <Text style={{ color: '#f87171', fontSize: 13 }}>{this.state.error.message}</Text>
            <Text style={{ color: '#6b8db5', fontSize: 11, marginTop: 8 }}>{this.state.info}</Text>
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}


function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}


export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <DataProvider>
            <FavoritesProvider>
              <AppContent />
            </FavoritesProvider>
          </DataProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

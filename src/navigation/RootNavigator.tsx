import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../contexts/ThemeContext';
import { TabParamList, RootStackParamList } from './types';

import { LandingScreen }     from '../screens/LandingScreen';
import { HomeScreen }        from '../screens/HomeScreen';
import { CitiesScreen }      from '../screens/CitiesScreen';
import { SimulationsScreen } from '../screens/SimulationsScreen';
import { FavoritesScreen }   from '../screens/FavoritesScreen';
import { SettingsScreen }    from '../screens/SettingsScreen';
import { SimDetailScreen }   from '../screens/SimDetailScreen';

const Tab   = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: focused ? 20 : 18, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>
    </View>
  );
}

function TabNavigator() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor:  colors.border,
          borderTopWidth:  1,
          height:          60,
          paddingBottom:   8,
          paddingTop:      4,
        },
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 9, fontWeight: '700' },
      }}
    >
      <Tab.Screen name="Home"        component={HomeScreen}
        options={{ tabBarLabel: 'Início',     tabBarIcon: ({ focused }) => <TabIcon emoji="🌍" focused={focused} /> }} />
      <Tab.Screen name="Cities"      component={CitiesScreen}
        options={{ tabBarLabel: 'Cidades',    tabBarIcon: ({ focused }) => <TabIcon emoji="🏙️" focused={focused} /> }} />
      <Tab.Screen name="Simulations" component={SimulationsScreen}
        options={{ tabBarLabel: 'Simulações', tabBarIcon: ({ focused }) => <TabIcon emoji="🔬" focused={focused} /> }} />
      <Tab.Screen name="Favorites"   component={FavoritesScreen}
        options={{ tabBarLabel: 'Favoritos',  tabBarIcon: ({ focused }) => <TabIcon emoji="⭐" focused={focused} /> }} />
      <Tab.Screen name="Settings"    component={SettingsScreen}
        options={{ tabBarLabel: 'Config',     tabBarIcon: ({ focused }) => <TabIcon emoji="⚙️" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { isDark, colors } = useTheme();

  const theme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary:      colors.primary,
      background:   colors.background,
      card:         colors.card,
      text:         colors.text,
      border:       colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown:  false,
          contentStyle: { backgroundColor: colors.background },
          animation:    'fade',
        }}
      >
        <Stack.Screen name="Landing"   component={LandingScreen} />
        <Stack.Screen name="Main"      component={TabNavigator} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="SimDetail" component={SimDetailScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

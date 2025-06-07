import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { darkTheme, lightTheme } from '../../theme/colors';

export default function TabsLayout() {
  const { isDarkMode, toggleDarkMode } = useApp();
  const { user, logout } = useAuth();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        headerShown: true,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.tabBar,
          paddingTop: 5,
          paddingBottom: 5,
        },
        headerStyle: {
          backgroundColor: theme.header,
        },
        headerTitleStyle: {
          color: theme.text,
          fontWeight: '600',
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
            <TouchableOpacity
              onPress={toggleDarkMode}
              style={{ marginRight: 16 }}
            >
              <MaterialCommunityIcons
                name={isDarkMode ? 'white-balance-sunny' : 'moon-waning-crescent'}
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
            {user && (
              <TouchableOpacity onPress={logout}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={theme.text}
                />
              </TouchableOpacity>
            )}
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="food" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoritos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: 'Ingredientes',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 
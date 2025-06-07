import { Stack, router, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AppProvider, useApp } from '../context/AppContext';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { darkTheme, lightTheme } from '../theme/colors';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const { isDarkMode } = useApp();
  const segments = useSegments();
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inProtectedRoute = segments[0] === 'favorites' || segments[0] === 'ingredients';

    if (!user && inProtectedRoute) {
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.header,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
          color: theme.text,
        },
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="recipe/[id]" 
        options={{ 
          title: 'Detalle de Receta',
          headerShown: true,
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppProvider>
        <RootLayoutNav />
      </AppProvider>
    </AuthProvider>
  );
}

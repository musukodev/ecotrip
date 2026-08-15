import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

function AuthGuard() {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === null) return; // Menunggu auth state siap

    const segment = segments[0];

    // Melewati splash (index) & onboarding
    if (segment === undefined || segment === '(onboarding)') return;

    const inAuth = segment === '(auth)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="stay/[id]" />
      <Stack.Screen name="trip/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return <AuthGuard />;
}
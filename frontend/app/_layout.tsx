import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '@/hooks/useAuth';

function AuthGuard() {
  const { isAuthenticated, userRole } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === null) return; // Menunggu auth state siap

    const segment = segments[0];

    // Melewati splash (index) & onboarding
    if (segment === undefined || segment === '(onboarding)') return;

    const inAuth = segment === '(auth)';
    const inBusiness = segment === '(business)';
    const inSuperadmin = segment === '(superadmin)';
    const inTabs = segment === '(tabs)';

    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated) {
      if (userRole === 'superadmin') {
        if (!inSuperadmin) {
          router.replace('/(superadmin)/dashboard');
        }
      } else if (userRole === 'business_destination' || userRole === 'business_accommodation') {
        if (!inBusiness) {
          router.replace('/(business)/dashboard');
        }
      } else {
        if (!inTabs && inAuth) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [isAuthenticated, userRole, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(business)" />
      <Stack.Screen name="(superadmin)" />
      <Stack.Screen name="stay/[id]" />
      <Stack.Screen name="trip/[id]" />
      <Stack.Screen name="mytrip/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}

import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { Colors } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.white,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Beranda',
          headerShown: false,
          tabBarLabel: 'Beranda',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: 'Trip Saya',
          tabBarLabel: 'Trips',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🌿</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}

import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SuperadminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0E4D3C',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E2E8F0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Daftar Tempat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="approvals"
        options={{
          title: 'ACC Pelaku Usaha',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-circle-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Akun Superadmin',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-checkmark-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

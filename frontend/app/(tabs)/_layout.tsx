import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

function CustomTabBarButton(props: any) {
  const { children, onPress, accessibilityState } = props;
  const isSelected = accessibilityState?.selected;

  if (isSelected) {
    return (
      <View style={styles.activeBtnWrapper}>
        <TouchableOpacity style={styles.activeBtn} onPress={onPress} activeOpacity={0.9}>
          {children}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.inactiveBtn} onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#4A5568',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarStyle: {
          height: 70,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          paddingHorizontal: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stay"
        options={{
          title: 'Stay',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bed' : 'bed-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-trip"
        options={{
          title: 'My Trip',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'navigate' : 'navigate-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeBtnWrapper: {
    top: -16,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  activeBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#033028',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#033028',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },
  inactiveBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
  },
});
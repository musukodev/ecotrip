import React from 'react';
import { View, StyleSheet, Pressable, Animated, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, radius } from '../../constants/theme';

// Komponen Tombol Custom: hover-up + press scale + pill indicator tegas
function AnimatedTabButton(props: any) {
  const { children, onPress, accessibilityState } = props;
  const isSelected = accessibilityState?.selected;

  const translateY = React.useRef(new Animated.Value(isSelected ? -6 : 0)).current;
  const pillScale = React.useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const pressScale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: isSelected ? -6 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 120,
      }),
      Animated.spring(pillScale, {
        toValue: isSelected ? 1 : 0,
        useNativeDriver: true,
        friction: 7,
        tension: 140,
      }),
    ]).start();
  }, [isSelected]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.88,
      useNativeDriver: true,
      friction: 5,
      tension: 200,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 200,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.buttonContainer}
      android_ripple={{ color: Colors.greenPale, borderless: true, radius: 28 }}
    >
      <Animated.View
        style={[
          styles.animatedContent,
          { transform: [{ translateY }, { scale: pressScale }] },
        ]}
      >
        {/* Pill background — nempel selama tab ini aktif, bukan cuma pas ditekan */}
        <Animated.View
          style={[
            styles.pillIndicator,
            {
              opacity: pillScale,
              transform: [{ scale: pillScale }],
            },
          ]}
        />
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 2,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 72,
          backgroundColor: Colors.card,
          borderTopWidth: 0,
          elevation: 12,
          shadowColor: Colors.primaryDark,
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'compass' : 'compass-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stay"
        options={{
          title: 'Stay',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bed' : 'bed-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-trip"
        options={{
          title: 'My Trip',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'navigate' : 'navigate-outline'} size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarButton: (props) => <AnimatedTabButton {...props} />,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animatedContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pillIndicator: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: radius.pill,
    backgroundColor: Colors.greenPale,
    top: -11,
    borderWidth: 1,
    borderColor: Colors.greenSoft,
  },
});
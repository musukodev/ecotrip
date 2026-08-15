import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, tension: 60, useNativeDriver: true }),
    ]).start();

    const t = setTimeout(() => setReady(true), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready || isAuthenticated === null) return;

    router.replace('/(onboarding)');
  }, [ready, isAuthenticated]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.logoEmoji}>🌍</Text>
      </Animated.View>
      <Animated.Text style={[styles.title, { opacity }]}>EcoTrip</Animated.Text>
      <Animated.Text style={[styles.subtitle, { opacity }]}>Perjalanan ramah lingkungan</Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  logoWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: { fontSize: 56 },
  title: { fontSize: 34, fontWeight: 'bold', color: Colors.white, letterSpacing: 1 },
  subtitle: { fontSize: 14, color: Colors.greenPale, marginTop: 8 },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

import { API_URL } from '@/constants/api';

const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
    <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </Svg>
);

export default function LoginScreen() {
  const router = useRouter();
  const { setIsAuthenticated, setUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Panggil authService untuk menyimpan token, lalu update AuthContext.
  // AuthGuard di Root Layout yang akan mengarahkan ke /(tabs) atau /(business).
  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      setUserRole(res.user?.role || 'tourist');
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Login error details:', err);
      const errorMessage =
        err.response?.data?.error ??
        (err.message === 'Network Error'
          ? `Gagal terhubung ke backend (${API_URL}). Pastikan server Go aktif.`
          : err.message) ??
        'Terjadi kesalahan';
      Alert.alert('Login gagal', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Decorative Top Accent */}
        <View style={styles.topDecoration} />

        {/* Header Title */}
        <View style={styles.headerContainer}>
          <View style={styles.badgeContainer}>
            <Ionicons name="leaf" size={12} color="#0E4D3C" style={{ marginRight: 4 }} />
            <Text style={styles.brandTitle}>ECOTOUR AI</Text>
          </View>
          <Text style={styles.heading}>Selamat datang kembali</Text>
          <Text style={styles.subHeading}>Jelajahi keindahan alam dengan panduan AI pintar</Text>
        </View>

        {/* Card Wrapper */}
        <View style={styles.cardWrapper}>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
              <Text style={styles.tabTextActive}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.tabTextInactive}>Daftar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              placeholderTextColor="#94A3B8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => Alert.alert('Lupa Password', 'Fitur reset password')}>
              <Text style={styles.forgotPasswordText}>Lupa kata sandi?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Memproses...' : 'Masuk'}</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <GoogleIcon />
            <Text style={styles.googleButtonText}>Lanjutkan dengan Google</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Section */}
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.footerLink}>Daftar Akun Baru</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featureGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#0E4D3C" />
              <Text style={styles.featureText}>Eco Verified</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="sparkles-outline" size={16} color="#0E4D3C" />
              <Text style={styles.featureText}>AI Recommendation</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="planet-outline" size={16} color="#0E4D3C" />
              <Text style={styles.featureText}>Zero Carbon</Text>
            </View>
          </View>

          <Text style={styles.legalText}>© 2026 Ecotour AI. Hak cipta dilindungi.</Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 30 },
  topDecoration: {
    height: 6,
    backgroundColor: '#0E4D3C',
    borderRadius: 3,
    marginBottom: 20,
    width: 50,
  },
  headerContainer: { marginBottom: 20 },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 10,
  },
  brandTitle: { fontSize: 11, fontWeight: '800', color: '#0E4D3C', letterSpacing: 1.5 },
  heading: { fontSize: 26, fontWeight: '800', color: '#0F172A' },
  subHeading: { fontSize: 13, color: '#64748B', marginTop: 4 },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    marginBottom: 24,
  },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabTextActive: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  tabTextInactive: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '700', color: '#0E4D3C', marginBottom: 6 },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  forgotPasswordContainer: { alignSelf: 'flex-end', marginTop: 6 },
  forgotPasswordText: { fontSize: 12, fontWeight: '600', color: '#0E4D3C' },
  button: { backgroundColor: '#0E4D3C', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 10, fontSize: 12, color: '#94A3B8' },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  footerContainer: { alignItems: 'center' },
  footerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  footerText: { fontSize: 13, color: '#64748B' },
  footerLink: { fontSize: 13, fontWeight: '700', color: '#0E4D3C', textDecorationLine: 'underline' },
  featureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  featureItem: { flexDirection: 'row', alignItems: 'center' },
  featureText: { fontSize: 11, fontWeight: '600', color: '#0E4D3C', marginLeft: 4 },
  legalText: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },
});
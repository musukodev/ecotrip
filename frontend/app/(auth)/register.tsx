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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { authService, UserRole } from '@/services/authService';
import { API_URL } from '@/constants/api';

export default function RegisterScreen() {
  const router = useRouter();
  const { setIsAuthenticated, setUserRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>('tourist');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Perhatian', 'Semua kolom wajib diisi.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Perhatian', 'Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.register({ name, email, password, role: selectedRole });

      // Jika role adalah pelaku usaha, statusnya pending ACC
      if (selectedRole === 'business_destination' || selectedRole === 'business_accommodation') {
        Alert.alert(
          'Pendaftaran Berhasil!',
          'Akun bisnis Anda telah didaftarkan dan saat ini sedang menunggu persetujuan (ACC) dari Superadmin sebelum dapat digunakan.',
          [
            {
              text: 'Mengerti',
              onPress: () => router.replace('/(auth)/login'),
            },
          ]
        );
        return;
      }

      // Jika turis biasa, langsung login
      setUserRole(res.user?.role || selectedRole);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Register error details:', err);
      const errorMessage =
        err.response?.data?.error ??
        (err.message === 'Network Error'
          ? `Gagal terhubung ke backend (${API_URL}). Pastikan server Go aktif.`
          : err.message) ??
        'Terjadi kesalahan';
      Alert.alert('Registrasi gagal', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.headerContainer}>
          <View style={styles.badgeContainer}>
            <Text style={styles.brandTitle}>ECOTOUR AI</Text>
          </View>
          <Text style={styles.heading}>Buat Akun Baru</Text>
          <Text style={styles.subHeading}>Pilih peran akun Anda untuk bergabung di ekowisata Batam</Text>
        </View>

        {/* Main Card Wrapper */}
        <View style={styles.cardWrapper}>
          {/* Tab Switcher: Masuk vs Daftar */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={styles.tabButton}
              onPress={() => router.push('/(auth)/login')}
            >
              <Text style={styles.tabTextInactive}>Masuk</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabButton, styles.tabActive]}>
              <Text style={styles.tabTextActive}>Daftar</Text>
            </TouchableOpacity>
          </View>

          {/* Role Selection Switcher (3 Role Pilihan) */}
          <Text style={styles.label}>Pilih Peran Akun</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleCard, selectedRole === 'tourist' && styles.roleCardActive]}
              onPress={() => setSelectedRole('tourist')}
            >
              <Ionicons
                name="leaf-outline"
                size={18}
                color={selectedRole === 'tourist' ? '#0E4D3C' : '#64748B'}
              />
              <Text style={[styles.roleTitle, selectedRole === 'tourist' && styles.roleTitleActive]}>
                Wisatawan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, selectedRole === 'business_destination' && styles.roleCardActive]}
              onPress={() => setSelectedRole('business_destination')}
            >
              <Ionicons
                name="compass-outline"
                size={18}
                color={selectedRole === 'business_destination' ? '#0E4D3C' : '#64748B'}
              />
              <Text style={[styles.roleTitle, selectedRole === 'business_destination' && styles.roleTitleActive]}>
                Admin Destinasi
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, selectedRole === 'business_accommodation' && styles.roleCardActive]}
              onPress={() => setSelectedRole('business_accommodation')}
            >
              <Ionicons
                name="business-outline"
                size={18}
                color={selectedRole === 'business_accommodation' ? '#0E4D3C' : '#64748B'}
              />
              <Text style={[styles.roleTitle, selectedRole === 'business_accommodation' && styles.roleTitleActive]}>
                Admin Penginapan
              </Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {selectedRole === 'business_destination'
                ? 'Nama Pengelola / Destinasi'
                : selectedRole === 'business_accommodation'
                ? 'Nama Pengelola / Penginapan'
                : 'Nama Lengkap'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                selectedRole === 'business_destination'
                  ? 'Contoh: Pengelola Mangrove Rempang'
                  : selectedRole === 'business_accommodation'
                  ? 'Contoh: Manajemen Eco Bay Resort'
                  : 'Nama Lengkap Anda'
              }
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
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

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="Minimal 6 karakter"
              placeholderTextColor="#94A3B8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="Ulangi kata sandi"
              placeholderTextColor="#94A3B8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Register Button */}
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading
                ? 'Mendaftarkan...'
                : selectedRole === 'business_destination'
                ? 'Daftar sebagai Admin Destinasi'
                : selectedRole === 'business_accommodation'
                ? 'Daftar sebagai Admin Penginapan'
                : 'Daftar sebagai Wisatawan'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.legalText}>© 2026 EcoTour AI. Platform Ekowisata Batam.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 40, paddingBottom: 40 },
  headerContainer: { marginBottom: 16 },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  brandTitle: { fontSize: 11, fontWeight: '800', color: '#0E4D3C', letterSpacing: 1.5 },
  heading: { fontSize: 24, fontWeight: '800', color: '#0F172A' },
  subHeading: { fontSize: 13, color: '#64748B', marginTop: 4 },
  cardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    marginBottom: 20,
  },
  tabContainer: { flexDirection: 'row', backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 18 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabTextActive: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  tabTextInactive: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  roleContainer: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  roleCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  roleCardActive: {
    backgroundColor: '#E2EFE9',
    borderColor: '#0E4D3C',
  },
  roleTitle: { fontSize: 11, fontWeight: '700', color: '#475569', textAlign: 'center' },
  roleTitleActive: { color: '#0E4D3C' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '700', color: '#0E4D3C', marginBottom: 6 },
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
  button: { backgroundColor: '#0E4D3C', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  footerContainer: { alignItems: 'center', marginTop: 10 },
  legalText: { fontSize: 11, color: '#94A3B8', textAlign: 'center' },
});

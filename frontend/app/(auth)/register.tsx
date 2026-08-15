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
import { authService } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/theme';

// Google Icon SVG (4 Colors)
const GoogleIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" style={{ marginRight: 10 }}>
    <Path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <Path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <Path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <Path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </Svg>
);

export default function RegisterScreen() {
  const router = useRouter();
  const { setIsAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await authService.register({ name, email, password });
      setIsAuthenticated(true);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Registrasi gagal', err.response?.data?.error ?? 'Terjadi kesalahan');
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
          <Text style={styles.subHeading}>Bergabung untuk menjelajahi petualangan baru</Text>
        </View>

        {/* Main Card Wrapper */}
        <View style={styles.cardWrapper}>

          {/* Tab Switcher */}
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

          {/* Form Inputs */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama kamu"
              placeholderTextColor={Colors.placeholder}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="nama@email.com"
              placeholderTextColor={Colors.placeholder}
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
              placeholder="Minimal 8 karakter"
              placeholderTextColor={Colors.placeholder}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Kata Sandi</Text>
            <TextInput
              style={styles.input}
              placeholder="Ulangi kata sandi"
              placeholderTextColor={Colors.placeholder}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Mendaftar...' : 'Daftar sebagai Turis'}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Button */}
          <TouchableOpacity 
            style={styles.googleButton}
            onPress={() => Alert.alert('Google Register', 'Fitur Google Register belum dihubungkan')}
          >
            <GoogleIcon />
            <Text style={styles.googleButtonText}>Daftar dengan Google</Text>
          </TouchableOpacity>

        </View>

        {/* Footer Area */}
        <View style={styles.footerContainer}>
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.footerLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legalText}>
            Dengan mendaftar, kamu menyetujui{' '}
            <Text style={styles.legalLink}>Syarat & Ketentuan</Text> serta{' '}
            <Text style={styles.legalLink}>Kebijakan Privasi</Text> kami.
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 20,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  brandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.5,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    color: Colors.textPrimary,
  },
  subHeading: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  cardWrapper: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.card,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: Colors.disabled ? 0.6 : 1,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 12,
    color: Colors.textMuted,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  footerContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
  legalLink: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService, UserProfile, UserPreferences } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

const Colors = {
  primary: '#0D2B22',
  background: '#F4F7F4',
  card: '#FFFFFF',
  cardGreen: '#EEF5F1',
  textPrimary: '#0D2B22',
  textSecondary: '#5A6E65',
  border: '#D8E3DD',
  danger: '#E63946',
  white: '#FFFFFF',
};

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const [prof, prefs] = await Promise.all([
        authService.getProfile(),
        authService.getPreferences().catch(() => null),
      ]);
      setProfile(prof);
      setPreferences(prefs);
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah kamu yakin ingin keluar dari akun?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleChangeLanguage = async (lang: 'id' | 'en' | 'zh') => {
    try {
      const updated = await authService.updatePreferences({
        language: lang,
        interests: preferences?.interests || ['nature', 'culinary'],
      });
      setPreferences(updated);
      Alert.alert('Sukses', 'Bahasa berhasil diperbarui.');
    } catch (e) {
      Alert.alert('Gagal', 'Gagal memperbarui preferensi bahasa.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <Text style={styles.profileName}>{profile?.name || 'Wisatawan'}</Text>
          <Text style={styles.profileEmail}>{profile?.email || 'email@domain.com'}</Text>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionHeading}>PREFERENSI BAHASA</Text>
        <View style={styles.card}>
          <View style={styles.langRow}>
            {[
              { code: 'id', label: '🇮🇩 Indonesia' },
              { code: 'en', label: '🇬🇧 English' },
              { code: 'zh', label: '🇨🇳 中文' },
            ].map((item) => {
              const active = preferences?.language === item.code;
              return (
                <TouchableOpacity
                  key={item.code}
                  style={[styles.langBtn, active && styles.langBtnActive]}
                  onPress={() => handleChangeLanguage(item.code as any)}
                >
                  <Text style={[styles.langText, active && styles.langTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Menu List */}
        <Text style={styles.sectionHeading}>AKUN & KEAMANAN</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => Alert.alert('Ubah Email', 'Hubungi admin atau update melalui menu pengaturan akun.')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="mail-outline" size={18} color={Colors.primary} />
              <Text style={styles.menuLabel}>Ubah Alamat Email</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => Alert.alert('Ubah Kata Sandi', 'Silakan gunakan menu ganti kata sandi.')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="key-outline" size={18} color={Colors.primary} />
              <Text style={styles.menuLabel}>Ubah Kata Sandi</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color={Colors.danger} style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  profileCard: { backgroundColor: Colors.card, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.cardGreen, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  profileName: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  profileEmail: { fontSize: 13, color: Colors.textSecondary },
  sectionHeading: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' },
  card: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 20 },
  langRow: { flexDirection: 'row', gap: 8 },
  langBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.background, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  langBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  langText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  langTextActive: { color: Colors.white },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  logoutBtn: { backgroundColor: '#FEE2E2', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  logoutText: { color: Colors.danger, fontSize: 14, fontWeight: '700' },
});

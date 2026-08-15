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
import { authService, UserProfile } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export default function BusinessProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const prof = await authService.getProfile();
      setProfile(prof);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('Keluar', 'Apakah kamu yakin ingin keluar dari portal admin usaha?', [
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

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0E4D3C" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="business" size={32} color="#0E4D3C" />
          </View>
          <Text style={styles.profileName}>{profile?.name || 'Mitra Usaha'}</Text>
          <Text style={styles.profileEmail}>{profile?.email || 'email@domain.com'}</Text>
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>
              {profile?.role === 'business_destination'
                ? 'ADMIN DESTINASI & KULINER'
                : 'ADMIN PENGINAPAN & HOTEL'}
            </Text>
          </View>
        </View>

        {/* Security / Account Section */}
        <Text style={styles.sectionHeading}>AKUN & KEAMANAN</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => Alert.alert('Ubah Kata Sandi', 'Silakan gunakan menu ganti kata sandi.')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="key-outline" size={18} color="#0E4D3C" />
              <Text style={styles.menuLabel}>Ubah Kata Sandi</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => Alert.alert('Bantuan', 'Hubungi support EcoTour AI di support@ecotour.ai')}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={18} color="#0E4D3C" />
              <Text style={styles.menuLabel}>Pusat Bantuan & Kebijakan Ekowisata</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#E63946" style={{ marginRight: 6 }} />
          <Text style={styles.logoutText}>Keluar dari Akun</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 60 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#E2EFE9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  profileEmail: { fontSize: 13, color: '#64748B', marginBottom: 10 },
  roleTag: { backgroundColor: '#E2EFE9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  roleTagText: { fontSize: 10, fontWeight: '800', color: '#0E4D3C', letterSpacing: 0.8 },
  sectionHeading: { fontSize: 11, fontWeight: '700', color: '#64748B', letterSpacing: 0.8, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  logoutBtn: { backgroundColor: '#FEE2E2', borderRadius: 14, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  logoutText: { color: '#E63946', fontSize: 14, fontWeight: '700' },
});

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { authService, UserProfile } from '@/services/authService';

export default function SuperadminProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    authService.getProfile().then((p) => setProfile(p)).catch(() => null);
  }, []);

  const handleLogout = () => {
    Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun Superadmin?', [
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Akun Superadmin</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="shield-checkmark" size={36} color="#0E4D3C" />
          </View>
          <Text style={styles.name}>{profile?.name || 'Super Admin Batam'}</Text>
          <Text style={styles.email}>{profile?.email || 'superadmin@superadmin.com'}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>SUPERADMINISTRATOR</Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>Hak Akses Superadmin</Text>
          <Text style={styles.infoBoxDesc}>
            Akun ini memiliki otoritas penuh untuk memantau semua direktori tempat wisata, kuliner, dan penginapan Batam, serta memberikan persetujuan (ACC) pendaftaran admin pelaku usaha baru.
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Keluar dari Portal Superadmin</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  content: { padding: 18 },
  profileCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  avatarContainer: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  email: { fontSize: 13, color: '#64748B', marginTop: 2 },
  roleBadge: { backgroundColor: '#0E4D3C', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginTop: 10 },
  roleText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  infoBox: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 24 },
  infoBoxTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  infoBoxDesc: { fontSize: 12, color: '#475569', lineHeight: 18 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#FEE2E2', paddingVertical: 14, borderRadius: 14 },
  logoutBtnText: { color: '#DC2626', fontSize: 14, fontWeight: '700' },
});

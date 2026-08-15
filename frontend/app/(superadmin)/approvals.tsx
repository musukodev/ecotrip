import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { superadminService } from '@/services/superadminService';
import { UserProfile } from '@/services/authService';

export default function SuperadminApprovalsScreen() {
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadPendingUsers = async () => {
    try {
      const users = await superadminService.getPendingBusinessUsers();
      setPendingUsers(users);
    } catch (e) {
      console.error('Failed to load pending users', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPendingUsers();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadPendingUsers();
  };

  const handleApprove = (user: UserProfile) => {
    Alert.alert(
      'Konfirmasi Persetujuan (ACC)',
      `Apakah Anda yakin ingin menyetujui akun pelaku usaha: "${user.name}" (${user.email})?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Setujui (ACC)',
          onPress: async () => {
            setProcessingId(user.id);
            try {
              await superadminService.approveBusinessUser(user.id);
              Alert.alert('Sukses', `Akun ${user.name} berhasil di-ACC dan sekarang dapat login.`);
              loadPendingUsers();
            } catch (err: any) {
              Alert.alert('Gagal', err.response?.data?.error || 'Gagal menyetujui akun.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  const handleReject = (user: UserProfile) => {
    Alert.alert(
      'Konfirmasi Penolakan',
      `Apakah Anda yakin ingin menolak pendaftaran akun pelaku usaha: "${user.name}" (${user.email})?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Tolak',
          style: 'destructive',
          onPress: async () => {
            setProcessingId(user.id);
            try {
              await superadminService.rejectBusinessUser(user.id);
              Alert.alert('Sukses', `Pendaftaran akun ${user.name} telah ditolak.`);
              loadPendingUsers();
            } catch (err: any) {
              Alert.alert('Gagal', err.response?.data?.error || 'Gagal menolak akun.');
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E4D3C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRole}>
          <Ionicons name="time" size={12} color="#D97706" />
          <Text style={styles.badgeRoleText}>VERIFIKASI AKUN</Text>
        </View>
        <Text style={styles.headerTitle}>Persetujuan Pelaku Usaha</Text>
        <Text style={styles.headerSub}>
          Tinjau & setujui pendaftaran akun admin destinasi dan penginapan baru
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E4D3C']} />}
      >
        <View style={styles.countBanner}>
          <Text style={styles.countBannerText}>
            Menampilkan <Text style={{ fontWeight: '800' }}>{pendingUsers.length}</Text> akun yang menunggu ACC
          </Text>
        </View>

        {pendingUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={56} color="#15803D" />
            <Text style={styles.emptyTitle}>Semua Beres!</Text>
            <Text style={styles.emptyDesc}>
              Tidak ada akun admin pelaku usaha yang sedang menunggu persetujuan.
            </Text>
          </View>
        ) : (
          pendingUsers.map((user) => {
            const isDestination = user.role === 'business_destination';
            const isProcessing = processingId === user.id;

            return (
              <View key={user.id} style={styles.userCard}>
                <View style={styles.userCardHeader}>
                  <View style={{ flex: 1 }}>
                    <View
                      style={[
                        styles.roleBadge,
                        { backgroundColor: isDestination ? '#DCFCE7' : '#E0F2FE' },
                      ]}
                    >
                      <Ionicons
                        name={isDestination ? 'compass-outline' : 'bed-outline'}
                        size={12}
                        color={isDestination ? '#15803D' : '#0284C7'}
                      />
                      <Text
                        style={[
                          styles.roleBadgeText,
                          { color: isDestination ? '#15803D' : '#0284C7' },
                        ]}
                      >
                        {isDestination ? 'Admin Destinasi & Kuliner' : 'Admin Akomodasi / Stay'}
                      </Text>
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>✉️ {user.email}</Text>
                    <Text style={styles.userDate}>
                      📅 Terdaftar: {new Date(user.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                </View>

                {/* Tombol Aksi ACC & Tolak */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={[styles.rejectBtn, isProcessing && { opacity: 0.5 }]}
                    onPress={() => handleReject(user)}
                    disabled={isProcessing}
                  >
                    <Ionicons name="close-circle-outline" size={16} color="#DC2626" />
                    <Text style={styles.rejectBtnText}>Tolak</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.approveBtn, isProcessing && { opacity: 0.5 }]}
                    onPress={() => handleApprove(user)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="checkmark-circle-outline" size={16} color="#FFFFFF" />
                        <Text style={styles.approveBtnText}>Setujui (ACC)</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  badgeRole: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', gap: 4, marginBottom: 4 },
  badgeRoleText: { fontSize: 10, fontWeight: '800', color: '#D97706', letterSpacing: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  countBanner: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginBottom: 14 },
  countBannerText: { fontSize: 12, color: '#475569' },
  emptyState: { backgroundColor: '#FFFFFF', padding: 40, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 20 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 12 },
  emptyDesc: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 4, lineHeight: 18 },
  userCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  userCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  roleBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', gap: 4, marginBottom: 6 },
  roleBadgeText: { fontSize: 10, fontWeight: '800' },
  userName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  userEmail: { fontSize: 13, color: '#475569', marginTop: 2 },
  userDate: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 12 },
  rejectBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#FEE2E2', paddingVertical: 10, borderRadius: 10 },
  rejectBtnText: { fontSize: 13, fontWeight: '700', color: '#DC2626' },
  approveBtn: { flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, backgroundColor: '#0E4D3C', paddingVertical: 10, borderRadius: 10 },
  approveBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
});

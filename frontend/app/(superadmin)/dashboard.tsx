import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { superadminService, SuperadminStats } from '@/services/superadminService';
import { Destination } from '@/services/destinationService';
import { Accommodation } from '@/services/accommodationService';

export default function SuperadminDashboardScreen() {
  const [stats, setStats] = useState<SuperadminStats | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Tab Filter & Search
  const [activeTab, setActiveTab] = useState<'all' | 'destinations' | 'accommodations'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detail Modal State
  const [selectedItem, setSelectedItem] = useState<{
    type: 'destination' | 'accommodation';
    data: any;
  } | null>(null);

  const loadData = async () => {
    try {
      const [statsRes, destsRes, accsRes] = await Promise.all([
        superadminService.getStats(),
        superadminService.getAllDestinations(),
        superadminService.getAllAccommodations(),
      ]);
      setStats(statsRes);
      setDestinations(destsRes);
      setAccommodations(accsRes);
    } catch (e) {
      console.error('Failed to load superadmin dashboard data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filter Items
  const filteredDestinations = destinations.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAccommodations = accommodations.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0E4D3C" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View>
          <View style={styles.badgeRole}>
            <Ionicons name="shield-checkmark" size={12} color="#0E4D3C" />
            <Text style={styles.badgeRoleText}>SUPERADMIN PORTAL</Text>
          </View>
          <Text style={styles.headerTitle}>Direktori & Tempat Batam</Text>
          <Text style={styles.headerSub}>Pantau seluruh destinasi dan akomodasi terdaftar</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E4D3C']} />}
      >
        {/* Statistics Cards */}
        {stats && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderLeftColor: '#0E4D3C' }]}>
              <Text style={styles.statNum}>{stats.total_destinations}</Text>
              <Text style={styles.statLabel}>Destinasi & Kuliner</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#0284C7' }]}>
              <Text style={styles.statNum}>{stats.total_accommodations}</Text>
              <Text style={styles.statLabel}>Akomodasi / Stay</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: '#EAB308' }]}>
              <Text style={styles.statNum}>{stats.total_pending_business_users}</Text>
              <Text style={styles.statLabel}>Admin Pending</Text>
            </View>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama tempat, kategori, atau lokasi..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Segmented Tabs */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'all' && styles.tabBtnActive]}
            onPress={() => setActiveTab('all')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'all' && styles.tabBtnTextActive]}>
              Semua ({destinations.length + accommodations.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'destinations' && styles.tabBtnActive]}
            onPress={() => setActiveTab('destinations')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'destinations' && styles.tabBtnTextActive]}>
              Destinasi ({destinations.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'accommodations' && styles.tabBtnActive]}
            onPress={() => setActiveTab('accommodations')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'accommodations' && styles.tabBtnTextActive]}>
              Akomodasi ({accommodations.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section: Destinasi & Kuliner */}
        {(activeTab === 'all' || activeTab === 'destinations') && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="compass" size={18} color="#0E4D3C" />
              <Text style={styles.sectionTitle}>
                Destinasi Wisata & Kuliner ({filteredDestinations.length})
              </Text>
            </View>

            {filteredDestinations.map((d) => (
              <TouchableOpacity
                key={`dest-${d.id}`}
                style={styles.itemCard}
                onPress={() => setSelectedItem({ type: 'destination', data: d })}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: d.photos?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=400' }}
                  style={styles.itemThumb}
                />
                <View style={styles.itemInfo}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.itemCategory}>{d.category.toUpperCase()}</Text>
                    <View style={styles.scoreBadge}>
                      <Ionicons name="leaf" size={10} color="#15803D" />
                      <Text style={styles.scoreBadgeText}>Eco {d.eco_score}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemName} numberOfLines={1}>{d.name}</Text>
                  <Text style={styles.itemLocation} numberOfLines={1}>📍 {d.location}</Text>
                  <View style={styles.rowMeta}>
                    <Text style={styles.itemMeta}>🎟️ Rp {d.ticket_price.toLocaleString('id-ID')}</Text>
                    <Text style={styles.itemMeta}>⏰ {d.opening_hours || '08:00 - 17:00'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Section: Akomodasi / Penginapan */}
        {(activeTab === 'all' || activeTab === 'accommodations') && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Ionicons name="bed" size={18} color="#0284C7" />
              <Text style={styles.sectionTitle}>
                Akomodasi & Hotel Ramah Lingkungan ({filteredAccommodations.length})
              </Text>
            </View>

            {filteredAccommodations.map((a) => (
              <TouchableOpacity
                key={`acc-${a.id}`}
                style={styles.itemCard}
                onPress={() => setSelectedItem({ type: 'accommodation', data: a })}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: a.photos?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400' }}
                  style={styles.itemThumb}
                />
                <View style={styles.itemInfo}>
                  <View style={styles.rowBetween}>
                    <Text style={[styles.itemCategory, { color: '#0284C7' }]}>{a.category.toUpperCase()}</Text>
                    <View style={styles.scoreBadge}>
                      <Ionicons name="leaf" size={10} color="#15803D" />
                      <Text style={styles.scoreBadgeText}>Eco {a.eco_score}</Text>
                    </View>
                  </View>
                  <Text style={styles.itemName} numberOfLines={1}>{a.name}</Text>
                  <Text style={styles.itemLocation} numberOfLines={1}>📍 {a.location}</Text>
                  <View style={styles.rowMeta}>
                    <Text style={styles.itemMeta}>🏨 Rp {(a.price_per_night / 1000).toLocaleString('id-ID')}k / malam</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal Detail Tempat Lengkap */}
      <Modal visible={!!selectedItem} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalType}>
                  {selectedItem?.type === 'destination' ? 'DESTINASI & KULINER' : 'AKOMODASI & PENGINAPAN'}
                </Text>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedItem?.data?.name}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedItem(null)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color="#0E4D3C" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView style={{ padding: 18 }} showsVerticalScrollIndicator={false}>
                <Image
                  source={{
                    uri:
                      selectedItem.data.photos?.[0] ||
                      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800',
                  }}
                  style={styles.modalBanner}
                />

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Kategori:</Text>
                  <Text style={styles.detailVal}>{selectedItem.data.category?.toUpperCase()}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Eco Score:</Text>
                  <Text style={[styles.detailVal, { color: '#15803D', fontWeight: '800' }]}>
                    {selectedItem.data.eco_score}/100
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Lokasi:</Text>
                  <Text style={styles.detailVal}>{selectedItem.data.location}</Text>
                </View>

                {selectedItem.type === 'destination' ? (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Harga Tiket:</Text>
                      <Text style={styles.detailVal}>
                        Rp {selectedItem.data.ticket_price?.toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Jam Operasional:</Text>
                      <Text style={styles.detailVal}>{selectedItem.data.opening_hours || '-'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Kontribusi Konservasi:</Text>
                      <Text style={styles.detailVal}>
                        {selectedItem.data.conservation_contribution_pct}%
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Tarif per Malam:</Text>
                      <Text style={styles.detailVal}>
                        Rp {selectedItem.data.price_per_night?.toLocaleString('id-ID')}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Dampak Lingkungan:</Text>
                      <Text style={styles.detailVal}>{selectedItem.data.environmental_impact || '-'}</Text>
                    </View>
                  </>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nomor Kontak:</Text>
                  <Text style={styles.detailVal}>{selectedItem.data.phone || '-'}</Text>
                </View>

                <Text style={styles.sectionSubHeading}>Deskripsi</Text>
                <Text style={styles.descText}>{selectedItem.data.description || 'Tidak ada deskripsi.'}</Text>

                <Text style={styles.sectionSubHeading}>Fasilitas</Text>
                <View style={styles.facilityRow}>
                  {selectedItem.data.facilities?.map((f: string, idx: number) => (
                    <View key={idx} style={styles.facilityPill}>
                      <Text style={styles.facilityText}>{f}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ height: 40 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  badgeRole: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start', gap: 4, marginBottom: 4 },
  badgeRoleText: { fontSize: 10, fontWeight: '800', color: '#0E4D3C', letterSpacing: 0.5 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#0F172A' },
  headerSub: { fontSize: 12, color: '#64748B', marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4 },
  statNum: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  statLabel: { fontSize: 10, fontWeight: '600', color: '#64748B', marginTop: 2 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: '#E2E8F0', gap: 8, marginBottom: 14 },
  searchInput: { flex: 1, fontSize: 13, color: '#0F172A' },
  tabSwitcher: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4, marginBottom: 16 },
  tabBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#FFFFFF' },
  tabBtnText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  tabBtnTextActive: { color: '#0E4D3C', fontWeight: '800' },
  sectionContainer: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  itemCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', gap: 12 },
  itemThumb: { width: 80, height: 80, borderRadius: 10, backgroundColor: '#E2E8F0' },
  itemInfo: { flex: 1, justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  itemCategory: { fontSize: 10, fontWeight: '800', color: '#0E4D3C', letterSpacing: 0.5 },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#DCFCE7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 3 },
  scoreBadgeText: { fontSize: 10, fontWeight: '700', color: '#15803D' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  itemLocation: { fontSize: 11, color: '#64748B', marginTop: 2 },
  rowMeta: { flexDirection: 'row', gap: 12, marginTop: 4 },
  itemMeta: { fontSize: 11, fontWeight: '600', color: '#475569' },

  // Modal Detail Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { height: '85%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalType: { fontSize: 10, fontWeight: '800', color: '#0E4D3C', letterSpacing: 0.5 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  modalCloseBtn: { padding: 4 },
  modalBanner: { width: '100%', height: 180, borderRadius: 14, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  detailVal: { fontSize: 12, color: '#0F172A', fontWeight: '700', maxWidth: '60%', textAlign: 'right' },
  sectionSubHeading: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginTop: 14, marginBottom: 6 },
  descText: { fontSize: 12, color: '#475569', lineHeight: 18 },
  facilityRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  facilityPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  facilityText: { fontSize: 11, color: '#334155', fontWeight: '600' },
});

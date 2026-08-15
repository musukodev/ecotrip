import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { authService, UserProfile, UserRole } from '@/services/authService';
import {
  businessService,
  CreateDestinationInput,
  CreateAccommodationInput,
} from '@/services/businessService';
import { Destination } from '@/services/destinationService';
import { Accommodation } from '@/services/accommodationService';
import { useAuth } from '@/hooks/useAuth';

export default function BusinessDashboardScreen() {
  const router = useRouter();
  const { userRole, setUserRole, isAuthenticated } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>(userRole || 'business_destination');
  const [destination, setDestination] = useState<Destination | null>(null);
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal & Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Common Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('1.0053');
  const [longitude, setLongitude] = useState('104.0834');
  const [phone, setPhone] = useState('');
  const [facilities, setFacilities] = useState('Toilet, Musholla, Parkir');
  const [photos, setPhotos] = useState('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000');

  // Destination Specific
  const [destCategory, setDestCategory] = useState<'nature' | 'culture' | 'culinary' | 'shopping' | 'adventure' | 'relaxation'>('nature');
  const [openingHours, setOpeningHours] = useState('08:00 - 17:00');
  const [ticketPrice, setTicketPrice] = useState('25000');

  // Accommodation Specific
  const [accCategory, setAccCategory] = useState<'hotel' | 'resort' | 'homestay'>('hotel');
  const [pricePerNight, setPricePerNight] = useState('650000');
  const [environmentalImpact, setEnvironmentalImpact] = useState('100% panel surya & bebas botol plastik');

  const isDestAdmin = activeRole === 'business_destination';

  const loadData = async () => {
    try {
      const token = await authService.getToken();
      if (!token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const prof = await authService.getProfile().catch(() => null);
      setProfile(prof);

      const resolvedRole = prof?.role || userRole || 'business_destination';
      setActiveRole(resolvedRole);
      if (setUserRole && prof?.role) {
        setUserRole(prof.role);
      }

      if (resolvedRole === 'business_destination') {
        const dests = await businessService.getMyDestinations().catch(() => []);
        setDestination(dests && dests.length > 0 ? dests[0] : null);
      } else {
        const accs = await businessService.getMyAccommodations().catch(() => []);
        setAccommodation(accs && accs.length > 0 ? accs[0] : null);
      }
    } catch (e) {
      console.warn('Dashboard load silent catch', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [userRole, isAuthenticated]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setName('');
    setDescription('');
    setLocation('');
    setPhone('');
    if (isDestAdmin) {
      setLatitude('1.0053');
      setLongitude('104.0834');
      setOpeningHours('08:00 - 17:00');
      setTicketPrice('25000');
      setFacilities('Toilet, Musholla, Parkir');
      setPhotos('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000');
    } else {
      setLatitude('1.1890');
      setLongitude('104.1020');
      setPricePerNight('650000');
      setFacilities('Wi-Fi, AC Hemat Energi, Dapur');
      setPhotos('https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000');
      setEnvironmentalImpact('100% panel surya & bebas botol plastik');
    }
    setModalVisible(true);
  };

  const openEditModal = () => {
    setIsEditing(true);
    if (isDestAdmin && destination) {
      setName(destination.name);
      setDestCategory(destination.category);
      setDescription(destination.description || '');
      setLocation(destination.location);
      setLatitude(destination.latitude ? destination.latitude.toString() : '');
      setLongitude(destination.longitude ? destination.longitude.toString() : '');
      setOpeningHours(destination.opening_hours || '');
      setTicketPrice(destination.ticket_price ? destination.ticket_price.toString() : '0');
      setPhone(destination.phone || '');
      setFacilities(destination.facilities ? destination.facilities.join(', ') : '');
      setPhotos(destination.photos ? destination.photos.join(', ') : '');
    } else if (!isDestAdmin && accommodation) {
      setName(accommodation.name);
      setAccCategory(accommodation.category);
      setDescription(accommodation.description || '');
      setLocation(accommodation.location);
      setLatitude(accommodation.latitude ? accommodation.latitude.toString() : '');
      setLongitude(accommodation.longitude ? accommodation.longitude.toString() : '');
      setPricePerNight(accommodation.price_per_night ? accommodation.price_per_night.toString() : '0');
      setPhone(accommodation.phone || '');
      setFacilities(accommodation.facilities ? accommodation.facilities.join(', ') : '');
      setPhotos(accommodation.photos ? accommodation.photos.join(', ') : '');
      setEnvironmentalImpact(accommodation.environmental_impact || '');
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !location.trim()) {
      Alert.alert('Perhatian', 'Nama dan Lokasi wajib diisi.');
      return;
    }

    setSaving(true);
    try {
      if (isDestAdmin) {
        const input: CreateDestinationInput = {
          name,
          category: destCategory,
          description,
          location,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          opening_hours: openingHours,
          ticket_price: Number(ticketPrice) || 0,
          phone,
          facilities: facilities.split(',').map((s) => s.trim()).filter(Boolean),
          photos: photos.split(',').map((s) => s.trim()).filter(Boolean),
        };

        if (isEditing && destination) {
          await businessService.updateDestination(destination.id, input);
          Alert.alert('Sukses', 'Informasi destinasi berhasil diperbarui!');
        } else {
          await businessService.createDestination(input);
          Alert.alert('Sukses', 'Destinasi berhasil didaftarkan dan langsung aktif!');
        }
      } else {
        const input: CreateAccommodationInput = {
          name,
          category: accCategory,
          description,
          location,
          latitude: latitude ? parseFloat(latitude) : undefined,
          longitude: longitude ? parseFloat(longitude) : undefined,
          price_per_night: Number(pricePerNight) || 0,
          facilities: facilities.split(',').map((s) => s.trim()).filter(Boolean),
          photos: photos.split(',').map((s) => s.trim()).filter(Boolean),
          phone,
          environmental_impact: environmentalImpact,
        };

        if (isEditing && accommodation) {
          await businessService.updateAccommodation(accommodation.id, input);
          Alert.alert('Sukses', 'Informasi penginapan berhasil diperbarui!');
        } else {
          await businessService.createAccommodation(input);
          Alert.alert('Sukses', 'Penginapan berhasil didaftarkan dan langsung aktif!');
        }
      }

      setModalVisible(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.error || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    const id = isDestAdmin ? destination?.id : accommodation?.id;
    if (!id) return;

    Alert.alert('Hapus Tempat', 'Yakin ingin menghapus data tempat usaha ini? Tindakan ini tidak dapat dibatalkan.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            if (isDestAdmin) {
              await businessService.deleteDestination(id);
            } else {
              await businessService.deleteAccommodation(id);
            }
            Alert.alert('Sukses', 'Data tempat berhasil dihapus.');
            loadData();
          } catch (e) {
            Alert.alert('Gagal', 'Gagal menghapus data tempat.');
          }
        },
      },
    ]);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0E4D3C" />
      </SafeAreaView>
    );
  }

  const currentVenue = isDestAdmin ? destination : accommodation;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Text style={styles.topBarBrand}>ECOTOUR AI</Text>
          <Text style={styles.topBarRole}>
            {isDestAdmin ? 'Portal Admin Destinasi' : 'Portal Admin Penginapan'}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0E4D3C']} />}
      >
        {/* Profile Header Greeting */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Ionicons name={isDestAdmin ? 'leaf' : 'business'} size={24} color="#0E4D3C" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Halo, {profile?.name || 'Mitra Usaha'} 👋</Text>
              <Text style={styles.profileEmail}>
                {isDestAdmin
                  ? 'Kelola tempat wisata alam, budaya, atau kuliner Batam Anda.'
                  : 'Kelola hotel, resort, atau homestay ramah lingkungan Anda.'}
              </Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>TEMPAT USAHA ANDA</Text>
          {currentVenue && (
            <TouchableOpacity style={styles.editSmallBtn} onPress={openEditModal}>
              <Ionicons name="create-outline" size={14} color="#0E4D3C" />
              <Text style={styles.editSmallBtnText}>Edit Data</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Place Card: Registered vs Unregistered */}
        {currentVenue ? (
          <View style={styles.venueCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.tagRow}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{currentVenue.category.toUpperCase()}</Text>
                </View>
                <View style={styles.ecoBadge}>
                  <Text style={styles.ecoBadgeText}>
                    Eco Score {currentVenue.eco_score ? currentVenue.eco_score.toFixed(1) : '88.0'}
                  </Text>
                </View>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>AKTIF / PUBLISHED</Text>
              </View>
            </View>

            <Text style={styles.venueName}>{currentVenue.name}</Text>
            <View style={styles.locRow}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.locText}>{currentVenue.location}</Text>
            </View>

            {currentVenue.latitude && currentVenue.longitude && (
              <View style={styles.gpsRow}>
                <Ionicons name="navigate-outline" size={14} color="#0E4D3C" />
                <Text style={styles.gpsText}>GPS: {currentVenue.latitude}, {currentVenue.longitude}</Text>
              </View>
            )}

            {!isDestAdmin && accommodation && (
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Tarif Per Malam</Text>
                <Text style={styles.priceVal}>
                  Rp {accommodation.price_per_night.toLocaleString('id-ID')}
                </Text>
              </View>
            )}

            {isDestAdmin && destination && (
              <View style={styles.priceBox}>
                <Text style={styles.priceLabel}>Tiket Masuk</Text>
                <Text style={styles.priceVal}>
                  {destination.ticket_price > 0 ? `Rp ${destination.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
                </Text>
              </View>
            )}

            <Text style={styles.fieldHeading}>Deskripsi</Text>
            <Text style={styles.venueDesc}>{currentVenue.description || 'Belum ada deskripsi.'}</Text>

            {!isDestAdmin && accommodation?.environmental_impact && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.fieldHeading}>Inisiatif Ramah Lingkungan (Eco Impact)</Text>
                <View style={styles.impactCard}>
                  <Ionicons name="flash-outline" size={16} color="#0E4D3C" style={{ marginRight: 6 }} />
                  <Text style={styles.impactText}>{accommodation.environmental_impact}</Text>
                </View>
              </View>
            )}

            {currentVenue.facilities && currentVenue.facilities.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.fieldHeading}>Fasilitas Terdaftar</Text>
                <View style={styles.facWrap}>
                  {currentVenue.facilities.map((f, idx) => (
                    <View key={idx} style={styles.facPill}>
                      <Text style={styles.facText}>{f}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action Buttons: Edit & Delete */}
            <View style={styles.actionRow}>
              <TouchableOpacity style={styles.btnEditPrimary} onPress={openEditModal}>
                <Ionicons name="create-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.btnTextPrimary}>Edit Informasi Tempat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnDelete} onPress={handleDelete}>
                <Ionicons name="trash-outline" size={18} color="#E63946" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name={isDestAdmin ? 'leaf-outline' : 'business-outline'} size={36} color="#0E4D3C" />
            </View>
            <Text style={styles.emptyTitle}>Anda Belum Mendaftarkan Tempat</Text>
            <Text style={styles.emptySub}>
              {isDestAdmin
                ? 'Daftarkan 1 tempat wisata alam, cagar budaya, atau kuliner khas Batam Anda agar dapat ditemukan wisatawan.'
                : 'Daftarkan 1 hotel, resort, atau homestay ramah lingkungan Anda di Batam.'}
            </Text>
            <TouchableOpacity style={styles.registerHeroBtn} onPress={openCreateModal}>
              <Ionicons name="add-circle" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.registerHeroBtnText}>
                {isDestAdmin ? 'Daftarkan Destinasi / Kuliner' : 'Daftarkan Penginapan'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal Form Tambah / Edit Terpadu */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Data Tempat' : isDestAdmin ? 'Daftarkan Destinasi / Kuliner' : 'Daftarkan Penginapan'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {isDestAdmin ? (
                <>
                  <Text style={styles.fieldLabel}>Kategori Destinasi</Text>
                  <View style={styles.catPickerRow}>
                    {(['nature', 'culture', 'culinary', 'adventure', 'shopping', 'relaxation'] as const).map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.catPickBtn, destCategory === cat && styles.catPickBtnActive]}
                        onPress={() => setDestCategory(cat)}
                      >
                        <Text style={[styles.catPickText, destCategory === cat && styles.catPickTextActive]}>
                          {cat.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.fieldLabel}>Kategori Penginapan</Text>
                  <View style={styles.catPickerRow}>
                    {(['hotel', 'resort', 'homestay'] as const).map((cat) => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.catPickBtn, accCategory === cat && styles.catPickBtnActive]}
                        onPress={() => setAccCategory(cat)}
                      >
                        <Text style={[styles.catPickText, accCategory === cat && styles.catPickTextActive]}>
                          {cat.toUpperCase()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              <Text style={styles.fieldLabel}>Nama Tempat</Text>
              <TextInput style={styles.input} placeholder="Nama Tempat Usaha" value={name} onChangeText={setName} />

              <Text style={styles.fieldLabel}>Alamat / Lokasi Lengkap</Text>
              <TextInput style={styles.input} placeholder="Contoh: Jl. Trans Barelang, Batam" value={location} onChangeText={setLocation} />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Latitude (GPS)</Text>
                  <TextInput style={styles.input} placeholder="1.0053" keyboardType="numeric" value={latitude} onChangeText={setLatitude} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.fieldLabel}>Longitude (GPS)</Text>
                  <TextInput style={styles.input} placeholder="104.0834" keyboardType="numeric" value={longitude} onChangeText={setLongitude} />
                </View>
              </View>

              {isDestAdmin ? (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Jam Buka</Text>
                    <TextInput style={styles.input} placeholder="08:00 - 17:00" value={openingHours} onChangeText={setOpeningHours} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Harga Tiket (Rp)</Text>
                    <TextInput style={styles.input} placeholder="25000" keyboardType="numeric" value={ticketPrice} onChangeText={setTicketPrice} />
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={styles.fieldLabel}>Harga per Malam (Rp)</Text>
                  <TextInput style={styles.input} placeholder="650000" keyboardType="numeric" value={pricePerNight} onChangeText={setPricePerNight} />
                </View>
              )}

              <Text style={styles.fieldLabel}>Deskripsi</Text>
              <TextInput
                style={[styles.input, { height: 60 }]}
                multiline
                placeholder="Ceritakan keunggulan tempat & fasilitasnya..."
                value={description}
                onChangeText={setDescription}
              />

              {!isDestAdmin && (
                <>
                  <Text style={styles.fieldLabel}>Inisiatif Ramah Lingkungan (Eco Impact)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Contoh: 100% panel surya & bebas botol plastik"
                    value={environmentalImpact}
                    onChangeText={setEnvironmentalImpact}
                  />
                </>
              )}

              <Text style={styles.fieldLabel}>Fasilitas (Pisahkan koma)</Text>
              <TextInput style={styles.input} placeholder="Wi-Fi, Toilet, Parkir" value={facilities} onChangeText={setFacilities} />

              <Text style={styles.fieldLabel}>No. Telepon / WhatsApp</Text>
              <TextInput style={styles.input} placeholder="+62 812-xxxx-xxxx" value={phone} onChangeText={setPhone} />

              <Text style={styles.fieldLabel}>URL Foto</Text>
              <TextInput style={styles.input} placeholder="https://..." value={photos} onChangeText={setPhotos} />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>{isEditing ? 'Simpan Perubahan' : 'Simpan & Publikasikan'}</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7F6' },
  center: { paddingVertical: 40, alignItems: 'center' },
  topBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topBarLeft: { gap: 1 },
  topBarBrand: { fontSize: 11, fontWeight: '800', color: '#0E4D3C', letterSpacing: 1 },
  topBarRole: { fontSize: 15, fontWeight: '800', color: '#0F172A' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E2EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  profileEmail: { fontSize: 12, color: '#64748B', marginTop: 1 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: '#64748B', letterSpacing: 0.8 },
  editSmallBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editSmallBtnText: { fontSize: 12, fontWeight: '700', color: '#0E4D3C' },
  venueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 6 },
  catBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catBadgeText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  ecoBadge: { backgroundColor: '#E2EFE9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  ecoBadgeText: { fontSize: 10, fontWeight: '800', color: '#0E4D3C' },
  activePill: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  activePillText: { fontSize: 9, fontWeight: '800', color: '#15803D' },
  venueName: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  locRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  locText: { fontSize: 13, color: '#64748B' },
  gpsRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  gpsText: { fontSize: 12, color: '#0E4D3C', fontWeight: '600' },
  priceBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 10, marginVertical: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  priceLabel: { fontSize: 11, color: '#64748B' },
  priceVal: { fontSize: 16, fontWeight: '800', color: '#0E4D3C', marginTop: 2 },
  fieldHeading: { fontSize: 11, fontWeight: '800', color: '#0E4D3C', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4, marginTop: 10 },
  venueDesc: { fontSize: 13, color: '#475569', lineHeight: 18 },
  impactCard: { flexDirection: 'row', backgroundColor: '#EFF6F3', padding: 10, borderRadius: 8, alignItems: 'center' },
  impactText: { fontSize: 12, color: '#2D6A4F', flex: 1 },
  facWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  facPill: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  facText: { fontSize: 11, color: '#334155' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  btnEditPrimary: {
    flex: 1,
    backgroundColor: '#0E4D3C',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextPrimary: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  btnDelete: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEE2E2', justifyContent: 'center', alignItems: 'center' },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E2EFE9', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  emptySub: { fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 6, lineHeight: 18, marginBottom: 18 },
  registerHeroBtn: {
    flexDirection: 'row',
    backgroundColor: '#0E4D3C',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerHeroBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { height: '88%', backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  modalBody: { flex: 1 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#0E4D3C', marginTop: 10, marginBottom: 6 },
  catPickerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  catPickBtn: { minWidth: '30%', flexGrow: 1, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center' },
  catPickBtnActive: { backgroundColor: '#0E4D3C' },
  catPickText: { fontSize: 10, fontWeight: '700', color: '#64748B' },
  catPickTextActive: { color: '#FFFFFF' },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0F172A' },
  saveBtn: { backgroundColor: '#0E4D3C', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 40 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
});

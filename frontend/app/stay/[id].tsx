import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { accommodationService, Accommodation } from '@/services/accommodationService';

const { width } = Dimensions.get('window');

export default function StayDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await accommodationService.getAccommodationById(id);
        setAccommodation(res);
        setIsFavorite(res.is_favorite || false);
      } catch (e) {
        console.error('Failed to load stay detail', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    try {
      const res = await accommodationService.toggleFavorite(id);
      setIsFavorite(res.is_favorite);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCall = () => {
    if (accommodation?.phone) {
      Linking.openURL(`tel:${accommodation.phone}`);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0B3C26" />
      </SafeAreaView>
    );
  }

  if (!accommodation) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Penginapan tidak ditemukan.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Image Banner with Floating Header */}
        <ImageBackground
          source={{
            uri: accommodation.photos?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000',
          }}
          style={styles.bannerImage}
        >
          <SafeAreaView style={styles.topHeaderBar} edges={['top']}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={handleToggleFavorite}>
              <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={20} color={isFavorite ? '#E63946' : '#000'} />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>

        {/* Content Sheet */}
        <View style={styles.contentSheet}>
          {/* Badge & Rating Row */}
          <View style={styles.metaRow}>
            <View style={styles.ecoBadge}>
              <Ionicons name="leaf-outline" size={12} color="#0B3C26" />
              <Text style={styles.ecoBadgeText}>
                Eco Score {accommodation.eco_score ? accommodation.eco_score.toFixed(1) : '90.0'}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{accommodation.category.toUpperCase()}</Text>
            </View>
          </View>

          {/* Title & Location */}
          <Text style={styles.title}>{accommodation.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={styles.locationText}>{accommodation.location}</Text>
          </View>

          {/* Price Box */}
          <View style={styles.priceBox}>
            <Text style={styles.priceLabel}>Harga per malam mulai dari</Text>
            <Text style={styles.priceValue}>
              Rp {accommodation.price_per_night.toLocaleString('id-ID')}
            </Text>
          </View>

          {/* About Section */}
          <Text style={styles.sectionTitle}>Tentang Penginapan</Text>
          <Text style={styles.aboutText}>{accommodation.description}</Text>

          {/* Environmental Impact Section */}
          {accommodation.environmental_impact && (
            <>
              <Text style={styles.sectionTitle}>Inisiatif Ramah Lingkungan</Text>
              <View style={styles.impactCard}>
                <View style={styles.impactIconCircle}>
                  <Ionicons name="flash-outline" size={16} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.impactTitle}>Praktik Keberlanjutan</Text>
                  <Text style={styles.impactDesc}>{accommodation.environmental_impact}</Text>
                </View>
              </View>
            </>
          )}

          {/* Amenities Grid */}
          {accommodation.facilities && accommodation.facilities.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Fasilitas</Text>
              <View style={styles.amenitiesGrid}>
                {accommodation.facilities.map((am, idx) => (
                  <View key={idx} style={styles.amenityCard}>
                    <Ionicons name="checkmark-circle" size={16} color="#0B3C26" />
                    <Text style={styles.amenityName}>{am}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Contact button */}
          {accommodation.phone && (
            <TouchableOpacity style={styles.contactBtn} onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.contactBtnText}>Hubungi Penginapan ({accommodation.phone})</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 40 },
  errorText: { color: '#64748B', fontSize: 15, marginBottom: 12 },
  backBtn: { backgroundColor: '#0B3C26', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  bannerImage: { width: width, height: 300, position: 'relative' },
  topHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ecoBadgeText: { fontSize: 11, fontWeight: '700', color: '#0B3C26' },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  title: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  locationText: { fontSize: 13, color: '#64748B' },
  priceBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  priceLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  priceValue: { fontSize: 20, fontWeight: '800', color: '#0B3C26' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#0B3C26', marginTop: 10, marginBottom: 12 },
  aboutText: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 },
  impactCard: {
    flexDirection: 'row',
    backgroundColor: '#EFF6F3',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  impactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0B3C26',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactTitle: { fontSize: 13, fontWeight: '800', color: '#0B3C26' },
  impactDesc: { fontSize: 12, color: '#2D6A4F', marginTop: 2, lineHeight: 16 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  amenityName: { fontSize: 12, fontWeight: '600', color: '#334155' },
  contactBtn: {
    backgroundColor: '#0B3C26',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  contactBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});

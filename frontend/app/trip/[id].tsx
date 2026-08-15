import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { destinationService, Destination } from '@/services/destinationService';
import { ratingService, RatingResponse } from '@/services/ratingService';

const { width } = Dimensions.get('window');

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [ratingData, setRatingData] = useState<RatingResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const [dest, ratings] = await Promise.all([
          destinationService.getDestinationById(id),
          ratingService.getRatings('destination', id).catch(() => null),
        ]);
        setDestination(dest);
        setRatingData(ratings);
      } catch (e) {
        console.error('Failed to load destination detail', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleOpenDirections = () => {
    if (destination?.directions_url) {
      Linking.openURL(destination.directions_url);
    } else if (destination?.latitude && destination?.longitude) {
      Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`);
    }
  };

  const handleCall = () => {
    if (destination?.phone) {
      Linking.openURL(`tel:${destination.phone}`);
    }
  };

  const handleShare = async () => {
    if (destination) {
      try {
        await Share.share({
          message: `Kunjungi ${destination.name} di Batam! Destinasi ramah lingkungan dengan Eco Score ${destination.eco_score}.`,
          url: destination.share_url,
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#0E4D3C" />
      </SafeAreaView>
    );
  }

  if (!destination) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Destinasi tidak ditemukan.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Image Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: destination.photos?.[0] || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000' }}
            style={styles.bannerImage}
          />
          {/* Top Bar Floating Buttons */}
          <SafeAreaView style={styles.topFloatBar} edges={['top']}>
            <TouchableOpacity style={styles.roundIconBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="#0E4D3C" />
            </TouchableOpacity>
            <View style={styles.rightFloatGroup}>
              <TouchableOpacity style={styles.roundIconBtn} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={18} color="#0E4D3C" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        {/* Content Body */}
        <View style={styles.contentBody}>
          {/* Badge & Rating Row */}
          <View style={styles.tagRow}>
            <View style={styles.ecoBadge}>
              <Ionicons name="leaf-outline" size={12} color="#0E4D3C" />
              <Text style={styles.ecoBadgeText}>Eco Score {destination.eco_score ? destination.eco_score.toFixed(1) : '85.0'}</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{destination.category.toUpperCase()}</Text>
            </View>
          </View>

          {/* Title & Location */}
          <Text style={styles.titleText}>{destination.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#64748B" />
            <Text style={styles.locationText}>{destination.location}</Text>
          </View>

          {/* Key Info Cards */}
          <View style={styles.infoCardsGrid}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={18} color="#0E4D3C" />
              <Text style={styles.infoCardLabel}>Jam Buka</Text>
              <Text style={styles.infoCardValue}>{destination.opening_hours || '08:00 - 17:00'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="ticket-outline" size={18} color="#0E4D3C" />
              <Text style={styles.infoCardLabel}>Tiket Masuk</Text>
              <Text style={styles.infoCardValue}>
                {destination.ticket_price > 0 ? `Rp ${destination.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionHeading}>Tentang Destinasi</Text>
          <Text style={styles.bodyParagraph}>{destination.description}</Text>

          {/* Positive Impact Card */}
          {destination.conservation_contribution_pct > 0 && (
            <View style={styles.impactCard}>
              <View style={styles.impactIconCircle}>
                <Ionicons name="heart" size={16} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.impactTitle}>Kontribusi Konservasi</Text>
                <Text style={styles.impactDesc}>
                  {destination.conservation_contribution_pct}% dari tiket masuk dialokasikan langsung untuk program pelestarian alam dan komunitas lokal Batam.
                </Text>
              </View>
            </View>
          )}

          {/* Facilities */}
          {destination.facilities && destination.facilities.length > 0 && (
            <>
              <Text style={styles.sectionHeading}>Fasilitas</Text>
              <View style={styles.facilitiesWrap}>
                {destination.facilities.map((fac, idx) => (
                  <View key={idx} style={styles.facilityPill}>
                    <Ionicons name="checkmark-circle-outline" size={14} color="#0E4D3C" />
                    <Text style={styles.facilityText}>{fac}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Quick Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionBtnPrimary} onPress={handleOpenDirections}>
              <Ionicons name="navigate-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnTextPrimary}>Petunjuk Arah</Text>
            </TouchableOpacity>

            {destination.phone && (
              <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleCall}>
                <Ionicons name="call-outline" size={18} color="#0E4D3C" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 60 },
  errorText: { color: '#64748B', fontSize: 15, marginBottom: 12 },
  backBtn: { backgroundColor: '#0E4D3C', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backBtnText: { color: '#FFFFFF', fontWeight: 'bold' },
  bannerContainer: { position: 'relative', width: width, height: 280 },
  bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  topFloatBar: {
    position: 'absolute',
    top: 0,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightFloatGroup: { flexDirection: 'row', gap: 8 },
  roundIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentBody: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ecoBadgeText: { fontSize: 11, fontWeight: '700', color: '#0E4D3C' },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '700', color: '#475569' },
  titleText: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 20 },
  locationText: { fontSize: 13, color: '#64748B' },
  infoCardsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  infoCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoCardLabel: { fontSize: 11, color: '#64748B', marginTop: 6 },
  infoCardValue: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 2 },
  sectionHeading: { fontSize: 16, fontWeight: '800', color: '#0F172A', marginBottom: 10, marginTop: 8 },
  bodyParagraph: { fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 16 },
  impactCard: {
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  impactIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D6A4F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactTitle: { fontSize: 13, fontWeight: '800', color: '#1B4332' },
  impactDesc: { fontSize: 12, color: '#2D6A4F', marginTop: 2, lineHeight: 16 },
  facilitiesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  facilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  facilityText: { fontSize: 12, color: '#334155', fontWeight: '500' },
  actionsContainer: { flexDirection: 'row', gap: 12, marginTop: 10 },
  actionBtnPrimary: {
    flex: 1,
    backgroundColor: '#0E4D3C',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnTextPrimary: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  actionBtnSecondary: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#E2EFE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

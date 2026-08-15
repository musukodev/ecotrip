import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Data Dummy Front-end
const DUMMY_STAYS: Record<string, any> = {
  'nirwana-eco-resort': {
    title: 'Nirwana Eco Resort',
    location: 'Bali, Indonesia',
    rating: '4.9',
    tags: ['Sustainable Certified', 'Luxury'],
    about:
      'Experience unparalleled luxury in harmony with nature. Nirwana Eco Resort is a pioneering sanctuary fully powered by solar energy, offering organic farm-to-table dining and exclusive reef restoration tours, proving that premium comfort doesn\'t have to cost the earth.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000',
    amenities: [
      { name: 'Fast Wi-Fi', icon: 'wifi-outline' },
      { name: 'Infinity Pool', icon: 'water-outline' },
      { name: 'Eco Spa', icon: 'leaf-outline' },
      { name: 'Organic Dining', icon: 'restaurant-outline' },
    ],
    ecoImpacts: [
      {
        title: '100% Solar Powered',
        desc: 'The entire resort operates on renewable energy, significantly reducing its carbon footprint while providing uninterrupted luxury.',
        icon: 'flash-outline',
      },
      {
        title: 'Reef Protection',
        desc: 'A portion of every booking goes towards local coral reef restoration programs, ensuring marine biodiversity for future generations.',
        icon: 'water-outline',
      },
    ],
  },
  'batam-green-villa': {
    title: 'Batam Green Villa',
    location: 'Batam, Indonesia',
    rating: '4.9',
    tags: ['Eco-Badge', 'Forest View'],
    about:
      'Sustainable forest retreat featuring expansive organic gardens, rainwater harvesting, and zero-waste initiatives nestled deep within Batam\'s lush nature.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000',
    amenities: [
      { name: 'Fast Wi-Fi', icon: 'wifi-outline' },
      { name: 'Nature Walk', icon: 'walk-outline' },
      { name: 'Eco Kitchen', icon: 'restaurant-outline' },
    ],
    ecoImpacts: [
      {
        title: 'Rainwater Harvesting',
        desc: '100% of water used for gardens and secondary needs is collected through sustainable rainwater systems.',
        icon: 'rainy-outline',
      },
    ],
  },
};

export default function StayDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Memilih data berdasarkan ID, fallback ke Nirwana jika ID tidak ditemukan
  const stay = DUMMY_STAYS[id || ''] || DUMMY_STAYS['nirwana-eco-resort'];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Top Image Banner */}
        <ImageBackground source={{ uri: stay.image }} style={styles.bannerImage}>
          <SafeAreaView style={styles.headerBar}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="heart" size={20} color="#DC2626" />
            </TouchableOpacity>
          </SafeAreaView>
        </ImageBackground>

        {/* Floating Content Body */}
        <View style={styles.contentContainer}>
          {/* Title & Rating */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{stay.title}</Text>
              <View style={styles.locRow}>
                <Ionicons name="location-outline" size={14} color="#64748B" />
                <Text style={styles.locText}>{stay.location}</Text>
              </View>
            </View>

            <View style={styles.ratingBadge}>
              <Ionicons name="star-outline" size={14} color="#0B3C26" />
              <Text style={styles.ratingText}>{stay.rating}</Text>
            </View>
          </View>

          {/* Badges / Tags */}
          <View style={styles.tagRow}>
            {stay.tags.map((tag: string, index: number) => (
              <View key={index} style={index === 0 ? styles.tagGreen : styles.tagGold}>
                <Ionicons
                  name={index === 0 ? 'leaf-outline' : 'diamond-outline'}
                  size={12}
                  color={index === 0 ? '#0B3C26' : '#92400E'}
                />
                <Text style={index === 0 ? styles.tagGreenText : styles.tagGoldText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* About Section */}
          <Text style={styles.sectionTitle}>About this stay</Text>
          <Text style={styles.aboutText}>{stay.about}</Text>
          <TouchableOpacity style={{ marginTop: 4 }}>
            <Text style={styles.readMore}>Read more</Text>
          </TouchableOpacity>

          {/* Amenities Section */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {stay.amenities.map((amenity: any, index: number) => (
              <View key={index} style={styles.amenityItem}>
                <View style={styles.amenityIconCircle}>
                  <Ionicons name={amenity.icon} size={20} color="#0B3C26" />
                </View>
                <Text style={styles.amenityLabel}>{amenity.name}</Text>
              </View>
            ))}
          </View>

          {/* Eco Impact Section */}
          <Text style={styles.sectionTitle}>Eco Impact</Text>
          <View style={styles.ecoCardWrapper}>
            {stay.ecoImpacts.map((impact: any, idx: number) => (
              <View key={idx} style={[styles.impactBox, idx > 0 && { marginTop: 14 }]}>
                <View style={styles.impactIconCircle}>
                  <Ionicons name={impact.icon} size={18} color="#0B3C26" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.impactTitle}>{impact.title}</Text>
                  <Text style={styles.impactDesc}>{impact.desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Location / Map Section */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapCard}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000' }}
              style={styles.mapImage}
            >
              <View style={styles.mapPin}>
                <Ionicons name="location" size={20} color="#0B3C26" />
              </View>
            </ImageBackground>
            <View style={styles.mapFooter}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mapTitle}>{stay.title}</Text>
                <Text style={styles.mapSubtitle}>{stay.location}</Text>
              </View>
              <TouchableOpacity style={styles.bookBtn}>
                <Text style={styles.bookBtnText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF6F3' },
  bannerImage: { width: width, height: 260 },
  headerBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#EFF6F3',
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locText: { fontSize: 13, color: '#64748B', marginLeft: 4 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  ratingText: { fontSize: 13, fontWeight: '700', color: '#0B3C26', marginLeft: 4 },
  tagRow: { flexDirection: 'row', marginVertical: 14 },
  tagGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1E7DD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  tagGreenText: { fontSize: 11, fontWeight: '700', color: '#0B3C26', marginLeft: 4 },
  tagGold: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagGoldText: { fontSize: 11, fontWeight: '700', color: '#92400E', marginLeft: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginTop: 20, marginBottom: 10 },
  aboutText: { fontSize: 13, color: '#475569', lineHeight: 20 },
  readMore: { fontSize: 13, fontWeight: '700', color: '#0B3C26' },
  amenitiesGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  amenityItem: { alignItems: 'center', flex: 1 },
  amenityIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2EFE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  amenityLabel: { fontSize: 11, color: '#475569', textAlign: 'center' },
  ecoCardWrapper: {
    backgroundColor: '#EBF4F0',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D0E3DC',
  },
  impactBox: { flexDirection: 'row', alignItems: 'flex-start' },
  impactIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D1E7DD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  impactTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  impactDesc: { fontSize: 12, color: '#64748B', marginTop: 2, lineHeight: 16 },
  mapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  mapImage: { height: 120, justifyContent: 'center', alignItems: 'center' },
  mapPin: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  mapFooter: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  mapTitle: { fontSize: 13, fontWeight: '700', color: '#1E293B' },
  mapSubtitle: { fontSize: 11, color: '#64748B' },
  bookBtn: { backgroundColor: '#0B3C26', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  bookBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
});
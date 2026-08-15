import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const ACCOMMODATIONS_DATA = [
  {
    id: 'nirwana-eco-resort',
    title: 'Nirwana Eco Resort',
    category: 'Resort',
    badge: 'Sustainable',
    rating: '4.8',
    description:
      'Luxury beachfront eco-resort fully powered by solar energy, featuring organic dining and reef restoration tours.',
    location: 'Bali, Indonesia',
    price: 'Rp 1.2M / night',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000',
    tags: ['Sustainable Certified', 'Luxury'],
    about:
      'Experience unparalleled luxury in harmony with nature. Nirwana Eco Resort is a pioneering sanctuary fully powered by solar energy, offering organic farm-to-table dining and exclusive reef restoration tours, proving that premium comfort doesn\'t have to cost the earth.',
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
  {
    id: 'batam-green-villa',
    title: 'Batam Green Villa',
    category: 'Hotel',
    badge: 'Eco-Badge',
    rating: '4.9',
    description:
      'Sustainable forest retreat featuring expansive organic gardens, rainwater harvesting, and zero-waste initiatives.',
    location: 'Batam, Indonesia',
    price: 'Rp 850k / night',
    image:
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000',
    tags: ['Eco-Badge', 'Forest View'],
    about:
      'Nestled deep within Batam\'s lush forest, Batam Green Villa offers a peaceful getaway designed with local bamboo materials and modern sustainable comforts.',
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
];

export default function StayScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('Hotel');

  const categories = ['Hotel', 'Resort', 'Homestay'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Accommodation Preferences Header */}
        <View style={styles.prefHeader}>
          <Ionicons name="bed-outline" size={18} color="#0B3C26" />
          <Text style={styles.prefTitle}>ACCOMMODATION PREFERENCES</Text>
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catContainer}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Ionicons
                  name={cat === 'Hotel' ? 'bed' : cat === 'Resort' ? 'home-outline' : 'business-outline'}
                  size={16}
                  color={isActive ? '#FFFFFF' : '#0B3C26'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Accommodation Cards List */}
        {ACCOMMODATIONS_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            {/* Image Header with Favorite Button */}
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <TouchableOpacity style={styles.heartCircle}>
                <Ionicons name="heart-outline" size={20} color="#000" />
              </TouchableOpacity>
            </View>

            {/* Card Content */}
            <View style={styles.cardContent}>
              <View style={styles.badgeRow}>
                <View style={styles.ecoBadge}>
                  <Ionicons name="leaf-outline" size={12} color="#0B3C26" />
                  <Text style={styles.ecoBadgeText}>{item.badge}</Text>
                </View>

                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#D97706" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>

              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#64748B" />
                <Text style={styles.infoText}>{item.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="wallet-outline" size={16} color="#64748B" />
                <Text style={styles.priceText}>{item.price}</Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <View style={styles.iconGroup}>
                  <TouchableOpacity style={styles.circleBtn}>
                    <Ionicons name="compass-outline" size={16} color="#0B3C26" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleBtn}>
                    <Ionicons name="call-outline" size={16} color="#0B3C26" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.circleBtn}>
                    <Ionicons name="share-social-outline" size={16} color="#0B3C26" />
                  </TouchableOpacity>
                </View>

                {/* View Details Click Event -> Mengarah ke app/stay/[id].tsx */}
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() => router.push(`/stay/${item.id}`)}
                >
                  <Text style={styles.detailBtnText}>View Details</Text>
                  <Ionicons name="arrow-forward" size={14} color="#0B3C26" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF6F3' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 },
  prefHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  prefTitle: { fontSize: 12, fontWeight: '800', color: '#0B3C26', letterSpacing: 0.8, marginLeft: 6 },
  catContainer: { flexDirection: 'row', marginBottom: 16 },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D0E3DC',
    marginRight: 10,
  },
  catPillActive: { backgroundColor: '#0B3C26', borderColor: '#0B3C26' },
  catText: { fontSize: 13, fontWeight: '700', color: '#0B3C26' },
  catTextActive: { color: '#FFFFFF' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  imageWrapper: { position: 'relative', height: 200, width: '100%' },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heartCircle: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { padding: 16 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ecoBadgeText: { fontSize: 11, fontWeight: '700', color: '#0B3C26', marginLeft: 4 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#92400E', marginLeft: 4 },
  title: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  description: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  infoText: { fontSize: 12, color: '#475569', marginLeft: 6 },
  priceText: { fontSize: 13, fontWeight: '700', color: '#0B3C26', marginLeft: 6 },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  iconGroup: { flexDirection: 'row' },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2EFE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  detailBtn: { flexDirection: 'row', alignItems: 'center' },
  detailBtnText: { fontSize: 13, fontWeight: '700', color: '#0B3C26', marginRight: 4 },
});
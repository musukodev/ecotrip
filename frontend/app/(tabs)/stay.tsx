import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { accommodationService, Accommodation } from '@/services/accommodationService';

export default function StayScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('hotel');
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { key: 'hotel', label: 'Hotel' },
    { key: 'resort', label: 'Resort' },
    { key: 'homestay', label: 'Homestay' },
  ];

  const fetchAccommodations = async (cat: string) => {
    try {
      setLoading(true);
      const data = await accommodationService.getAccommodations(cat);
      setAccommodations(data);
    } catch (e) {
      console.error('Failed to load accommodations', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccommodations(selectedCategory);
  }, [selectedCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccommodations(selectedCategory);
  };

  const handleToggleFavorite = async (id: number) => {
    try {
      const res = await accommodationService.toggleFavorite(id);
      setAccommodations((prev) =>
        prev.map((acc) => (acc.id === id ? { ...acc, is_favorite: res.is_favorite } : acc))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0B3C26']} />}
      >
        {/* Accommodation Preferences Header */}
        <View style={styles.prefHeader}>
          <Ionicons name="bed-outline" size={18} color="#0B3C26" />
          <Text style={styles.prefTitle}>PILIHAN PENGINAPAN BATAM</Text>
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catContainer}>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Ionicons
                  name={cat.key === 'hotel' ? 'bed' : cat.key === 'resort' ? 'home-outline' : 'business-outline'}
                  size={16}
                  color={isActive ? '#FFFFFF' : '#0B3C26'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.catText, isActive && styles.catTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Loading Spinner */}
        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0B3C26" />
          </View>
        ) : accommodations.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Belum ada penginapan di kategori ini.</Text>
          </View>
        ) : (
          /* Accommodation Cards List */
          accommodations.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Image Header with Favorite Button */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.photos?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000' }}
                  style={styles.cardImage}
                />
                <TouchableOpacity
                  style={styles.heartCircle}
                  onPress={() => handleToggleFavorite(item.id)}
                >
                  <Ionicons
                    name={item.is_favorite ? 'heart' : 'heart-outline'}
                    size={20}
                    color={item.is_favorite ? '#E63946' : '#000000'}
                  />
                </TouchableOpacity>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.badgeRow}>
                  <View style={styles.ecoBadge}>
                    <Ionicons name="leaf-outline" size={12} color="#0B3C26" />
                    <Text style={styles.ecoBadgeText}>
                      Eco Score {item.eco_score ? item.eco_score.toFixed(1) : '90.0'}
                    </Text>
                  </View>

                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#D97706" />
                    <Text style={styles.ratingText}>
                      {item.eco_score ? (item.eco_score / 20).toFixed(1) : '4.8'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={16} color="#64748B" />
                  <Text style={styles.infoText}>{item.location}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="wallet-outline" size={16} color="#64748B" />
                  <Text style={styles.priceText}>
                    Rp {(item.price_per_night / 1000).toLocaleString('id-ID')}k / malam
                  </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionRow}>
                  <View style={styles.iconGroup}>
                    {item.phone && (
                      <TouchableOpacity style={styles.circleBtn}>
                        <Ionicons name="call-outline" size={16} color="#0B3C26" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* View Details Click Event */}
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
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF6F3' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 10 },
  center: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#64748B', fontSize: 14 },
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

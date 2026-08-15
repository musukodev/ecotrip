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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const MY_BOOKINGS = [
  {
    id: 'nirwana-eco-resort',
    title: 'Nirwana Eco Resort',
    type: 'Stay',
    date: '20 - 23 Aug 2026',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1000',
    location: 'Bali, Indonesia',
    badge: '100% Solar Powered',
  },
  {
    id: 'komodo-green-sailing',
    title: 'Komodo Island Eco Sailing',
    type: 'Trip',
    date: '10 - 14 Sep 2026',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000',
    location: 'Labuan Bajo',
    badge: 'Zero-Waste Boat',
  },
  {
    id: 'batam-green-villa',
    title: 'Batam Green Villa',
    type: 'Stay',
    date: '02 - 04 May 2026',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1000',
    location: 'Batam, Indonesia',
    badge: 'Rainwater System',
  },
];

export default function MyTripScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Completed'>('Upcoming');

  const filteredTrips = MY_BOOKINGS.filter((item) => item.status === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perjalanan Saya</Text>
        <Text style={styles.headerSubtitle}>Kelola semua pesanan & pengalaman ramah lingkunganmu</Text>
      </View>

      {/* Tab Filter */}
      <View style={styles.tabWrapper}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Upcoming' && styles.tabItemActive]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.tabTextActive]}>
            Mendatang ({MY_BOOKINGS.filter((i) => i.status === 'Upcoming').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'Completed' && styles.tabItemActive]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text style={[styles.tabText, activeTab === 'Completed' && styles.tabTextActive]}>
            Selesai ({MY_BOOKINGS.filter((i) => i.status === 'Completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* List Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredTrips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="compass-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Belum ada perjalanan</Text>
            <Text style={styles.emptyDesc}>Mulai jelajahi destinasi eco-friendly sekarang!</Text>
          </View>
        ) : (
          filteredTrips.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.9}
              onPress={() => {
                if (item.type === 'Stay') router.push(`/stay/${item.id}`);
                else router.push(`/trip/${item.id}`);
              }}
            >
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              <View style={styles.cardBody}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{item.type}</Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>

                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  <Text style={styles.infoText}>{item.location}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="calendar-outline" size={14} color="#64748B" />
                  <Text style={styles.infoText}>{item.date}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <View style={styles.ecoBadge}>
                    <Ionicons name="leaf-outline" size={12} color="#0B3C26" />
                    <Text style={styles.ecoBadgeText}>{item.badge}</Text>
                  </View>

                  <View style={styles.actionBtn}>
                    <Text style={styles.actionBtnText}>Detail</Text>
                    <Ionicons name="chevron-forward" size={14} color="#0B3C26" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#EFF6F3' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  tabWrapper: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#E2EFE9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabItemActive: { backgroundColor: '#FFFFFF', elevation: 2 },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#0B3C26', fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  cardImage: { width: '100%', height: 140 },
  cardBody: { padding: 16 },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2EFE9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  typeText: { fontSize: 11, fontWeight: '700', color: '#0B3C26' },
  cardTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { fontSize: 12, color: '#64748B', marginLeft: 6 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1E7DD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ecoBadgeText: { fontSize: 11, fontWeight: '700', color: '#0B3C26', marginLeft: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#0B3C26', marginRight: 2 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#475569', marginTop: 12 },
  emptyDesc: { fontSize: 12, color: '#94A3B8', marginTop: 4, textAlign: 'center' },
});
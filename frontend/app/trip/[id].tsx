import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Extended Mock Data untuk menyesuaikan komponen desain UI
const TRIPS_DETAIL_DATA: Record<string, any> = {
  'bali-eco-tour': {
    id: 'bali-eco-tour',
    title: 'Bali Eco Cultural Tour',
    badge: 'SUSTAINABLE',
    location: 'Ubud, Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000',
    description:
      'Explore green rice terraces, traditional villages, and eco-friendly workshops. Immerse yourself in the rich biodiversity and culture, supporting local heritage and eco-conservation.',
    openingHours: '08:00 - 17:00',
    price: 'Rp 2.500.000',
    bestTime: 'Early Morning (7am - 10am)',
    positiveImpact:
      '100% of your tour fee goes directly towards forest reforestation projects and supporting local indigenous communities who manage the reserve.',
    facilities: [
      { name: 'Parking', icon: 'car-outline' },
      { name: 'Restroom', icon: 'woman-outline' },
      { name: 'Cafe', icon: 'cafe-outline' },
      { name: 'Tours', icon: 'walk-outline' },
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000',
    rating: '4.9',
    reviews: [
      {
        id: 'r1',
        rating: 5,
        text: '"A surprisingly peaceful escape from the city. The guided tour was excellent and we learned so much about nature conservation."',
        author: 'Sarah A.',
        time: '2 weeks ago',
        avatarText: 'SA',
      },
      {
        id: 'r2',
        rating: 5,
        text: '"Beautifully maintained space and friendly staff. Make sure to bring insect spray!"',
        author: 'Mark J.',
        time: '1 month ago',
        avatarText: 'MJ',
      },
    ],
  },
  'komodo-green-sailing': {
    id: 'komodo-green-sailing',
    title: 'Komodo Island Eco Sailing',
    badge: 'SUSTAINABLE',
    location: 'Labuan Bajo, NTT',
    image: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?q=80&w=1000',
    description:
      'Zero-waste boat trip visiting Komodo National Park and coral protection sites. Sail responsibly through pristine waters and witness incredible marine life.',
    openingHours: '06:00 - 18:00',
    price: 'Rp 4.800.000',
    bestTime: 'Sunrise & Early Morning',
    positiveImpact:
      'Part of the trip proceeds funds marine protection initiatives and reef restoration programs in Labuan Bajo.',
    facilities: [
      { name: 'Boat', icon: 'boat-outline' },
      { name: 'Restroom', icon: 'woman-outline' },
      { name: 'Meals', icon: 'restaurant-outline' },
      { name: 'Guide', icon: 'compass-outline' },
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000',
    rating: '5.0',
    reviews: [
      {
        id: 'r1',
        rating: 5,
        text: '"Unbelievable experience! Seeing the Komodo dragons and pristine reefs while staying eco-conscious was perfect."',
        author: 'Alex R.',
        time: '3 weeks ago',
        avatarText: 'AR',
      },
    ],
  },
};

export default function TripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Fallback data jika ID yang dikirim dari rute tidak ada di dictionary
  const selectedTrip = (id && TRIPS_DETAIL_DATA[id as string]) || {
    id: id || 'default',
    title: 'Batam Botanical Forest',
    badge: 'SUSTAINABLE',
    location: 'Batam, Riau Islands',
    image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000',
    description:
      'Immerse yourself in the rich biodiversity of the Riau archipelago. This protected sanctuary spans over 200 hectares, offering tranquil nature walks beneath towering canopies, curated collections of rare tropical flora, and a deep commitment to environmental conservation.',
    openingHours: '08:00 - 17:00',
    price: 'Rp 50.000',
    bestTime: 'Early Morning (7am - 10am)',
    positiveImpact:
      '100% of your entry fee goes directly towards forest reforestation projects and supporting local indigenous communities who manage the reserve.',
    facilities: [
      { name: 'Parking', icon: 'car-outline' },
      { name: 'Restroom', icon: 'woman-outline' },
      { name: 'Cafe', icon: 'cafe-outline' },
      { name: 'Tours', icon: 'walk-outline' },
    ],
    mapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000',
    rating: '4.8',
    reviews: [
      {
        id: 'r1',
        rating: 5,
        text: '"A surprisingly peaceful escape from the city. The guided tour was excellent and we learned so much."',
        author: 'Sarah A.',
        time: '2 weeks ago',
        avatarText: 'SA',
      },
      {
        id: 'r2',
        rating: 5,
        text: '"Beautifully maintained space and friendly guides. Highly recommended!"',
        author: 'Mark J.',
        time: '1 month ago',
        avatarText: 'MJ',
      },
    ],
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Image Area */}
        <View style={styles.imageHeaderContainer}>
          <Image source={{ uri: selectedTrip.image }} style={styles.headerImage} />
          
          <SafeAreaView style={styles.headerTopOverlay} edges={['top']}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#1E293B" />
            </TouchableOpacity>

            <Text style={styles.headerNavTitle}>Destination Details</Text>

            <TouchableOpacity style={styles.iconCircle}>
              <Ionicons name="heart-outline" size={20} color="#1E293B" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* Content Sheet */}
        <View style={styles.contentSheet}>
          {/* Badge & Location */}
          <View style={styles.metaRow}>
            <View style={styles.badgeContainer}>
              <Ionicons name="leaf" size={12} color="#1E5642" style={{ marginRight: 4 }} />
              <Text style={styles.badgeText}>{selectedTrip.badge}</Text>
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.locationText}>{selectedTrip.location}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{selectedTrip.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{selectedTrip.description}</Text>

          {/* Key Info Cards */}
          <View style={styles.infoCardsRow}>
            <View style={[styles.infoCard, { flex: 1, marginRight: 8 }]}>
              <Ionicons name="time-outline" size={18} color="#1E5642" />
              <Text style={styles.infoLabel}>OPENING HOURS</Text>
              <Text style={styles.infoValue}>{selectedTrip.openingHours}</Text>
            </View>

            <View style={[styles.infoCard, { flex: 1, marginLeft: 8 }]}>
              <Ionicons name="wallet-outline" size={18} color="#1E5642" />
              <Text style={styles.infoLabel}>ENTRY FEE</Text>
              <Text style={styles.infoValue}>{selectedTrip.price}</Text>
            </View>
          </View>

          <View style={styles.infoCardFull}>
            <Ionicons name="sunny-outline" size={18} color="#1E5642" />
            <Text style={styles.infoLabel}>BEST TIME</Text>
            <Text style={styles.infoValue}>{selectedTrip.bestTime}</Text>
          </View>

          {/* Positive Impact Card */}
          <View style={styles.impactCard}>
            <View style={styles.impactIconCircle}>
              <Ionicons name="leaf-outline" size={20} color="#E2EFE9" />
            </View>
            <View style={styles.impactContent}>
              <Text style={styles.impactTitle}>Positive Impact</Text>
              <Text style={styles.impactText}>{selectedTrip.positiveImpact}</Text>
            </View>
          </View>

          {/* Facilities Section */}
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilitiesRow}>
            {selectedTrip.facilities.map((fac: any, index: number) => (
              <View key={index} style={styles.facilityItem}>
                <View style={styles.facilityIconCircle}>
                  <Ionicons name={fac.icon as any} size={20} color="#1E5642" />
                </View>
                <Text style={styles.facilityName}>{fac.name}</Text>
              </View>
            ))}
          </View>

          {/* Location / Map Section */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <Image source={{ uri: selectedTrip.mapImage }} style={styles.mapImage} />
            <TouchableOpacity
              style={styles.openMapBtn}
              onPress={() =>
                Linking.openURL(
                  `https://maps.google.com/?q=${encodeURIComponent(selectedTrip.location)}`
                )
              }
            >
              <Ionicons name="open-outline" size={14} color="#1E293B" style={{ marginRight: 6 }} />
              <Text style={styles.openMapText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Visitor Reviews Section */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Visitor Reviews</Text>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingScore}>{selectedTrip.rating}</Text>
              <Ionicons name="star" size={14} color="#1E5642" style={{ marginLeft: 4 }} />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsScroll}>
            {selectedTrip.reviews.map((rev: any) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.starsRow}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Ionicons key={i} name="star" size={12} color="#D97706" style={{ marginRight: 2 }} />
                  ))}
                </View>
                <Text style={styles.reviewText}>{rev.text}</Text>

                <View style={styles.authorRow}>
                  <View style={styles.authorAvatar}>
                    <Text style={styles.avatarText}>{rev.avatarText}</Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>{rev.author}</Text>
                    <Text style={styles.reviewTime}>{rev.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageHeaderContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTopOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerNavTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  contentSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -28,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E5642',
    letterSpacing: 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    lineHeight: 32,
    marginBottom: 12,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 20,
  },
  infoCardsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#F3FAF7',
    borderRadius: 14,
    padding: 14,
  },
  infoCardFull: {
    backgroundColor: '#F3FAF7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  impactCard: {
    backgroundColor: '#1E4638',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  impactIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  impactContent: {
    flex: 1,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  impactText: {
    fontSize: 12,
    color: '#D1E5DD',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 14,
  },
  facilitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  facilityItem: {
    alignItems: 'center',
    width: (width - 40) / 4 - 8,
  },
  facilityIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F3FAF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  facilityName: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  mapContainer: {
    height: 160,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 24,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  openMapBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  openMapText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },
  reviewsScroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewCard: {
    backgroundColor: '#F8FAF9',
    borderRadius: 16,
    padding: 14,
    width: width * 0.65,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  reviewTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
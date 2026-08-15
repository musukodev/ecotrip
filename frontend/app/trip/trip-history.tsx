import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TRIPS = [
  {
    id: '1',
    title: 'Batam - Singapore',
    date: '12-14 Sep 2023',
    score: '92 Eco',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=400',
  },
  {
    id: '2',
    title: 'Bali Eco Retreat',
    date: '05-10 Aug 2023',
    score: '98 Eco',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=400',
  },
  {
    id: '3',
    title: 'Lombok Adventure',
    date: '22-26 Jun 2023',
    score: '85 Eco',
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=400',
  },
];

export default function TripHistoryScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#0B3C26" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EcoTraveler</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300' }}
          style={styles.avatarMini}
        />
      </View>

      <Text style={styles.mainTitle}>Trip History</Text>
      <Text style={styles.subtitle}>
        Review your past journeys and environmental impact.
      </Text>

      {/* Trip Cards */}
      {TRIPS.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: '/trip/trip-details',
              params: { id: item.id },
            })
          }
        >
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDate}>{item.date}</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badgeGray}>
                <Text style={styles.badgeGrayText}>Completed</Text>
              </View>
              <View style={styles.badgeEco}>
                <Ionicons name="leaf" size={12} color="#FFFFFF" />
                <Text style={styles.badgeEcoText}>{item.score}</Text>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2FBF7',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B3C26',
  },
  avatarMini: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0B3C26',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    elevation: 1,
  },
  cardImage: {
    width: 80,
    height: 75,
    borderRadius: 14,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B3C26',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeGray: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeGrayText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  badgeEco: {
    backgroundColor: '#0B3C26',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeEcoText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TripDetailsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#0B3C26" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Summary Card */}
        <View style={styles.dateBar}>
          <Text style={styles.dateBarText}>📅 12-14 Sep 2023</Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.iconCircle}>
              <Ionicons name="people" size={18} color="#0B3C26" />
            </View>
            <View>
              <Text style={styles.summaryLabel}>TRAVELLERS</Text>
              <Text style={styles.summaryValue}>2 People</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#475569' }]}>
              <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '700' }}>85</Text>
            </View>
            <View>
              <Text style={styles.summaryLabel}>ECO SCORE</Text>
              <Text style={styles.summaryValue}>Excellent</Text>
            </View>
          </View>
        </View>

        {/* Section Title */}
        <Text style={styles.sectionTitle}>Itinerary History</Text>

        {/* Day 1 */}
        <View style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>DAY 1</Text>
            </View>
            <Text style={styles.dayDate}>12 Sep</Text>
          </View>
          <Text style={styles.dayTitle}>Batam Arrival</Text>

          <View style={styles.activityItem}>
            <Ionicons name="location-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Check-in at Montigo Resorts</Text>
              <Text style={styles.activitySub}>Nongsa, Batam</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="restaurant-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Dinner at Kelong Seafood</Text>
              <Text style={styles.activitySub}>Local sustainable dining</Text>
            </View>
          </View>
        </View>

        {/* Day 2 */}
        <View style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>DAY 2</Text>
            </View>
            <Text style={styles.dayDate}>13 Sep</Text>
          </View>
          <Text style={styles.dayTitle}>Cross to Singapore</Text>

          <View style={styles.activityItem}>
            <Ionicons name="boat-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Ferry to HarbourFront</Text>
              <Text style={styles.activitySub}>Batam Fast Ferry</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="leaf-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Gardens by the Bay</Text>
              <Text style={styles.activitySub}>Cloud Forest & Flower Dome</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="business-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Marina Bay Sands</Text>
              <Text style={styles.activitySub}>Observation Deck</Text>
            </View>
          </View>
        </View>

        {/* Day 3 */}
        <View style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>DAY 3</Text>
            </View>
            <Text style={styles.dayDate}>14 Sep</Text>
          </View>
          <Text style={styles.dayTitle}>Return Journey</Text>

          <View style={styles.activityItem}>
            <Ionicons name="bag-handle-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Souvenir Shopping</Text>
              <Text style={styles.activitySub}>Bugis Street</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <Ionicons name="boat-outline" size={16} color="#64748B" />
            <View style={{ flex: 1 }}>
              <Text style={styles.activityTitle}>Return Ferry to Batam</Text>
              <Text style={styles.activitySub}>HarbourFront Centre</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2FBF7' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 14 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0B3C26' },
  content: { padding: 20, paddingBottom: 40 },
  dateBar: { backgroundColor: '#E2E8F0', padding: 10, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  dateBarText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 1 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E6F4EA', justifyContent: 'center', alignItems: 'center' },
  summaryLabel: { fontSize: 10, fontWeight: '700', color: '#64748B', letterSpacing: 0.5 },
  summaryValue: { fontSize: 15, fontWeight: '700', color: '#0B3C26', marginTop: 1 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0B3C26', marginBottom: 14 },
  dayCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 14, elevation: 1 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  dayBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dayBadgeText: { fontSize: 10, fontWeight: '700', color: '#0B3C26' },
  dayDate: { fontSize: 12, color: '#64748B' },
  dayTitle: { fontSize: 16, fontWeight: '700', color: '#0B3C26', marginBottom: 12 },
  activityItem: { flexDirection: 'row', gap: 10, marginTop: 10, alignItems: 'flex-start' },
  activityTitle: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  activitySub: { fontSize: 11, color: '#64748B', marginTop: 1 },
});
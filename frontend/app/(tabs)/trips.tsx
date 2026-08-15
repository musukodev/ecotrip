import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { tripService, Trip } from '@/services/tripService';
import { Colors } from '@/constants/theme';

export default function TripsScreen() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = async () => {
    try {
      const data = await tripService.getTrips();
      setTrips(data);
    } catch {
      Alert.alert('Error', 'Gagal memuat trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTrips(); }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={trips.length === 0 ? styles.empty : styles.list}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Belum ada trip. Buat sekarang!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDest}>{item.destination}</Text>
            <Text style={styles.cardDate}>
              {item.start_date} — {item.end_date}
            </Text>
            <Text style={styles.carbon}>{item.carbon_footprint} kg CO₂</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+ Trip Baru</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1 },
  list: { padding: 16 },
  emptyText: { color: Colors.textMuted, fontSize: 16 },
  card: {
    backgroundColor: Colors.card, borderRadius: 12, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary, marginBottom: 4 },
  cardDest: { fontSize: 14, color: Colors.textSecondary, marginBottom: 2 },
  cardDate: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
  carbon: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    backgroundColor: Colors.primary, borderRadius: 24,
    paddingVertical: 14, paddingHorizontal: 24,
    elevation: 4,
  },
  fabText: { color: Colors.white, fontWeight: 'bold', fontSize: 15 },
});

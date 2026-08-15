import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Selamat datang di EcoTrip!</Text>
        <Text style={styles.heroSub}>Rencanakan perjalanan ramah lingkungan kamu.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Carbon Footprint Bulan Ini</Text>
        <Text style={styles.cardValue}>0 kg CO₂</Text>
        <Text style={styles.cardHint}>Mulai trip pertamamu!</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tips Eco Travel</Text>
        <Text style={styles.tip}>• Pilih transportasi umum daripada penerbangan jarak dekat</Text>
        <Text style={styles.tip}>• Bawa botol minum sendiri</Text>
        <Text style={styles.tip}>• Pilih akomodasi ramah lingkungan</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: {
    backgroundColor: Colors.primary, padding: 24,
    paddingTop: 32, paddingBottom: 32,
  },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: Colors.white, marginBottom: 6 },
  heroSub: { fontSize: 14, color: Colors.greenPale },
  card: {
    backgroundColor: Colors.card, margin: 16, marginTop: 0, marginBottom: 12,
    borderRadius: 12, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardTitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },
  cardHint: { fontSize: 12, color: Colors.placeholder, marginTop: 4 },
  tip: { fontSize: 14, color: Colors.textSecondary, marginBottom: 6 },
});

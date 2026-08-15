import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Keluar', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>
      <Text style={styles.name}>Pengguna EcoTrip</Text>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: '#f5f5f5' },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#b7e4c7', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 48 },
  name: { fontSize: 20, fontWeight: 'bold', color: '#1b4332', marginBottom: 32 },
  logoutBtn: {
    backgroundColor: '#e63946', borderRadius: 8,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

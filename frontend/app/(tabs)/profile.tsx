import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';
import { Colors } from '@/constants/theme';

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
  container: { flex: 1, alignItems: 'center', paddingTop: 60, backgroundColor: Colors.background },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.greenPale, alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  avatarText: { fontSize: 48 },
  name: { fontSize: 20, fontWeight: 'bold', color: Colors.primary, marginBottom: 32 },
  logoutBtn: {
    backgroundColor: Colors.danger, borderRadius: 8,
    paddingVertical: 14, paddingHorizontal: 32,
  },
  logoutText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
});

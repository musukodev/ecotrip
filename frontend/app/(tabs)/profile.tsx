import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/"); // ganti sesuai route home/tab kamu, misal '/(tabs)/home'
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#0B3C26" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Profile Card */}
      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>Senja Utama</Text>
        <Text style={styles.userEmail}>senja.utama@example.com</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>EDIT PROFILE</Text>
        </TouchableOpacity>
      </View>

      {/* Travel History Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Travel History</Text>
      </View>

      {/* Item 1 */}
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => router.push("/trip/trip-details")}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="airplane-outline" size={20} color="#0B3C26" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Batam - Singapore</Text>
            <Text style={styles.cardDate}>📅 12-14 Sep 2023</Text>
          </View>
        </View>
        <View style={styles.badgeCompleted}>
          <Text style={styles.badgeCompletedText}>COMPLETED</Text>
        </View>
      </TouchableOpacity>

      {/* Item 2 */}
      <TouchableOpacity
        style={styles.historyCard}
        onPress={() => router.push("/trip/trip-details")}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="leaf-outline" size={20} color="#0B3C26" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Bali Eco Retreat</Text>
            <Text style={styles.cardDate}>📅 05-10 Aug 2023</Text>
          </View>
        </View>
        <View style={styles.badgeCompleted}>
          <Text style={styles.badgeCompletedText}>COMPLETED</Text>
        </View>
      </TouchableOpacity>

      {/* View All Trips Link */}
      <TouchableOpacity
        style={styles.viewAllBtn}
        onPress={() => router.push("/trip/trip-history")}
      >
        <Text style={styles.viewAllText}>View All Trips</Text>
        <Ionicons name="arrow-forward" size={16} color="#0B3C26" />
      </TouchableOpacity>

      {/* Account Settings */}
      <View style={[styles.sectionHeader, styles.accountHeader]}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
      </View>

      <TouchableOpacity style={styles.logoutCard}>
        <Ionicons name="log-out-outline" size={22} color="#E53E3E" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBF7",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0B3C26",
  },
  iconBtn: {
    padding: 4,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0B3C26",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 14,
  },
  editBtn: {
    backgroundColor: "#0B3C26",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  editBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 8,
    marginBottom: 14,
  },
  accountHeader: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B3C26",
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E6F4EA",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0B3C26",
  },
  cardDate: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },
  badgeCompleted: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeCompletedText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#92400E",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginVertical: 8,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0B3C26",
  },
  logoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#E53E3E",
  },
});

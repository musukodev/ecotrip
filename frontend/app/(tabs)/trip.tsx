import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TRIPS_DATA = [
  {
    id: "1",
    title: "Rempang Mangrove",
    badge: "Eco-Badge",
    badgeColor: "#E2EFE9",
    badgeTextColor: "#0E4D3C",
    description: "Mangrove conservation and education trail, Batam",
    location: "Jl. Trans Barelang, Rempang, Batam",
    hours: "Open 08:00 - 17:00",
    phone: "+62 812-3456-7890",
  },
  {
    id: "2",
    title: "Batam Botanical Forest",
    badge: "Sustainable",
    badgeColor: "#E2EFE9",
    badgeTextColor: "#0E4D3C",
    description: "Tropical flora collection and nature walks",
    location: "Sembulang, Galang, Batam City",
    hours: "Open 09:00 - 18:00",
    phone: "+62 811-7777-8888",
  },
  {
    id: "3",
    title: "Ocarina Coast",
    badge: "Local Heritage",
    badgeColor: "#FDF3E6",
    badgeTextColor: "#C07D2B",
    description: "Cultural performances and scenic sea views",
    location: "Sadai, Bengkong, Batam City",
    hours: "Open 08:00 - 22:00",
    phone: "+62 778-456-789",
  },
];

export default function TripScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Nature");

  const categories = [
    { name: "Nature", icon: "leaf-outline" },
    { name: "Culture", icon: "home-outline" },
    { name: "Culinary", icon: "restaurant-outline" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.brandTitle}>EcoTravel</Text>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-outline" size={20} color="#0E4D3C" />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <View style={styles.categoryContainer}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setActiveCategory(cat.name)}
              >
                <Ionicons
                  name={cat.icon as any}
                  size={16}
                  color={isActive ? "#FFFFFF" : "#0E4D3C"}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cards List */}
        {TRIPS_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.imagePlaceholder} />
              <View style={styles.cardInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View
                    style={[styles.badge, { backgroundColor: item.badgeColor }]}
                  >
                    <Ionicons
                      name="shield-checkmark"
                      size={10}
                      color={item.badgeTextColor}
                      style={{ marginRight: 2 }}
                    />
                    <Text
                      style={[styles.badgeText, { color: item.badgeTextColor }]}
                    >
                      {item.badge}
                    </Text>
                  </View>
                </View>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>

            {/* Metadata Rows */}
            <View style={styles.metaContainer}>
              <View style={styles.metaRow}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.location}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.hours}</Text>
              </View>
              <View style={styles.metaRow}>
                <Ionicons name="call-outline" size={14} color="#666" />
                <Text style={styles.metaText}>{item.phone}</Text>
              </View>
            </View>

            {/* View Details Link -> Mengarah ke app/trip/[id].tsx */}
            <TouchableOpacity
              style={styles.viewDetailBtn}
              onPress={() => router.push(`/trip/${item.id}`)}
            >
              <Text style={styles.viewDetailText}>View Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F9F6" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 16,
  },
  brandTitle: { fontSize: 22, fontWeight: "800", color: "#0E4D3C" },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0ECE8",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: { flexDirection: "row", marginBottom: 16 },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D0E3DC",
    marginRight: 8,
    backgroundColor: "#FFFFFF",
  },
  categoryPillActive: { backgroundColor: "#0E4D3C", borderColor: "#0E4D3C" },
  categoryText: { fontSize: 13, fontWeight: "600", color: "#0E4D3C" },
  categoryTextActive: { color: "#FFFFFF" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: { flexDirection: "row", marginBottom: 12 },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#688B82",
    marginRight: 12,
  },
  cardInfo: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1A1A1A", flex: 1 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: { fontSize: 10, fontWeight: "700" },
  cardDescription: { fontSize: 12, color: "#666", marginTop: 4 },
  metaContainer: { marginBottom: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { fontSize: 12, color: "#555", marginLeft: 6 },
  viewDetailBtn: { alignItems: "center", paddingVertical: 4 },
  viewDetailText: { fontSize: 13, fontWeight: "700", color: "#0E4D3C" },
});

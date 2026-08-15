import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { destinationService, Destination } from "@/services/destinationService";

export default function TripScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("nature");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const categories = [
    { key: "nature", name: "Nature", icon: "leaf-outline" },
    { key: "culture", name: "Culture", icon: "color-palette-outline" },
    { key: "culinary", name: "Culinary", icon: "restaurant-outline" },
    { key: "adventure", name: "Adventure", icon: "walk-outline" },
    { key: "shopping", name: "Shopping", icon: "bag-handle-outline" },
    { key: "relaxation", name: "Relaxation", icon: "body-outline" },
  ];

  const fetchDestinations = async (cat: string) => {
    try {
      setLoading(true);
      const data = await destinationService.getDestinations(cat);
      setDestinations(data);
    } catch (e) {
      console.error("Failed to load destinations", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDestinations(activeCategory);
  }, [activeCategory]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDestinations(activeCategory);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#0E4D3C"]} />}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <Text style={styles.brandTitle}>EcoTravel Batam</Text>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-outline" size={20} color="#0E4D3C" />
          </TouchableOpacity>
        </View>

        {/* Category Pills (Horizontal Scroll) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                key={cat.key}
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setActiveCategory(cat.key)}
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
        </ScrollView>

        {/* Loading Spinner */}
        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0E4D3C" />
          </View>
        ) : destinations.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.emptyText}>Belum ada destinasi di kategori ini.</Text>
          </View>
        ) : (
          /* Cards List */
          destinations.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                {item.photos && item.photos[0] ? (
                  <Image source={{ uri: item.photos[0] }} style={styles.imagePlaceholder} />
                ) : (
                  <View style={styles.imagePlaceholder} />
                )}
                <View style={styles.cardInfo}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <View style={styles.badge}>
                      <Ionicons
                        name="shield-checkmark"
                        size={10}
                        color="#0E4D3C"
                        style={{ marginRight: 2 }}
                      />
                      <Text style={styles.badgeText}>
                        Eco {item.eco_score ? item.eco_score.toFixed(1) : "N/A"}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardDescription} numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
              </View>

              {/* Metadata Rows */}
              <View style={styles.metaContainer}>
                <View style={styles.metaRow}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.metaText}>{item.location}</Text>
                </View>
                {item.opening_hours && (
                  <View style={styles.metaRow}>
                    <Ionicons name="time-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.opening_hours}</Text>
                  </View>
                )}
                {item.phone && (
                  <View style={styles.metaRow}>
                    <Ionicons name="call-outline" size={14} color="#666" />
                    <Text style={styles.metaText}>{item.phone}</Text>
                  </View>
                )}
              </View>

              {/* View Details Link */}
              <TouchableOpacity
                style={styles.viewDetailBtn}
                onPress={() => router.push(`/trip/${item.id}`)}
              >
                <Text style={styles.viewDetailText}>View Details</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F9F6" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  center: { paddingVertical: 40, alignItems: "center", justifyContent: "center" },
  emptyText: { color: "#888", fontSize: 14 },
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
    backgroundColor: "#E2EFE9",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#0E4D3C" },
  cardDescription: { fontSize: 12, color: "#666", marginTop: 4 },
  metaContainer: { marginBottom: 12 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  metaText: { fontSize: 12, color: "#555", marginLeft: 6 },
  viewDetailBtn: { alignItems: "center", paddingVertical: 4 },
  viewDetailText: { fontSize: 13, fontWeight: "700", color: "#0E4D3C" },
});

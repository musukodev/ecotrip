import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Colors = {
  primary: '#0D2B22',
  background: '#F4F7F4',
  card: '#FFFFFF',
  cardGreen: '#EEF5F1',
  tabBackground: '#E4EBE3',
  textPrimary: '#0D2B22',
  textSecondary: '#5A6E65',
  textMuted: '#8C98A4',
  border: '#D8E3DD',
  sun: '#F5A623',
  white: '#FFFFFF',
  gold: '#FBC02D',
};

export default function MyTripDetailScreen() {
  const router = useRouter();

  const [mainTab, setMainTab] = useState<'itinerary' | 'costs'>('itinerary');
  const [subTab, setSubTab] = useState<'trip' | 'crossing'>('trip');
  const [selectedDay, setSelectedDay] = useState('D2');

  return (
    <View style={styles.container}>
      {/* 1. Header Navigation Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>
            {mainTab === 'costs' ? 'Singapore-Batam' : 'Batam – Singapore'}
          </Text>
          {mainTab === 'itinerary' && (
            <Text style={styles.headerSubtitle}>v3 · View history</Text>
          )}
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          {mainTab === 'costs' ? (
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300' }}
              style={styles.headerAvatar}
            />
          ) : (
            <Ionicons name="share-outline" size={18} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Main Tab Switcher */}
      <View style={styles.topTabBarContainer}>
        <View style={styles.topTabBar}>
          <TouchableOpacity
            style={[styles.topTabBtn, mainTab === 'itinerary' && styles.topTabBtnActive]}
            onPress={() => setMainTab('itinerary')}
          >
            <Text style={[styles.topTabText, mainTab === 'itinerary' && styles.topTabTextActive]}>
              Itinerary
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topTabBtn, mainTab === 'costs' && styles.topTabBtnActive]}
            onPress={() => setMainTab('costs')}
          >
            <Text style={[styles.topTabText, mainTab === 'costs' && styles.topTabTextActive]}>
              Costs
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TAMPILAN TAB: COSTS */}
        {mainTab === 'costs' ? (
          <View>
            {/* Total Estimated Cost Card */}
            <View style={styles.totalCostCard}>
              <Text style={styles.totalCostLabel}>ESTIMATED TOTAL</Text>
              <Text style={styles.totalCostValue}>$ 150 - 250</Text>
              <View style={styles.ecoImpactBadge}>
                <Ionicons name="leaf-outline" size={12} color={Colors.white} />
                <Text style={styles.ecoImpactText}>High Eco-Impact Trip</Text>
              </View>
            </View>

            {/* Bookable Expenses Title */}
            <Text style={styles.sectionTitle}>Bookable Expenses</Text>

            {/* Card 1: Ferry Crossing */}
            <View style={styles.expenseCard}>
              <View style={styles.expenseImageWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600' }}
                  style={styles.expenseImage}
                />
                <View style={styles.imageOverlayBadge}>
                  <Ionicons name="boat-outline" size={12} color={Colors.white} />
                  <Text style={styles.imageOverlayText}>Ferry Crossing</Text>
                </View>
              </View>
              <View style={styles.expenseContent}>
                <View style={styles.expenseRow}>
                  <Text style={styles.expenseTitle}>Eco-Friendly Vessel</Text>
                  <Text style={styles.expensePrice}>$70.00</Text>
                </View>
                <Text style={styles.expenseSub}>Singapore → Batam (Return)</Text>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>BOOK TICKET</Text>
                  <Ionicons name="open-outline" size={12} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.redirectText}>Redirects to external booking platform</Text>
              </View>
            </View>

            {/* Card 2: Accommodation */}
            <View style={styles.expenseCard}>
              <View style={styles.expenseImageWrapper}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600' }}
                  style={styles.expenseImage}
                />
                <View style={styles.imageOverlayBadge}>
                  <Ionicons name="bed-outline" size={12} color={Colors.white} />
                  <Text style={styles.imageOverlayText}>Accommodation</Text>
                </View>
              </View>
              <View style={styles.expenseContent}>
                <View style={styles.expenseRow}>
                  <Text style={styles.expenseTitle}>Nirwana Eco Resort</Text>
                  <Text style={styles.expensePrice}>$120.00 / night</Text>
                </View>
                <Text style={styles.expenseSub}>Estimated for 2 nights</Text>
                <TouchableOpacity style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>BOOK NOW</Text>
                  <Ionicons name="open-outline" size={12} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.redirectText}>Redirects to external booking platform</Text>
              </View>
            </View>
          </View>
        ) : (
          /* TAMPILAN TAB: ITINERARY */
          <View>
            {/* AI Validation Badge */}
            <View style={styles.aiBanner}>
              <Ionicons name="checkmark-sharp" size={14} color={Colors.primary} />
              <Text style={styles.aiBannerText}>
                AI Validated · distance, time & emissions checked
              </Text>
            </View>

            {/* Map View Card */}
            <View style={styles.mapContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=600' }}
                style={styles.mapImage}
              />
              <View style={styles.mapBadge}>
                <Text style={styles.mapBadgeText}>Map View</Text>
              </View>
              <TouchableOpacity style={styles.locationPinBtn}>
                <Ionicons name="compass-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Sub-Tab Switcher */}
            <View style={styles.subTabWrapper}>
              <View style={styles.subTabBar}>
                <TouchableOpacity
                  style={[styles.subTabBtn, subTab === 'trip' && styles.subTabBtnActive]}
                  onPress={() => setSubTab('trip')}
                >
                  <Text style={[styles.subTabText, subTab === 'trip' && styles.subTabTextActive]}>
                    Trip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.subTabBtn, subTab === 'crossing' && styles.subTabBtnActive]}
                  onPress={() => setSubTab('crossing')}
                >
                  <Text style={[styles.subTabText, subTab === 'crossing' && styles.subTabTextActive]}>
                    Crossing
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* KONTEN SUB-TAB: CROSSING */}
            {subTab === 'crossing' ? (
              <View style={styles.crossingContainer}>
                {/* DEPARTURE */}
                <Text style={styles.sectionHeaderTitle}>DEPARTURE</Text>
                <View style={styles.crossingRow}>
                  <Text style={styles.timelineTime}>07:30</Text>
                  <View style={styles.timelineDot} />
                  <View style={styles.activityCard}>
                    <Text style={styles.activityTitle}>Singapore → Batam</Text>
                    <View style={styles.crossingMetaRow}>
                      <Text style={styles.crossingMetaText}>🚢 Eco-Friendly Vessel</Text>
                      <Text style={styles.crossingMetaText}>•  💺 Seat 12C</Text>
                    </View>
                    <View style={styles.ecoBadgePill}>
                      <Ionicons name="leaf" size={10} color={Colors.primary} />
                      <Text style={styles.ecoBadgePillText}>Eco-Certified Route</Text>
                    </View>
                    <View style={styles.crossingFooter}>
                      <Text style={styles.gateText}>⏰ Gate closes 07:15</Text>
                      <TouchableOpacity style={styles.darkBookBtn}>
                        <Text style={styles.darkBookBtnText}>Book Ticket</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* RETURN */}
                <Text style={[styles.sectionHeaderTitle, { marginTop: 16 }]}>RETURN</Text>
                <View style={styles.crossingRow}>
                  <Text style={styles.timelineTime}>18:00</Text>
                  <View style={[styles.timelineDot, { backgroundColor: '#A0AEC0' }]} />
                  <View style={styles.activityCard}>
                    <Text style={styles.activityTitle}>Batam → Singapore</Text>
                    <View style={styles.crossingMetaRow}>
                      <Text style={styles.crossingMetaText}>🚢 Eco-Friendly Vessel</Text>
                      <Text style={styles.crossingMetaText}>•  💺 Seat 12C</Text>
                    </View>
                    <View style={styles.ecoBadgePill}>
                      <Ionicons name="leaf" size={10} color={Colors.primary} />
                      <Text style={styles.ecoBadgePillText}>Eco-Certified Route</Text>
                    </View>
                    <View style={styles.crossingFooter}>
                      <Text style={styles.gateText}>⏰ Check-in by 17:30</Text>
                      <TouchableOpacity style={styles.outlineBookBtn}>
                        <Text style={styles.outlineBookBtnText}>Book Ticket</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              /* KONTEN SUB-TAB: TRIP */
              <View>
                {/* Day Selector */}
                <View style={styles.daySelectorContainer}>
                  <View style={styles.dayDashedLine} />
                  <View style={styles.dayCirclesRow}>
                    {['D1', 'D2', 'D3'].map((day) => {
                      const active = selectedDay === day;
                      return (
                        <TouchableOpacity
                          key={day}
                          style={[styles.dayCircle, active && styles.dayCircleActive]}
                          onPress={() => setSelectedDay(day)}
                        >
                          <Text style={[styles.dayCircleText, active && styles.dayCircleTextActive]}>
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Weather Info Card */}
                <View style={styles.weatherCard}>
                  <View style={styles.weatherLeft}>
                    <Ionicons name="sunny" size={28} color={Colors.sun} />
                    <View style={styles.weatherTextGroup}>
                      <Text style={styles.weatherTemp}>29°C</Text>
                      <Text style={styles.weatherDesc}>Partly cloudy</Text>
                    </View>
                  </View>
                  <View style={styles.weatherRight}>
                    <Text style={styles.weatherHumidityLabel}>Humidity</Text>
                    <Text style={styles.weatherHumidityValue}>75%</Text>
                  </View>
                </View>

                {/* Activities Timeline List */}
                <View style={styles.timelineContainer}>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineTime}>10:30</Text>
                    <View style={styles.timelineDot} />
                    <View style={styles.activityCard}>
                      <Text style={styles.activityTitle}>Gardens by the Bay</Text>
                      <View style={styles.tagPill}>
                        <Text style={styles.tagPillText}>Nature</Text>
                      </View>
                      <Text style={styles.activityDescription}>
                        Explore Cloud Forest & Supertree Grove.
                      </Text>
                      <View style={styles.activityFooter}>
                        <Text style={styles.validatedText}>Distance & emission validated</Text>
                        <TouchableOpacity style={styles.changeBtn}>
                          <Text style={styles.changeBtnText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineTime}>15:00</Text>
                    <View style={styles.timelineDot} />
                    <View style={styles.activityCard}>
                      <Text style={styles.activityTitle}>Check-in Hotel Eco Bay</Text>
                      <View style={styles.badgePill}>
                        <Text style={styles.badgePillText}>Accommodation · Badge</Text>
                        <Ionicons name="leaf" size={12} color={Colors.primary} />
                      </View>
                      <Text style={styles.activityDescription}>
                        Green certified hotel near Marina Bay.
                      </Text>
                      <View style={styles.activityFooter}>
                        <Text style={styles.validatedText}>Distance & emission validated</Text>
                        <TouchableOpacity style={styles.changeBtn}>
                          <Text style={styles.changeBtnText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity style={styles.fabChat}>
        <Ionicons name="chatbox-ellipses" size={20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6ECE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  topTabBarContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  topTabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBackground,
    borderRadius: 12,
    padding: 3,
  },
  topTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  topTabBtnActive: {
    backgroundColor: Colors.primary,
  },
  topTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  topTabTextActive: {
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 90,
  },
  aiBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DDECE4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
    alignSelf: 'center',
  },
  aiBannerText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  mapContainer: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  locationPinBtn: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTabWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBackground,
    borderRadius: 16,
    padding: 3,
    width: 170,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 14,
  },
  subTabBtnActive: {
    backgroundColor: Colors.white,
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  subTabTextActive: {
    color: Colors.primary,
  },
  daySelectorContainer: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  dayDashedLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderWidth: 1,
    borderColor: '#C2D1C9',
    borderStyle: 'dashed',
    top: '50%',
  },
  dayCirclesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  dayCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayCircleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  dayCircleTextActive: {
    color: Colors.white,
  },
  weatherCard: {
    backgroundColor: Colors.cardGreen,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0EBE4',
  },
  weatherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTextGroup: {
    marginLeft: 10,
  },
  weatherTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  weatherDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  weatherRight: {
    alignItems: 'flex-end',
  },
  weatherHumidityLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  weatherHumidityValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  timelineContainer: {
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  timelineTime: {
    width: 44,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 4,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginRight: 10,
  },
  activityCard: {
    flex: 1,
    backgroundColor: Colors.cardGreen,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0EBE4',
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  tagPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#D9E6DF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#D9E6DF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  activityDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 16,
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D8E3DD',
    paddingTop: 8,
  },
  validatedText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  changeBtn: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D8E3DD',
  },
  changeBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },
  fabChat: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  /* CROSSING STYLES */
  crossingContainer: {
    marginTop: 8,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  crossingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  crossingMetaRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  crossingMetaText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  ecoBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#D9E6DF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 12,
  },
  ecoBadgePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
  },
  crossingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#D8E3DD',
    paddingTop: 8,
  },
  gateText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  darkBookBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  darkBookBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.white,
  },
  outlineBookBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  outlineBookBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
  },

  /* COSTS TAB STYLES */
  totalCostCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  totalCostLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A3B8B0',
    letterSpacing: 1,
    marginBottom: 4,
  },
  totalCostValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 12,
  },
  ecoImpactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  ecoImpactText: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 12,
  },
  expenseCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 1,
  },
  expenseImageWrapper: {
    height: 120,
    width: '100%',
    position: 'relative',
  },
  expenseImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(13, 43, 34, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  imageOverlayText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  expenseContent: {
    padding: 14,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  expenseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  expensePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  expenseSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  bookBtn: {
    backgroundColor: Colors.gold,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    marginBottom: 6,
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  redirectText: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
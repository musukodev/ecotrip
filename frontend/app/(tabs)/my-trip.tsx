import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { tripService, TripFullResponse, Activity } from '@/services/tripService';
import { chatService, ChatMessage } from '@/services/chatService';
import { ratingService } from '@/services/ratingService';
import { destinationService, Destination } from '@/services/destinationService';
import { accommodationService, Accommodation } from '@/services/accommodationService';

export const Colors = {
  primary: '#0D2B22',
  primaryDark: '#071D17',
  accent: '#1C4A3E',
  green: '#2d6a4f',
  greenLight: '#40916c',
  greenSoft: '#74c69d',
  greenPale: '#b7e4c7',
  ocean: '#0077b6',
  oceanLight: '#48cae4',
  coral: '#e76f51',
  coralLight: '#f4a261',
  sun: '#F5A623',
  danger: '#e63946',
  background: '#F4F7F4',
  card: '#FFFFFF',
  cardGreen: '#EEF5F1',
  tabBackground: '#E4EBE3',
  textPrimary: '#0D2B22',
  textSecondary: '#4B5563',
  textMuted: '#8C98A4',
  placeholder: '#A0AEC0',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  white: '#FFFFFF',
  disabled: '#0D2B2280',
};

interface InterestOption {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'nature', label: 'Nature', icon: 'leaf-outline' },
  { id: 'culture', label: 'Culture', icon: 'color-palette-outline' },
  { id: 'culinary', label: 'Culinary', icon: 'restaurant-outline' },
  { id: 'adventure', label: 'Adventure', icon: 'walk-outline' },
  { id: 'shopping', label: 'Shopping', icon: 'bag-handle-outline' },
  { id: 'relaxation', label: 'Relaxation', icon: 'body-outline' },
];

const DEPARTURE_OPTIONS = ['Singapore', 'Malaysia'];
const ACCOMMODATION_OPTIONS = ['Hotel', 'Resort', 'Homestay', 'Glamping'];

function parseToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const parts = timeStr.split(':');
  const h = parseInt(parts[0], 10) || 0;
  const m = parseInt(parts[1], 10) || 0;
  return h * 60 + m;
}

function isActivityOngoing(activities: Activity[], index: number): boolean {
  if (!activities || activities.length === 0) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMin = parseToMinutes(activities[index].start_time);
  let endMin: number;
  if (index < activities.length - 1) {
    endMin = parseToMinutes(activities[index + 1].start_time);
  } else {
    const dur = activities[index].duration_minutes || 120;
    endMin = startMin + dur;
  }
  return currentMinutes >= startMin && currentMinutes < endMin;
}

function isActivityPassed(activities: Activity[], index: number): boolean {
  if (!activities || activities.length === 0) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const startMin = parseToMinutes(activities[index].start_time);
  let endMin: number;
  if (index < activities.length - 1) {
    endMin = parseToMinutes(activities[index + 1].start_time);
  } else {
    const dur = activities[index].duration_minutes || 120;
    endMin = startMin + dur;
  }
  return currentMinutes >= endMin;
}

export default function MyTripScreen() {
  const router = useRouter();

  // Active Trip State
  const [activeTripData, setActiveTripData] = useState<TripFullResponse | null>(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [mainTab, setMainTab] = useState<'itinerary' | 'costs'>('itinerary');
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cached Master Venues for fallback matching
  const [allDests, setAllDests] = useState<Destination[]>([]);
  const [allAccs, setAllAccs] = useState<Accommodation[]>([]);

  // Chat AI State
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  // Rating Modal State
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingTarget, setRatingTarget] = useState<{
    type: 'destination' | 'accommodation';
    id: number;
    title: string;
  } | null>(null);
  const [cleanliness, setCleanliness] = useState(5);
  const [envCondition, setEnvCondition] = useState(5);
  const [envCare, setEnvCare] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingRating, setSubmittingRating] = useState(false);

  // Form State
  const [isOutsideBatam, setIsOutsideBatam] = useState(true);
  const [departingFrom, setDepartingFrom] = useState('Singapore');
  const [days, setDays] = useState(3);
  const [pax, setPax] = useState(2);
  const [budget, setBudget] = useState(4000000);
  const [selectedAccomm, setSelectedAccomm] = useState('Hotel');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['nature', 'culinary']);
  const [notes, setNotes] = useState('');
  const [generating, setGenerating] = useState(false);

  const fetchVenues = async () => {
    try {
      const [dests, accs] = await Promise.all([
        destinationService.getDestinations(),
        accommodationService.getAccommodations(),
      ]);
      setAllDests(dests);
      setAllAccs(accs);
    } catch (e) {
      console.error('Failed to load master venues', e);
    }
  };

  const fetchActiveTrip = async () => {
    try {
      const trips = await tripService.getTrips();
      const active = trips.find((t) => t.status === 'active');
      if (active) {
        const full = await tripService.getTripFull(active.id);
        setActiveTripData(full);
      } else {
        setActiveTripData(null);
      }
    } catch (e) {
      console.error('Failed to load active trip', e);
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchActiveTrip();
      fetchVenues();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchActiveTrip();
    fetchVenues();
  };

  const toggleInterest = (interestId: string) => {
    if (selectedInterests.includes(interestId)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interestId));
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const finalAccomm = selectedAccomm.toLowerCase();
      const originCountry = isOutsideBatam ? (departingFrom.toLowerCase() as 'singapore' | 'malaysia') : '';
      const originPort = isOutsideBatam ? (departingFrom === 'Singapore' ? 'HarbourFront' : 'Stulang Laut (Johor)') : '';

      const titleTrip = isOutsideBatam
        ? `Trip Batam ${days}D (dari ${departingFrom})`
        : `Trip Eksplorasi Batam ${days}D (Lokal)`;

      const res = await tripService.createTrip({
        title: titleTrip,
        origin_country: originCountry,
        origin_port: originPort,
        duration_days: days,
        pax,
        budget: budget,
        interests: selectedInterests,
        accommodation_preference: finalAccomm,
        notes: notes.trim(),
      });

      if ('trip' in res && 'days' in res && res.trip && res.days) {
        setActiveTripData(res as TripFullResponse);
      } else {
        await fetchActiveTrip();
      }
      setSelectedDayIdx(0);
      setMainTab('itinerary');
    } catch (err: any) {
      console.error(err);
      // Cek apakah sebenarnya trip sudah berhasil dibuat di backend
      try {
        const trips = await tripService.getTrips();
        const active = trips.find((t) => t.status === 'active');
        if (active) {
          const full = await tripService.getTripFull(active.id);
          setActiveTripData(full);
          setSelectedDayIdx(0);
          setMainTab('itinerary');
          return;
        }
      } catch (_) {}

      const msg =
        err.response?.data?.error ||
        'Gagal membuat itinerary. Pastikan tidak ada trip aktif yang sedang berjalan.';
      Alert.alert('Gagal Membuat Itinerary', msg);
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenChat = async () => {
    if (!activeTripData?.trip?.id) return;
    setChatModalVisible(true);
    try {
      const msgs = await chatService.getChatHistory(activeTripData.trip.id);
      setChatMessages(msgs);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !activeTripData?.trip?.id) return;
    const msg = inputMessage.trim();
    const tripId = activeTripData.trip.id;
    setInputMessage('');

    const tempUserMsg: ChatMessage = {
      id: Date.now(),
      trip_id: tripId,
      sender: 'user',
      message: msg,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, tempUserMsg]);
    setSendingChat(true);

    try {
      const res = await chatService.sendMessage(tripId, msg);
      if (res.ai_message) {
        setChatMessages((prev) => [...prev, res.ai_message]);
      }
      if (res.is_revision) {
        fetchActiveTrip();
      }
    } catch (e) {
      console.error('Chat error', e);
    } finally {
      setSendingChat(false);
    }
  };

  const handleHentikanTrip = async () => {
    if (!activeTripData?.trip?.id) return;
    Alert.alert('Hentikan Trip', 'Apakah kamu yakin ingin menghentikan / mengarsipkan trip ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hentikan',
        style: 'destructive',
        onPress: async () => {
          try {
            await tripService.updateStatus(activeTripData.trip.id, 'archived');
            Alert.alert('Sukses', 'Trip telah dibatalkan. Sekarang kamu bisa membuat itinerary baru.');
            setActiveTripData(null);
          } catch (e) {
            Alert.alert('Gagal', 'Gagal menghentikan trip.');
          }
        },
      },
    ]);
  };

  const openRatingModal = (act: Activity) => {
    // 1. Direct ID if matched
    if (act.destination_id) {
      setRatingTarget({ type: 'destination', id: act.destination_id, title: act.title });
    } else if (act.accommodation_id) {
      setRatingTarget({ type: 'accommodation', id: act.accommodation_id, title: act.title });
    } else {
      // 2. Fuzzy fallback match from local list
      const actTitleLower = act.title.toLowerCase();
      const matchedDest = allDests.find(
        (d) => actTitleLower.includes(d.name.toLowerCase()) || d.name.toLowerCase().includes(actTitleLower)
      );
      if (matchedDest) {
        setRatingTarget({ type: 'destination', id: matchedDest.id, title: matchedDest.name });
      } else {
        const matchedAcc = allAccs.find(
          (a) => actTitleLower.includes(a.name.toLowerCase()) || a.name.toLowerCase().includes(actTitleLower)
        );
        if (matchedAcc) {
          setRatingTarget({ type: 'accommodation', id: matchedAcc.id, title: matchedAcc.name });
        } else if (allDests.length > 0) {
          // Fallback to first destination
          setRatingTarget({ type: 'destination', id: allDests[0].id, title: act.title });
        } else {
          Alert.alert('Info', 'Belum ada data destinasi untuk diberi rating.');
          return;
        }
      }
    }
    setCleanliness(5);
    setEnvCondition(5);
    setEnvCare(5);
    setReviewComment('');
    setRatingModalVisible(true);
  };

  const handleSendRating = async () => {
    if (!ratingTarget || !activeTripData?.trip?.id) return;
    setSubmittingRating(true);
    try {
      const res = await ratingService.submitRating({
        target_type: ratingTarget.type,
        target_id: ratingTarget.id,
        trip_id: activeTripData.trip.id,
        cleanliness,
        environmental_condition: envCondition,
        environmental_care: envCare,
        review_comment: reviewComment,
      });

      const score = res.rating?.calculated_score || ((cleanliness * 20 * 0.35) + (envCondition * 20 * 0.40) + (envCare * 20 * 0.25));
      Alert.alert(
        'Penilaian Berhasil!',
        `Terima kasih! Penilaian Eco Score kamu sebesar ${score.toFixed(1)}/100 telah berhasil disimpan dan mempengaruhi ranking rekomendasi Batam.`
      );
      setRatingModalVisible(false);
    } catch (e: any) {
      Alert.alert('Gagal', e.response?.data?.error || 'Gagal mengirim rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (initialLoading || generating) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {generating && (
          <Text style={{ marginTop: 14, color: Colors.primary, fontWeight: '700', fontSize: 15 }}>
            AI sedang merancang itinerary Batam kamu...
          </Text>
        )}
      </View>
    );
  }

  // =========================================================================
  // TAMPILAN JIKA SUDAH ADA TRIP AKTIF
  // =========================================================================
  if (activeTripData && activeTripData.trip) {
    const { trip, days: tripDays } = activeTripData;
    const currentDay = tripDays && tripDays.length > 0 ? (tripDays[selectedDayIdx] || tripDays[0]) : null;

    return (
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerActive}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitleActive}>{trip.title}</Text>
            <Text style={styles.headerSubtitleActive}>
              v{trip.current_version} · {trip.origin_port || 'Batam'} ➔ Batam
            </Text>
          </View>
          <TouchableOpacity style={styles.stopBtn} onPress={handleHentikanTrip}>
            <Ionicons name="stop-circle-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>

        {/* Main Tab Switcher */}
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
                Estimasi Biaya
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        >
          {mainTab === 'itinerary' ? (
            <View>
              {/* Days Pill Selector */}
              {tripDays && tripDays.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysScroll}>
                  {tripDays.map((d, index) => {
                    const active = selectedDayIdx === index;
                    return (
                      <TouchableOpacity
                        key={d.id}
                        style={[styles.dayPill, active && styles.dayPillActive]}
                        onPress={() => setSelectedDayIdx(index)}
                      >
                        <Text style={[styles.dayPillText, active && styles.dayPillTextActive]}>
                          Hari {d.day_number}
                        </Text>
                        <Text style={[styles.dayPillSub, active && styles.dayPillSubActive]}>
                          {d.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              {/* Weather & Eco Score Bar */}
              <View style={styles.infoBanner}>
                <View style={styles.bannerCol}>
                  <Ionicons name="leaf-outline" size={16} color={Colors.green} />
                  <Text style={styles.bannerText}>Sustainability {trip.sustainability_score}/100</Text>
                </View>
                <View style={styles.bannerCol}>
                  <Ionicons name="sunny-outline" size={16} color={Colors.sun} />
                  <Text style={styles.bannerText}>29°C · Batam</Text>
                </View>
              </View>

              {/* Activities List with Time Highlight & Rating Button */}
              {currentDay && currentDay.activities && currentDay.activities.length > 0 ? (
                currentDay.activities.map((act, index) => {
                  const isCurrent = isActivityOngoing(currentDay.activities, index);
                  const isPassed = isActivityPassed(currentDay.activities, index);

                  return (
                    <View
                      key={act.id}
                      style={[
                        styles.activityCard,
                        isCurrent && styles.activityCardHighlighted,
                        isPassed && styles.activityCardPassed,
                      ]}
                    >
                      <View
                        style={[
                          styles.timeTag,
                          isCurrent && styles.timeTagHighlighted,
                          isPassed && styles.timeTagPassed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timeText,
                            isCurrent && styles.timeTextHighlighted,
                            isPassed && styles.timeTextPassed,
                          ]}
                        >
                          {act.start_time ? act.start_time.substring(0, 5) : '08:00'}
                        </Text>
                        {isCurrent && <View style={styles.liveDot} />}
                        {isPassed && !isCurrent && (
                          <Ionicons name="checkmark-circle" size={12} color="#15803D" style={{ marginTop: 2 }} />
                        )}
                      </View>

                      <View style={styles.activityBody}>
                        <View style={styles.actHeader}>
                          <View style={{ flex: 1 }}>
                            {isCurrent && (
                              <View style={styles.ongoingBadge}>
                                <Ionicons name="time" size={10} color="#FFFFFF" />
                                <Text style={styles.ongoingBadgeText}>LOKASI SAAT INI</Text>
                              </View>
                            )}
                            {isPassed && !isCurrent && (
                              <View style={styles.passedBadge}>
                                <Ionicons name="checkmark" size={10} color="#15803D" />
                                <Text style={styles.passedBadgeText}>SUDAH DIKUNJUNGI</Text>
                              </View>
                            )}
                            <Text style={[styles.actTitle, isCurrent && styles.actTitleHighlighted]}>
                              {act.title}
                            </Text>
                          </View>
                          <View style={[styles.categoryBadge, isCurrent && styles.categoryBadgeHighlighted]}>
                            <Text style={[styles.categoryBadgeText, isCurrent && styles.categoryBadgeTextHighlighted]}>
                              {act.category}
                            </Text>
                          </View>
                        </View>

                        {act.description ? (
                          <Text style={[styles.actDesc, isCurrent && styles.actDescHighlighted]}>
                            {act.description}
                          </Text>
                        ) : null}

                        <View style={styles.actFooter}>
                          <Text style={[styles.actMeta, isCurrent && styles.actMetaHighlighted]}>
                            💰 Rp {act.estimated_cost.toLocaleString('id-ID')}
                          </Text>
                          <Text style={[styles.actMeta, isCurrent && styles.actMetaHighlighted]}>
                            ⏱️ {act.duration_minutes || 60} Menit
                          </Text>
                        </View>

                        {/* Tombol Beri Rating Eco */}
                        <TouchableOpacity
                          style={styles.ratingTriggerBtn}
                          onPress={() => openRatingModal(act)}
                        >
                          <Ionicons name="star" size={14} color="#D97706" />
                          <Text style={styles.ratingTriggerBtnText}>Beri Rating Eco Tempat Ini</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={styles.emptyActivity}>
                  <Text style={styles.emptyText}>Tidak ada aktivitas di hari ini.</Text>
                </View>
              )}
            </View>
          ) : (
            /* TAB ESTIMASI BIAYA */
            <View>
              <View style={styles.costCard}>
                <Text style={styles.costLabel}>ESTIMASI BIAYA TOTAL PERJALANAN</Text>
                <Text style={styles.costValue}>Rp {trip.total_estimated_cost.toLocaleString('id-ID')}</Text>
                <Text style={styles.budgetMeta}>
                  Budget Maksimal: Rp {trip.budget.toLocaleString('id-ID')} ({trip.pax} Orang)
                </Text>
              </View>

              <View style={styles.breakdownCard}>
                <Text style={styles.sectionHeading}>Rincian Alokasi Biaya</Text>
                {trip.ferry_cost_round_trip > 0 && (
                  <View style={styles.costRow}>
                    <Text style={styles.costRowLabel}>Tiket Feri PP ({trip.origin_port || 'Feri'} ➔ Batam)</Text>
                    <Text style={styles.costRowVal}>Rp {trip.ferry_cost_round_trip.toLocaleString('id-ID')}</Text>
                  </View>
                )}
                <View style={styles.costRow}>
                  <Text style={styles.costRowLabel}>Akomodasi, Kuliner & Tiket Wisata</Text>
                  <Text style={styles.costRowVal}>
                    Rp {(trip.total_estimated_cost - trip.ferry_cost_round_trip).toLocaleString('id-ID')}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Floating Chat Button */}
        <TouchableOpacity style={styles.chatFab} onPress={handleOpenChat}>
          <Ionicons name="chatbubbles" size={20} color="#FFFFFF" />
          <Text style={styles.chatFabText}>Tanya AI</Text>
        </TouchableOpacity>

        {/* Modal Pop-up Rating 3 Aspek (Kebersihan 35%, Lingkungan 40%, Peduli 25%) */}
        <Modal visible={ratingModalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.ratingSheetContainer}>
              <View style={styles.sheetHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sheetTitle}>Penilaian Eco Score</Text>
                  <Text style={styles.sheetSub} numberOfLines={1}>
                    {ratingTarget?.title}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setRatingModalVisible(false)}>
                  <Ionicons name="close" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ padding: 18 }} showsVerticalScrollIndicator={false}>
                {/* Aspek 1: Kebersihan */}
                <View style={styles.aspectBox}>
                  <View style={styles.aspectHeader}>
                    <Text style={styles.aspectTitle}>1. Kebersihan Lingkungan</Text>
                    <Text style={styles.aspectWeight}>(Bobot 35%)</Text>
                  </View>
                  <Text style={styles.aspectDesc}>Pengelolaan sampah, kebersihan toilet, dan area bebas puntung/plastik.</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity key={star} onPress={() => setCleanliness(star)} style={styles.starBtn}>
                        <Ionicons
                          name={cleanliness >= star ? 'star' : 'star-outline'}
                          size={28}
                          color={cleanliness >= star ? '#F59E0B' : '#CBD5E1'}
                        />
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.starLabel}>{cleanliness} / 5</Text>
                  </View>
                </View>

                {/* Aspek 2: Kondisi Lingkungan */}
                <View style={styles.aspectBox}>
                  <View style={styles.aspectHeader}>
                    <Text style={styles.aspectTitle}>2. Kondisi Lingkungan & Alam</Text>
                    <Text style={styles.aspectWeight}>(Bobot 40%)</Text>
                  </View>
                  <Text style={styles.aspectDesc}>Keasrian vegetasi, kualitas udara, minim polusi suara, dan kealamian tempat.</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity key={star} onPress={() => setEnvCondition(star)} style={styles.starBtn}>
                        <Ionicons
                          name={envCondition >= star ? 'star' : 'star-outline'}
                          size={28}
                          color={envCondition >= star ? '#F59E0B' : '#CBD5E1'}
                        />
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.starLabel}>{envCondition} / 5</Text>
                  </View>
                </View>

                {/* Aspek 3: Kepedulian Lingkungan */}
                <View style={styles.aspectBox}>
                  <View style={styles.aspectHeader}>
                    <Text style={styles.aspectTitle}>3. Kepedulian Lingkungan</Text>
                    <Text style={styles.aspectWeight}>(Bobot 25%)</Text>
                  </View>
                  <Text style={styles.aspectDesc}>Edukasi ramah lingkungan, produk lokal, hemat energi, dan dukungan konservasi.</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity key={star} onPress={() => setEnvCare(star)} style={styles.starBtn}>
                        <Ionicons
                          name={envCare >= star ? 'star' : 'star-outline'}
                          size={28}
                          color={envCare >= star ? '#F59E0B' : '#CBD5E1'}
                        />
                      </TouchableOpacity>
                    ))}
                    <Text style={styles.starLabel}>{envCare} / 5</Text>
                  </View>
                </View>

                {/* Komentar Ulasan */}
                <Text style={styles.fieldHeading}>Ulasan Singkat (Opsional)</Text>
                <TextInput
                  style={styles.reviewInput}
                  placeholder="Bagikan pengalaman ramah lingkungan kamu di tempat ini..."
                  value={reviewComment}
                  onChangeText={setReviewComment}
                  multiline
                  numberOfLines={3}
                />

                {/* Tombol Kirim */}
                <TouchableOpacity
                  style={[styles.submitRatingBtn, submittingRating && { opacity: 0.7 }]}
                  onPress={handleSendRating}
                  disabled={submittingRating}
                >
                  {submittingRating ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.submitRatingBtnText}>Kirim Penilaian Eco</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Chat AI Modal Sheet */}
        <Modal visible={chatModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.chatSheetContainer}>
              <View style={styles.sheetHeader}>
                <View>
                  <Text style={styles.sheetTitle}>EcoTravel AI Assistant</Text>
                  <Text style={styles.sheetSub}>Ketik revisi atau tanya seputar Batam</Text>
                </View>
                <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                  <Ionicons name="close" size={24} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.chatMessagesScroll} contentContainerStyle={{ padding: 16 }}>
                {chatMessages.map((m, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.msgBubble,
                      m.sender === 'user' ? styles.userMsg : m.sender === 'system' ? styles.systemMsg : styles.aiMsg,
                    ]}
                  >
                    <Text style={[styles.msgText, m.sender === 'user' ? { color: '#fff' } : { color: Colors.textPrimary }]}>
                      {m.message}
                    </Text>
                  </View>
                ))}
                {sendingChat && (
                  <View style={[styles.msgBubble, styles.aiMsg]}>
                    <ActivityIndicator size="small" color={Colors.green} />
                  </View>
                )}
              </ScrollView>

              <View style={styles.inputBar}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Contoh: ganti makan siang hari ke-2..."
                  value={inputMessage}
                  onChangeText={setInputMessage}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                  <Ionicons name="send" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // =========================================================================
  // TAMPILAN FORM "NEW ITINERARY" (JIKA BELUM ADA TRIP AKTIF)
  // =========================================================================
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Itinerary</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>DESTINATION</Text>
        <View style={styles.destinationBox}>
          <Ionicons name="compass-outline" size={18} color={Colors.primary} />
          <Text style={styles.destinationText}>Batam</Text>
        </View>

        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setIsOutsideBatam(!isOutsideBatam)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isOutsideBatam ? 'checkbox' : 'square-outline'}
            size={20}
            color={Colors.primary}
          />
          <Text style={styles.toggleText}>Coming from outside Batam?</Text>
        </TouchableOpacity>
      </View>

      {isOutsideBatam && (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>DEPARTING FROM</Text>
          <View style={styles.chipRow}>
            {DEPARTURE_OPTIONS.map((item) => {
              const active = departingFrom === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setDepartingFrom(item)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item === 'Singapore' ? '🇸🇬 Singapore' : '🇲🇾 Malaysia'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.eyebrow}>TRIP DURATION</Text>
        <View style={styles.counterBox}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setDays(Math.max(1, days - 1))}>
            <Ionicons name="remove" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.counterText}>{days} days</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setDays(days + 1)}>
            <Ionicons name="add" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>NUMBER OF PEOPLE (PAX)</Text>
        <View style={styles.counterBox}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setPax(Math.max(1, pax - 1))}>
            <Ionicons name="remove" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.counterText}>{pax} people</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setPax(pax + 1)}>
            <Ionicons name="add" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>TOTAL BUDGET (MAKSIMAL)</Text>
        <View style={styles.chipRow}>
          {[2000000, 3500000, 5000000, 8000000].map((b) => (
            <TouchableOpacity
              key={b}
              style={[styles.chip, budget === b && styles.chipActive]}
              onPress={() => setBudget(b)}
            >
              <Text style={[styles.chipText, budget === b && styles.chipTextActive]}>
                Rp {(b / 1000000).toFixed(1)} Juta
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>INTEREST CATEGORIES</Text>
        <View style={styles.chipRow}>
          {INTEREST_OPTIONS.map((item) => {
            const active = selectedInterests.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleInterest(item.id)}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={active ? Colors.white : Colors.primary}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>ACCOMMODATION PREFERENCES</Text>
        <View style={styles.chipRow}>
          {ACCOMMODATION_OPTIONS.map((item) => {
            const active = selectedAccomm === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedAccomm(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.eyebrow}>ADDITIONAL NOTES</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="e.g., I have a seafood allergy, prefer quiet nature spots..."
          placeholderTextColor={Colors.placeholder}
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      <TouchableOpacity
        style={[styles.generateBtn, generating && { opacity: 0.7 }]}
        onPress={handleGenerate}
        disabled={generating}
      >
        {generating ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            <Ionicons name="sparkles" size={18} color={Colors.white} />
            <Text style={styles.generateBtnText}>Create with AI</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: Colors.textSecondary, fontSize: 14 },
  content: { padding: 16, paddingTop: 40, paddingBottom: 100 },
  header: { marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  card: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  eyebrow: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 1.1, marginBottom: 10, textTransform: 'uppercase' },
  destinationBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 12, borderRadius: 12, gap: 10 },
  destinationText: { fontSize: 15, fontWeight: '700', color: Colors.primary },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  toggleText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textPrimary, fontWeight: '600' },
  chipTextActive: { color: Colors.white },
  counterBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background, borderRadius: 12, padding: 4 },
  counterBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  counterText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 14 },
  textInput: { backgroundColor: Colors.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: Colors.textPrimary },
  textArea: { height: 70, textAlignVertical: 'top' },
  generateBtn: { backgroundColor: Colors.primary, borderRadius: 24, paddingVertical: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  generateBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },

  headerActive: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 45, paddingBottom: 12, backgroundColor: Colors.card },
  headerTitleContainer: { flex: 1 },
  headerTitleActive: { fontSize: 18, fontWeight: '800', color: Colors.primary },
  headerSubtitleActive: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  stopBtn: { padding: 6 },
  topTabBarContainer: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: Colors.card },
  topTabBar: { flexDirection: 'row', backgroundColor: Colors.tabBackground, borderRadius: 20, padding: 4 },
  topTabBtn: { flex: 1, paddingVertical: 8, borderRadius: 16, alignItems: 'center' },
  topTabBtnActive: { backgroundColor: Colors.card },
  topTabText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  topTabTextActive: { color: Colors.primary, fontWeight: '700' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  daysScroll: { flexDirection: 'row', marginBottom: 14 },
  dayPill: { backgroundColor: Colors.card, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10, marginRight: 8, borderWidth: 1, borderColor: Colors.border },
  dayPillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayPillText: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  dayPillTextActive: { color: Colors.white },
  dayPillSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  dayPillSubActive: { color: Colors.tabBackground },
  infoBanner: { flexDirection: 'row', backgroundColor: Colors.cardGreen, borderRadius: 14, padding: 12, justifyContent: 'space-around', marginBottom: 16 },
  bannerCol: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bannerText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  // Activity Card Styling & Highlight
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activityCardHighlighted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
    borderWidth: 2,
    elevation: 4,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  activityCardPassed: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  timeTag: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeTagHighlighted: { backgroundColor: '#DCFCE7' },
  timeTagPassed: { backgroundColor: '#F1F5F9' },
  timeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  timeTextHighlighted: { color: '#15803D', fontWeight: '800' },
  timeTextPassed: { color: '#64748B' },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E', marginTop: 2 },
  activityBody: { flex: 1 },
  actHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  ongoingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22C55E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  ongoingBadgeText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  passedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 4,
  },
  passedBadgeText: { fontSize: 9, fontWeight: '800', color: '#15803D', letterSpacing: 0.5 },
  actTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  actTitleHighlighted: { color: '#14532D', fontWeight: '800' },
  categoryBadge: { backgroundColor: Colors.background, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  categoryBadgeHighlighted: { backgroundColor: '#DCFCE7' },
  categoryBadgeText: { fontSize: 10, color: Colors.textSecondary, textTransform: 'capitalize' },
  categoryBadgeTextHighlighted: { color: '#15803D', fontWeight: '700' },
  actDesc: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8 },
  actDescHighlighted: { color: '#166534' },
  actFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  actMeta: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
  actMetaHighlighted: { color: '#15803D', fontWeight: '700' },
  ratingTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  ratingTriggerBtnText: { fontSize: 11, fontWeight: '700', color: '#92400E' },

  emptyActivity: { padding: 30, alignItems: 'center' },
  costCard: { backgroundColor: Colors.card, borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  costLabel: { fontSize: 11, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.8, marginBottom: 6 },
  costValue: { fontSize: 24, fontWeight: '800', color: Colors.primary, marginBottom: 4 },
  budgetMeta: { fontSize: 13, color: Colors.textSecondary },
  breakdownCard: { backgroundColor: Colors.card, borderRadius: 16, padding: 16, marginBottom: 16 },
  sectionHeading: { fontSize: 15, fontWeight: '700', color: Colors.primary, marginBottom: 12 },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
  costRowLabel: { fontSize: 13, color: Colors.textSecondary },
  costRowVal: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  chatFab: { position: 'absolute', bottom: 24, right: 20, backgroundColor: Colors.primary, borderRadius: 28, paddingHorizontal: 18, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 8, elevation: 4 },
  chatFabText: { color: Colors.white, fontWeight: '700', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  chatSheetContainer: { height: '70%', backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sheetTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  sheetSub: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  chatMessagesScroll: { flex: 1 },
  msgBubble: { padding: 12, borderRadius: 14, marginBottom: 10, maxWidth: '80%' },
  userMsg: { alignSelf: 'flex-end', backgroundColor: Colors.primary },
  aiMsg: { alignSelf: 'flex-start', backgroundColor: Colors.tabBackground },
  systemMsg: { alignSelf: 'center', backgroundColor: Colors.cardGreen, paddingVertical: 6, paddingHorizontal: 14 },
  msgText: { fontSize: 13, lineHeight: 18 },
  inputBar: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: Colors.border, gap: 8 },
  chatInput: { flex: 1, backgroundColor: Colors.background, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 13 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },

  // Rating Modal Styles
  ratingSheetContainer: { height: '85%', backgroundColor: Colors.card, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  aspectBox: { backgroundColor: '#F8FAFC', borderRadius: 14, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  aspectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  aspectTitle: { fontSize: 13, fontWeight: '700', color: '#0F172A' },
  aspectWeight: { fontSize: 11, fontWeight: '800', color: Colors.green },
  aspectDesc: { fontSize: 11, color: '#64748B', lineHeight: 16, marginBottom: 10 },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  starBtn: { padding: 2 },
  starLabel: { fontSize: 13, fontWeight: '800', color: '#0F172A', marginLeft: 8 },
  fieldHeading: { fontSize: 12, fontWeight: '700', color: '#0E4D3C', marginBottom: 6 },
  reviewInput: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0F172A', height: 70, textAlignVertical: 'top', marginBottom: 20 },
  submitRatingBtn: { backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginBottom: 40 },
  submitRatingBtnText: { color: Colors.white, fontSize: 14, fontWeight: '700' },
});

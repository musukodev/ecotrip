import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';

import Header from '@/components/layout/Header';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import SectionHeader from '@/components/common/SectionHeader';
import ActiveTripCard from '@/components/common/ActiveTripCard';
import WeatherCard from '@/components/home/WeatherCard';
import ImageCardSection from '@/components/home/ImageCardSection';
import ListingSection from '@/components/home/ListingSection';

import { Colors, spacing } from '@/constants/theme';
import { weatherService, CurrentWeather, DailyForecast } from '@/services/weatherService';
import { accommodationService, Accommodation } from '@/services/accommodationService';
import { destinationService, Destination } from '@/services/destinationService';
import { tripService, Trip } from '@/services/tripService';
import { authService, UserProfile } from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export default function HomeScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);

  const loadData = async () => {
    try {
      const [userRes, weatherRes, forecastRes, tripsRes, accRes, destRes] = await Promise.allSettled([
        authService.getProfile(),
        weatherService.getCurrentWeather(),
        weatherService.getForecast(),
        tripService.getTrips(),
        accommodationService.getAccommodations(),
        destinationService.getDestinations(),
      ]);

      if (userRes.status === 'fulfilled') {
        setUser(userRes.value);
      } else if (userRes.status === 'rejected') {
        const err = userRes.reason;
        if (err?.response?.status === 401 || err?.response?.status === 404) {
          await logout();
          router.replace('/(auth)/login');
          return;
        }
      }
      if (weatherRes.status === 'fulfilled') setCurrentWeather(weatherRes.value);
      if (forecastRes.status === 'fulfilled') setForecast(forecastRes.value);
      if (tripsRes.status === 'fulfilled') {
        const active = tripsRes.value.find((t) => t.status === 'active');
        setActiveTrip(active || null);
      }
      if (accRes.status === 'fulfilled') setAccommodations(accRes.value);
      if (destRes.status === 'fulfilled') setDestinations(destRes.value);
    } catch (e) {
      console.error('Failed to load home data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Auto refresh data setiap kali tab Home difokuskan
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Format weather untuk component WeatherCard
  const weatherFormatted = currentWeather
    ? {
        location: currentWeather.location,
        temp: Math.round(currentWeather.temperature),
        condition: currentWeather.condition,
        wind: '12 km/h',
        humidity: `${currentWeather.humidity}%`,
        forecast: forecast.map((f) => ({
          day: f.day_name,
          icon: f.condition.toLowerCase().includes('hujan')
            ? ('cloud-rain' as const)
            : f.condition.toLowerCase().includes('cerah')
            ? ('sun' as const)
            : ('cloud' as const),
          temp: Math.round(f.temperature),
        })),
      }
    : null;

  // Format active trip
  const activeTripFormatted = activeTrip
    ? {
        title: activeTrip.title,
        dates: activeTrip.start_date
          ? `${new Date(activeTrip.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${
              activeTrip.end_date
                ? new Date(activeTrip.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                : ''
            }`
          : `${activeTrip.duration_days} Hari (${activeTrip.origin_port} ➔ Batam)`,
        version: `v${activeTrip.current_version}`,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600',
      }
    : null;

  // Format eco recommendations (destinasi)
  const ecoRecsFormatted = destinations.slice(0, 5).map((d) => ({
    id: d.id.toString(),
    tag: `Eco ${d.eco_score}`,
    title: d.name,
    subtitle: d.description,
    image: d.photos?.[0] || 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600',
  }));

  // Format eco stays
  const staysFormatted = accommodations.map((a) => ({
    id: a.id.toString(),
    name: a.name,
    rating: a.eco_score ? Number((a.eco_score / 20).toFixed(1)) : 4.5,
    location: a.location,
    tags: a.environmental_impact || 'Eco Certified',
    price: `Rp ${(a.price_per_night / 1000).toLocaleString('id-ID')}k / malam`,
    image: a.photos?.[0] || 'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600',
  }));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        <Header
          name={user?.name || 'Traveler'}
          onNotificationPress={() => router.push('/(tabs)/profile')}
        />

        {weatherFormatted && <WeatherCard weather={weatherFormatted} />}

        {activeTripFormatted && activeTrip && (
          <>
            <SectionHeader title="ACTIVE TRIPS" showViewAll={false} />
            <ActiveTripCard
              trip={activeTripFormatted}
              onPress={() => router.push(`/mytrip/${activeTrip.id}`)}
            />
          </>
        )}

        {ecoRecsFormatted.length > 0 && (
          <ImageCardSection
            title="ECO RECOMMENDATIONS"
            items={ecoRecsFormatted}
            onPressItem={(item) => router.push(`/trip/${item.id}`)}
          />
        )}

        {staysFormatted.length > 0 && (
          <ListingSection
            title="ECO-FRIENDLY STAYS"
            items={staysFormatted}
            onPressItem={(item) => router.push(`/stay/${item.id}`)}
          />
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => router.push('/(tabs)/my-trip')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/layout/Header';
import FloatingActionButton from '@/components/layout/FloatingActionButton';
import SectionHeader from '@/components/common/SectionHeader';
import ActiveTripCard from '@/components/common/ActiveTripCard';
import WeatherCard from '@/components/home/WeatherCard';
import ImageCardSection from '@/components/home/ImageCardSection';
import ListingSection from '@/components/home/ListingSection';

import { Colors, spacing } from '@/constants/theme';
import {
  weather,
  activeTrip,
  ecoRecommendations,
  featuredTrips,
  ecoStays,
  rentalVehicles,
} from '@/constants/mockData';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <Header name="Traveler" />

        <WeatherCard weather={weather} />

        <SectionHeader title="ACTIVE TRIPS" showViewAll={false} />
        <ActiveTripCard trip={activeTrip} />

        <ImageCardSection title="ECO RECOMMENDATIONS" items={ecoRecommendations} />
        <ImageCardSection title="FEATURED TRIPS" items={featuredTrips} showPrice />

        <ListingSection title="ECO-FRIENDLY STAYS" items={ecoStays} />
        <ListingSection title="RENTAL VEHICLES" items={rentalVehicles} />
      </ScrollView>

      <FloatingActionButton onPress={() => {}} />
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
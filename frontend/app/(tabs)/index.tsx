import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/Header';
import WeatherCard from '@/components/WeatherCard';
import SectionHeader from '@/components/SectionHeader';
import ActiveTripCard from '@/components/ActiveTripCard';
import ImageInfoCard from '@/components/ImageInfoCard';
import ListingRow from '@/components/ListingRow';
import FloatingActionButton from '@/components/FloatingActionButton';

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

        <SectionHeader title="ECO RECOMMENDATIONS" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {ecoRecommendations.map((item) => (
            <ImageInfoCard key={item.id} item={item} />
          ))}
        </ScrollView>

        <SectionHeader title="FEATURED TRIPS" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
        >
          {featuredTrips.map((item) => (
            <ImageInfoCard key={item.id} item={item} showPrice />
          ))}
        </ScrollView>

        <SectionHeader title="ECO-FRIENDLY STAYS" />
        <View style={{ marginTop: spacing.xs }}>
          {ecoStays.map((item) => (
            <ListingRow key={item.id} item={item} />
          ))}
        </View>

        <SectionHeader title="RENTAL VEHICLES" />
        <View style={{ marginTop: spacing.xs }}>
          {rentalVehicles.map((item) => (
            <ListingRow key={item.id} item={item} />
          ))}
        </View>
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
  hScroll: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
});
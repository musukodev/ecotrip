import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, radius, font } from '@/constants/theme';
import { Weather, ForecastDay } from '@/constants/mockData';

const iconMap: Record<ForecastDay['icon'], keyof typeof Feather.glyphMap> = {
  cloud: 'cloud',
  'cloud-rain': 'cloud-rain',
  sun: 'sun',
  'cloud-sun': 'cloud',
};

interface WeatherCardProps {
  weather: Weather;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.eyebrow}>TODAY'S WEATHER</Text>
        <View style={styles.locationPill}>
          <Feather name="map-pin" size={11} color={Colors.white} />
          <Text style={styles.locationText}>{weather.location}</Text>
        </View>
      </View>

      <View style={styles.mainRow}>
        <View style={styles.tempBlock}>
          <Feather name="sun" size={40} color={Colors.sun} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.temp}>{weather.temp}°C</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
          </View>
        </View>

        <View style={styles.statsBox}>
          <View style={styles.statRow}>
            <Feather name="wind" size={13} color={Colors.greenPale} />
            <Text style={styles.statText}>{weather.wind}</Text>
          </View>
          <View style={styles.statRow}>
            <Feather name="droplet" size={13} color={Colors.greenPale} />
            <Text style={styles.statText}>{weather.humidity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.forecastRow}>
        {weather.forecast.map((f) => (
          <View key={f.day} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{f.day.toUpperCase()}</Text>
            <Feather
              name={iconMap[f.icon]}
              size={20}
              color={Colors.sun}
              style={{ marginVertical: 6 }}
            />
            <Text style={styles.forecastTemp}>{f.temp}°</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    ...font.eyebrow,
    color: Colors.greenPale,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  locationText: {
    color: Colors.white,
    fontSize: 11,
    marginLeft: 4,
  },
  mainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  tempBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: '700',
  },
  condition: {
    color: Colors.greenPale,
    fontSize: 13,
    marginTop: 2,
  },
  statsBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: radius.md,
    padding: 10,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  statText: {
    color: Colors.white,
    fontSize: 12,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: spacing.md,
  },
  forecastRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    alignItems: 'center',
  },
  forecastDay: {
    color: Colors.greenPale,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  forecastTemp: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});
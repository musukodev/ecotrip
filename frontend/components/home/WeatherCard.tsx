import React from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, radius } from '@/constants/theme';
import { Weather } from '@/constants/mockData';

interface WeatherCardProps {
  weather: Weather;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>BATAM WEATHER</Text>
          <Text style={styles.location}>{weather.location}</Text>
        </View>
        <Text style={styles.temp}>{weather.temp}°C</Text>
      </View>

      <Text style={styles.condition}>{weather.condition}</Text>

      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Feather name="wind" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{weather.wind}</Text>
        </View>
        <View style={styles.metaItem}>
          <Feather name="droplet" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{weather.humidity}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.forecast}>
        {weather.forecast.map((item, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastDay}>{item.day}</Text>
            <Feather name={item.icon} size={18} color={Colors.textSecondary} style={styles.forecastIcon} />
            <Text style={styles.forecastTemp}>{item.temp}°</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  } as ViewStyle,
  label: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  } as TextStyle,
  location: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 2,
  } as TextStyle,
  temp: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
  } as TextStyle,
  condition: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  } as TextStyle,
  meta: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.md,
  } as ViewStyle,
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  } as ViewStyle,
  metaText: {
    fontSize: 12,
    color: Colors.textMuted,
  } as TextStyle,
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: spacing.md,
  } as ViewStyle,
  forecast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  forecastItem: {
    alignItems: 'center',
  } as ViewStyle,
  forecastDay: {
    fontSize: 12,
    color: Colors.textMuted,
  } as TextStyle,
  forecastIcon: {
    marginVertical: 4,
  } as ViewStyle,
  forecastTemp: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  } as TextStyle,
});

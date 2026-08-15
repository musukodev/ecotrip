import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, radius, font } from '@/constants/theme';
import { ActiveTrip } from '@/constants/mockData';

interface ActiveTripCardProps {
  trip: ActiveTrip;
  onPress?: () => void;
}

export default function ActiveTripCard({ trip, onPress }: ActiveTripCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: trip.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{trip.title}</Text>
        <Text style={styles.subtitle}>
          {trip.dates} · {trip.version}
        </Text>
      </View>
      <Feather name="chevron-right" size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: spacing.md,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  title: {
    ...font.h2,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...font.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
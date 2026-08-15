import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, radius } from '@/constants/theme';
import { ActiveTrip } from '@/constants/mockData';

interface ActiveTripCardProps {
  trip: ActiveTrip;
  onPress?: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600';

export default function ActiveTripCard({ trip, onPress }: ActiveTripCardProps) {
  const [imgSrc, setImgSrc] = useState({ uri: trip.image || DEFAULT_IMAGE });

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={imgSrc}
        style={styles.image}
        onError={() => setImgSrc({ uri: DEFAULT_IMAGE })}
        resizeMode="cover"
      />
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
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  } as ViewStyle,
  image: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: '#E2EFE9',
  } as ImageStyle,
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  } as ViewStyle,
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  } as TextStyle,
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.textMuted,
    marginTop: 2,
  } as TextStyle,
});

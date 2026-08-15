import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, radius, font } from '@/constants/theme';
import { ListingItem } from '@/constants/mockData';

interface ListingRowProps {
  item: ListingItem;
  onPress?: () => void;
}

export default function ListingRow({ item, onPress }: ListingRowProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Feather name="star" size={12} color={Colors.sun} />
          <Text style={styles.metaText}>
            {item.rating} · {item.location || item.tags}
          </Text>
        </View>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: radius.md,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.sm,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
  },
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    ...font.h2,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    ...font.caption,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  price: {
    ...font.body,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 6,
  },
});
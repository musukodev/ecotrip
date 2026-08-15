import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, radius } from '@/constants/theme';
import { ListingItem } from '@/constants/mockData';

interface ListingRowProps {
  item: ListingItem;
  onPress?: () => void;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600';

export default function ListingRow({ item, onPress }: ListingRowProps) {
  const [imgSrc, setImgSrc] = useState({ uri: item.image || DEFAULT_IMAGE });

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.85}>
      <Image
        source={imgSrc}
        style={styles.image}
        onError={() => setImgSrc({ uri: DEFAULT_IMAGE })}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.rating}>
            <Feather name="star" size={12} color={Colors.sun} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>

        {item.location && <Text style={styles.location}>{item.location}</Text>}
        {item.tags && <Text style={styles.tags} numberOfLines={1}>{item.tags}</Text>}

        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  } as ViewStyle,
  image: {
    width: 68,
    height: 68,
    borderRadius: radius.sm,
    backgroundColor: '#E2EFE9',
  } as ImageStyle,
  info: {
    flex: 1,
    marginLeft: spacing.sm,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: spacing.xs,
  } as TextStyle,
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  } as ViewStyle,
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  } as TextStyle,
  location: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  } as TextStyle,
  tags: {
    fontSize: 11,
    color: Colors.greenLight,
    fontWeight: '600',
    marginTop: 2,
  } as TextStyle,
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  } as TextStyle,
});

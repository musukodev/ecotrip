import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, spacing, radius, font } from '@/constants/theme';
import { ImageItem } from '@/constants/mockData';

interface ImageInfoCardProps {
  item: ImageItem;
  width?: number;
  height?: number;
  onPress?: () => void;
  showPrice?: boolean;
}

export default function ImageInfoCard({ item, width = 220, height = 150, onPress, showPrice }: ImageInfoCardProps) {
  return (
    <TouchableOpacity style={[styles.card, { width }]} onPress={onPress} activeOpacity={0.9}>
      <View>
        <Image source={{ uri: item.image }} style={[styles.image, { height }]} />
        {item.tag && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
        {showPrice && item.price && <Text style={styles.price}>{item.price}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: radius.md,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  info: {
    padding: spacing.sm,
  },
  title: {
    ...font.h2,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  subtitle: {
    ...font.caption,
    color: Colors.textMuted,
    marginTop: 4,
  },
  price: {
    ...font.body,
    fontWeight: '700',
    color: Colors.greenLight,
    marginTop: 6,
  },
});
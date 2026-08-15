import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Colors, spacing, radius } from '@/constants/theme';
import { ImageItem } from '@/constants/mockData';

interface ImageInfoCardProps {
  item: ImageItem;
  width?: number;
  height?: number;
  onPress?: () => void;
  showPrice?: boolean;
}

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600';

export default function ImageInfoCard({ item, width = 220, height = 150, onPress, showPrice }: ImageInfoCardProps) {
  const [imgSrc, setImgSrc] = useState({ uri: item.image || DEFAULT_IMAGE });

  return (
    <TouchableOpacity style={[styles.card, { width }]} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.imageContainer, { height }]}>
        <Image
          source={imgSrc}
          style={[styles.image, { height }]}
          onError={() => setImgSrc({ uri: DEFAULT_IMAGE })}
          resizeMode="cover"
        />
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
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  } as ViewStyle,
  imageContainer: {
    width: '100%',
    backgroundColor: '#E2EFE9',
  } as ViewStyle,
  image: {
    width: '100%',
  } as ImageStyle,
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(14, 77, 60, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
  } as ViewStyle,
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  } as TextStyle,
  info: {
    padding: spacing.sm,
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
    marginTop: 4,
  } as TextStyle,
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.greenLight,
    marginTop: 6,
  } as TextStyle,
});

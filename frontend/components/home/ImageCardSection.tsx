import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import SectionHeader from '@/components/common/SectionHeader';
import ImageInfoCard from '@/components/common/ImageInfoCard';
import { ImageItem } from '@/constants/mockData';
import { spacing } from '@/constants/theme';

interface ImageCardSectionProps {
  title: string;
  items: ImageItem[];
  showPrice?: boolean;
  onPressItem?: (item: ImageItem) => void;
}

export default function ImageCardSection({
  title,
  items,
  showPrice,
  onPressItem,
}: ImageCardSectionProps) {
  return (
    <>
      <SectionHeader title={title} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hScroll}
      >
        {items.map((item) => (
          <ImageInfoCard
            key={item.id}
            item={item}
            showPrice={showPrice}
            onPress={onPressItem ? () => onPressItem(item) : undefined}
          />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  hScroll: {
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
  },
});
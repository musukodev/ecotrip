import React from 'react';
import { View, StyleSheet } from 'react-native';
import SectionHeader from '@/components/common/SectionHeader';
import ListingRow from '@/components/common/ListingRow';
import { ListingItem } from '@/constants/mockData';
import { spacing } from '@/constants/theme';

interface ListingSectionProps {
  title: string;
  items: ListingItem[];
  onPressItem?: (item: ListingItem) => void;
}

export default function ListingSection({ title, items, onPressItem }: ListingSectionProps) {
  return (
    <View>
      <SectionHeader title={title} />
      <View style={styles.list}>
        {items.map((item) => (
          <ListingRow
            key={item.id}
            item={item}
            onPress={onPressItem ? () => onPressItem(item) : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.xs,
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, spacing, font } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  onPressViewAll?: () => void;
  showViewAll?: boolean;
}

export default function SectionHeader({ title, onPressViewAll, showViewAll = true }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onPressViewAll}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  title: {
    ...font.eyebrow,
    color: Colors.textPrimary,
  },
  viewAll: {
    ...font.eyebrow,
    color: Colors.greenLight,
  },
});
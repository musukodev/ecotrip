import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors, spacing } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
}

export default function SectionHeader({ title, onViewAll, showViewAll = true }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  } as ViewStyle,
  title: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  } as TextStyle,
  viewAll: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  } as TextStyle,
});

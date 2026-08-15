import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing } from '@/constants/theme';

interface HeaderProps {
  name: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ name, onNotificationPress, onProfilePress }: HeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Feather name="user" size={18} color={Colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Halo,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconBtn} onPress={onNotificationPress} activeOpacity={0.7}>
          <Feather name="bell" size={20} color={Colors.primary} />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  } as ViewStyle,
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  textContainer: {
    gap: 1,
  } as ViewStyle,
  greeting: {
    fontSize: 12,
    color: Colors.textMuted,
  } as TextStyle,
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  } as TextStyle,
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  } as ViewStyle,
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  badge: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  } as ViewStyle,
});

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors, spacing, font } from '@/constants/theme';

interface HeaderProps {
  name?: string;
  avatarUri?: string;
  onPressBell?: () => void;
}

export default function Header({ name = 'Traveler', avatarUri, onPressBell }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.eyebrow}>WELCOME BACK</Text>
        <Text style={styles.title}>Hello, {name} 👋</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.bell} onPress={onPressBell}>
          <Feather name="bell" size={18} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Image
          source={{ uri: avatarUri || 'https://i.pravatar.cc/100?img=47' }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  eyebrow: {
    ...font.eyebrow,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  title: {
    ...font.h1,
    color: Colors.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
});
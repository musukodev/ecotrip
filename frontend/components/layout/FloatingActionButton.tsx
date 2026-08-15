import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress?: () => void;
  bottom?: number;
}

export default function FloatingActionButton({ onPress, bottom = 90 }: FloatingActionButtonProps) {
  return (
    <TouchableOpacity style={[styles.fab, { bottom }]} onPress={onPress} activeOpacity={0.85}>
      <Feather name="message-circle" size={22} color={Colors.white} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});
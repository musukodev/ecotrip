import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const Colors = {
  primary: '#0D2B22',
  primaryDark: '#071D17',
  accent: '#1C4A3E',
  green: '#2d6a4f',
  greenLight: '#40916c',
  greenSoft: '#74c69d',
  greenPale: '#b7e4c7',
  ocean: '#0077b6',
  oceanLight: '#48cae4',
  coral: '#e76f51',
  coralLight: '#f4a261',
  sun: '#F5A623',
  danger: '#e63946',
  background: '#F4F7F4',
  card: '#FFFFFF',
  tabBackground: '#E4EBE3',
  textPrimary: '#0D2B22',
  textSecondary: '#4B5563',
  textMuted: '#8C98A4',
  placeholder: '#A0AEC0',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  white: '#FFFFFF',
  disabled: '#0D2B2280',
};

interface InterestOption {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const INTEREST_OPTIONS: InterestOption[] = [
  { id: 'Nature', icon: 'leaf-outline' },
  { id: 'Culture', icon: 'color-palette-outline' },
  { id: 'Culinary', icon: 'restaurant-outline' },
  { id: 'Adventure', icon: 'walk-outline' },
  { id: 'Shopping', icon: 'bag-handle-outline' },
  { id: 'Relaxation', icon: 'body-outline' },
];

const DEPARTURE_OPTIONS = ['Singapore', 'Malaysia'];
const ACCOMMODATION_OPTIONS = ['Hotel', 'Resort', 'Homestay', 'Glamping', 'Other'];

export default function MyTripScreen() {
  const router = useRouter();

  // State
  const [isOutsideBatam, setIsOutsideBatam] = useState(false);
  const [departingFrom, setDepartingFrom] = useState('Singapore');
  const [days, setDays] = useState(3);
  const [pax, setPax] = useState(2);
  const [selectedAccomm, setSelectedAccomm] = useState('Hotel');
  const [otherAccommText, setOtherAccommText] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Nature', 'Culinary']);
  const [notes, setNotes] = useState('');

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = () => {
    // Navigasi ke rute folder baru: app/mytrip/[id].tsx
    router.push('/mytrip/123');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Itinerary</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Destination Card */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>DESTINATION</Text>
        <View style={styles.destinationBox}>
          <Ionicons name="compass-outline" size={18} color={Colors.primary} />
          <Text style={styles.destinationText}>Batam</Text>
        </View>

        {/* Toggle Coming from Outside Batam */}
        <TouchableOpacity
          style={styles.toggleRow}
          onPress={() => setIsOutsideBatam(!isOutsideBatam)}
        >
          <Ionicons
            name={isOutsideBatam ? 'checkbox' : 'square-outline'}
            size={18}
            color={Colors.primary}
          />
          <Text style={styles.toggleText}>Coming from outside Batam?</Text>
        </TouchableOpacity>
      </View>

      {/* Conditional: Departing From Section */}
      {isOutsideBatam && (
        <View style={styles.card}>
          <Text style={styles.eyebrow}>DEPARTING FROM</Text>
          <View style={styles.chipRow}>
            {DEPARTURE_OPTIONS.map((item) => {
              const active = departingFrom === item;
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.chip, active && styles.chipActive]}
                  onPress={() => setDepartingFrom(item)}
                >
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Duration & Pax */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>TRIP DURATION</Text>
        <View style={styles.counterBox}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setDays(Math.max(1, days - 1))}>
            <Ionicons name="remove" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.counterText}>{days} days</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setDays(days + 1)}>
            <Ionicons name="add" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>NUMBER OF PEOPLE (PAX)</Text>
        <View style={styles.counterBox}>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setPax(Math.max(1, pax - 1))}>
            <Ionicons name="remove" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.counterText}>{pax} people</Text>
          <TouchableOpacity style={styles.counterBtn} onPress={() => setPax(pax + 1)}>
            <Ionicons name="add" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Interest & Accommodation */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>INTEREST CATEGORIES</Text>
        <View style={styles.chipRow}>
          {INTEREST_OPTIONS.map((item) => {
            const active = selectedInterests.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => toggleInterest(item.id)}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={active ? Colors.white : Colors.primary}
                />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.divider} />

        <Text style={styles.eyebrow}>ACCOMMODATION PREFERENCES</Text>
        <View style={styles.chipRow}>
          {ACCOMMODATION_OPTIONS.map((item) => {
            const active = selectedAccomm === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedAccomm(item)}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Conditional Input Other */}
        {selectedAccomm === 'Other' && (
          <View style={styles.otherInputContainer}>
            <Text style={styles.subLabel}>Other:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Specify other accommodation"
              placeholderTextColor={Colors.placeholder}
              value={otherAccommText}
              onChangeText={setOtherAccommText}
            />
          </View>
        )}
      </View>

      {/* Additional Notes */}
      <View style={styles.card}>
        <Text style={styles.eyebrow}>ADDITIONAL NOTES</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="e.g., I have a seafood allergy..."
          placeholderTextColor={Colors.placeholder}
          multiline
          numberOfLines={3}
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.generateBtn} onPress={handleGenerate}>
        <Ionicons name="sparkles" size={18} color={Colors.white} />
        <Text style={styles.generateBtnText}>Create with AI</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerSpacer: {
    width: 36,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 1.1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  destinationBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  destinationText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  toggleText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: Colors.white,
  },
  counterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 4,
  },
  counterBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 12,
  },
  otherInputContainer: {
    marginTop: 12,
  },
  textInput: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  generateBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  generateBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
});
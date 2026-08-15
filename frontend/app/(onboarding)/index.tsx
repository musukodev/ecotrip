import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { setOnboardingDone } from '@/hooks/useOnboarding';
import { Colors } from '@/constants/theme';

const { width } = Dimensions.get('window');

interface Slide {
  emoji: string;
  title: string;
  desc: string;
  colors: [string, string];
}

const slides: Slide[] = [
  {
    emoji: '🌍',
    title: 'Rencanakan Perjalanan Ramah Lingkungan',
    desc: 'Buat trip yang hemat energi dan minim jejak karbon untuk masa depan bumi yang lebih baik.',
    colors: [Colors.primary, Colors.accent],
  },
  {
    emoji: '🌿',
    title: 'Pantau Carbon Footprint',
    desc: 'Setiap trip kamu dihitung jejak karbonnya. Lihat seberapa hijau perjalananmu.',
    colors: [Colors.ocean, Colors.oceanLight],
  },
  {
    emoji: '🧳',
    title: 'Tips Eco Travel',
    desc: 'Dapatkan saran cerdas untuk traveling yang lebih berkelanjutan dan bertanggung jawab.',
    colors: [Colors.coral, Colors.coralLight],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const flatRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const current = slides[index];

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  const goNext = () => {
    if (index < slides.length - 1) {
      flatRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      finish();
    }
  };

  const finish = async () => {
    await setOnboardingDone();
    router.replace('/(auth)/login');
  };

  return (
    <LinearGradient colors={current.colors} style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.decoWrap}>
        <View style={styles.decoTopLeftBig} />
        <View style={styles.decoTopLeftSmall} />
        <View style={styles.decoTopRight} />
        <View style={styles.decoBottomRight} />
        <View style={styles.decoBottomLeft} />

        <View style={styles.ringTopLeft} />
        <View style={styles.ringTopRight} />
        <View style={styles.ringBottomRight} />
        <View style={styles.ringBottomLeft} />

        <View style={styles.dotTopCenter} />
        <View style={styles.dotBottomCenter} />
        <View style={styles.dotLeftTop} />
        <View style={styles.dotRightTop} />
      </View>

      <View style={styles.skipWrap}>
        {index < slides.length - 1 && (
          <TouchableOpacity onPress={finish}>
            <Text style={styles.skip}>Lewati</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={flatRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={goNext}>
          <Text style={[styles.buttonText, { color: current.colors[0] }]}>
            {index === slides.length - 1 ? 'Mulai' : 'Lanjut'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  decoWrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  skipWrap: {
    position: 'absolute',
    top: 56,
    right: 24,
    zIndex: 2,
  },
  skip: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '600' },
  slide: {
    width,
    paddingHorizontal: 32,
    paddingBottom: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decoTopLeftBig: {
    position: 'absolute',
    top: -60,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  decoTopLeftSmall: {
    position: 'absolute',
    top: -8,
    left: -12,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  decoTopRight: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  decoBottomRight: {
    position: 'absolute',
    bottom: -90,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  decoBottomLeft: {
    position: 'absolute',
    bottom: -40,
    left: -70,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  ringTopLeft: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  ringTopRight: {
    position: 'absolute',
    top: 130,
    right: 60,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.45)',
  },
  ringBottomRight: {
    position: 'absolute',
    bottom: 170,
    right: 30,
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  ringBottomLeft: {
    position: 'absolute',
    bottom: 90,
    left: 24,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  dotTopCenter: {
    position: 'absolute',
    top: 90,
    left: width * 0.45,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotBottomCenter: {
    position: 'absolute',
    bottom: 90,
    left: width * 0.6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dotLeftTop: {
    position: 'absolute',
    top: 220,
    left: 18,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotRightTop: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  emojiWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  emoji: { fontSize: 64 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  desc: { fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', lineHeight: 22 },
  footer: { paddingHorizontal: 32, paddingBottom: 48, zIndex: 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: Colors.white, width: 24 },
  button: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: { fontWeight: 'bold', fontSize: 16 },
});
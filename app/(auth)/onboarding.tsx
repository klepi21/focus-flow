import { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { EnergyLevel } from '@/src/types';
import { useTaskStore } from '@/src/store/taskStore';
import { useGreeting } from '@/src/hooks/useGreeting';
import { AmbientBackground } from '@/src/components/ui/AmbientBackground';

const ENERGY_OPTIONS: {
  level: EnergyLevel;
  emoji: string;
  label: string;
  subtitle: string;
  color: string;
  gradient: [string, string];
}[] = [
  {
    level: 'low',
    emoji: '🌙',
    label: 'Low energy',
    subtitle: "That's ok. We'll keep it light.",
    color: '#5A8FB8',
    gradient: ['#B8D9CC', '#D0EAE0'],
  },
  {
    level: 'medium',
    emoji: '🌿',
    label: 'Medium energy',
    subtitle: "Good. Let's make today count.",
    color: Colors.primary,
    gradient: [Colors.primary + 'CC', Colors.primaryDeep],
  },
  {
    level: 'high',
    emoji: '⚡',
    label: 'High energy',
    subtitle: "Let's go. You're unstoppable.",
    color: Colors.now,
    gradient: [Colors.now + 'CC', '#B85A28'],
  },
];

export default function OnboardingScreen() {
  const greeting = useGreeting();
  const [selected, setSelected] = useState<EnergyLevel | null>(null);
  const setEnergyLevel = useTaskStore((s) => s.setEnergyLevel);
  const scaleAnims = useRef(ENERGY_OPTIONS.map(() => new Animated.Value(1))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  function handleSelect(level: EnergyLevel, index: number) {
    setSelected(level);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(scaleAnims[index], { toValue: 0.96, friction: 8, useNativeDriver: true }),
      Animated.spring(scaleAnims[index], { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();
  }

  function handleStart() {
    if (!selected) return;
    setEnergyLevel(selected);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(tabs)/today');
  }

  const selectedOption = ENERGY_OPTIONS.find((o) => o.level === selected);

  return (
    <View style={styles.container}>
      <AmbientBackground energy={selected} />
      <SafeAreaView style={styles.safe}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          <View style={styles.header}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.question}>How's your{'\n'}energy today?</Text>
          </View>

          <View style={styles.cards}>
            {ENERGY_OPTIONS.map((opt, i) => {
              const isSelected = selected === opt.level;
              return (
                <Animated.View
                  key={opt.level}
                  style={[
                    styles.cardWrap,
                    { transform: [{ scale: scaleAnims[i] }] },
                    isSelected && {
                      shadowColor: opt.color,
                      shadowOpacity: 0.3,
                      shadowRadius: 20,
                      shadowOffset: { width: 0, height: 4 },
                      elevation: 8,
                    },
                  ]}
                >
                  <TouchableOpacity activeOpacity={0.9} onPress={() => handleSelect(opt.level, i)}>
                    <View style={[
                      styles.card,
                      {
                        backgroundColor: isSelected ? opt.color + '15' : Colors.surface,
                        borderColor: isSelected ? opt.color + '60' : Colors.border,
                      },
                    ]}>
                      <Text style={styles.cardEmoji}>{opt.emoji}</Text>
                      <View style={styles.cardText}>
                        <Text style={[styles.cardLabel, isSelected && { color: opt.color }]}>
                          {opt.label}
                        </Text>
                        {isSelected && <Text style={styles.cardSubtitle}>{opt.subtitle}</Text>}
                      </View>
                      {isSelected && (
                        <View style={[styles.checkDot, { backgroundColor: opt.color }]}>
                          <Text style={styles.checkMark}>✓</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.cta, !selected && styles.ctaDisabled]}
            onPress={handleStart}
            disabled={!selected}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={selectedOption ? selectedOption.gradient : [Colors.primary, Colors.primaryDeep]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaText}>{selected ? "Let's focus →" : 'Pick your energy'}</Text>
            </LinearGradient>
          </TouchableOpacity>

        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  header: { marginBottom: 36 },
  greeting: {
    fontSize: 13, color: Colors.textMuted, fontWeight: '600',
    letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase',
  },
  question: {
    fontSize: 40, fontWeight: '800', color: Colors.textPrimary,
    lineHeight: 48, letterSpacing: -1,
  },
  cards: { flex: 1, gap: 12, justifyContent: 'center' },
  cardWrap: { borderRadius: 20 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 20, borderWidth: 1.5,
    padding: 22, gap: 16,
  },
  cardEmoji: { fontSize: 36 },
  cardText: { flex: 1 },
  cardLabel: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  cardSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 5, lineHeight: 18 },
  checkDot: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  cta: { marginTop: 28, borderRadius: 18, overflow: 'hidden' },
  ctaDisabled: { opacity: 0.4 },
  ctaGradient: { height: 62, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.3 },
});

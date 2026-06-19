import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { EnergyLevel } from '@/src/types';
import { useTaskStore } from '@/src/store/taskStore';
import { EnergyCard } from '@/src/components/EnergyCard';
import { useGreeting } from '@/src/hooks/useGreeting';

const ENERGY_OPTIONS: {
  level: EnergyLevel;
  label: string;
  description: string;
}[] = [
  { level: 'low', label: 'Low energy', description: 'Gentle day, essentials only' },
  { level: 'medium', label: 'Medium energy', description: 'Steady pace, a few tasks' },
  { level: 'high', label: 'High energy', description: 'Full throttle, let\'s go!' },
];

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<EnergyLevel | null>(null);
  const setEnergyLevel = useTaskStore((s) => s.setEnergyLevel);
  const greeting = useGreeting();

  function handleSelect(level: EnergyLevel) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(level);
  }

  function handleStart() {
    if (!selected) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setEnergyLevel(selected);
    router.replace('/(tabs)/today');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.question}>How's your energy{'\n'}right now?</Text>
          <Text style={styles.subtitle}>I'll adjust your day based on this</Text>
        </View>

        {/* Energy cards */}
        <View style={styles.cards}>
          {ENERGY_OPTIONS.map((opt) => (
            <EnergyCard
              key={opt.level}
              level={opt.level}
              label={opt.label}
              description={opt.description}
              selected={selected === opt.level}
              onPress={() => handleSelect(opt.level)}
            />
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={handleStart}
          disabled={!selected}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>Let's start →</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>You can change this anytime during the day</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  question: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
  },
  cards: {
    gap: 12,
    marginBottom: 40,
  },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hint: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});

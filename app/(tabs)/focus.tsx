import { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { WaterTimer } from '@/src/components/WaterTimer';
import { IllustrationPlaceholder } from '@/src/components/IllustrationPlaceholder';

// Body double messages — rotate each session
const BODY_DOUBLE_MESSAGES = [
  'Imagine someone sitting quietly beside you. Working. Focused.',
  'Millions of ADHD brains are working right now. You\'re one of them.',
  'The people at coffee shops? They\'re your body doubles today.',
  'You showed up. That\'s already the hardest part.',
  'No pressure. Just you and the timer, one minute at a time.',
];

const PRESETS = [
  { label: '5 min', seconds: 300 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
  { label: '45 min', seconds: 2700 },
];

export default function FocusScreen() {
  const [selectedSeconds, setSelectedSeconds] = useState(1500);
  const [remaining, setRemaining] = useState(1500);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messageIndex = useRef(Math.floor(Math.random() * BODY_DOUBLE_MESSAGES.length)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setIsDone(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  // Pulse animation for "I got distracted" hint button
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.02, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    if (!isRunning) pulse.start();
    else { pulse.stop(); pulseAnim.setValue(1); }
    return () => pulse.stop();
  }, [isRunning]);

  function handlePreset(seconds: number) {
    if (isRunning) return;
    setSelectedSeconds(seconds);
    setRemaining(seconds);
    setIsDone(false);
    Haptics.selectionAsync();
  }

  function handleStart() {
    setIsDone(false);
    setIsRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function handlePause() {
    setIsRunning(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleReset() {
    setIsRunning(false);
    setRemaining(selectedSeconds);
    setIsDone(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }

  function handleStartAgain() {
    setRemaining(selectedSeconds);
    setIsDone(false);
    setIsRunning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Title */}
        <Text style={styles.title}>Focus Timer</Text>
        <Text style={styles.subtitle}>Work alongside the timer 🧑‍💻</Text>

        {/* Water Timer */}
        <View style={styles.timerWrap}>
          <WaterTimer
            totalSeconds={selectedSeconds}
            remainingSeconds={remaining}
            isRunning={isRunning}
          />
        </View>

        {/* Preset pills */}
        <View style={styles.presets}>
          {PRESETS.map((p) => (
            <TouchableOpacity
              key={p.seconds}
              style={[
                styles.preset,
                selectedSeconds === p.seconds && styles.presetActive,
                isRunning && styles.presetDisabled,
              ]}
              onPress={() => handlePreset(p.seconds)}
              disabled={isRunning}
            >
              <Text
                style={[
                  styles.presetText,
                  selectedSeconds === p.seconds && styles.presetTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.resetBtn, isRunning && styles.btnDisabled]}
            onPress={handleReset}
            disabled={isRunning}
          >
            <Text style={styles.resetIcon}>↺</Text>
          </TouchableOpacity>

          {isDone ? (
            <TouchableOpacity style={styles.mainBtn} onPress={handleStartAgain}>
              <Text style={styles.mainBtnText}>▶  Start again</Text>
            </TouchableOpacity>
          ) : isRunning ? (
            <TouchableOpacity style={[styles.mainBtn, styles.pauseBtn]} onPress={handlePause}>
              <Text style={styles.mainBtnText}>⏸  Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.mainBtn} onPress={handleStart}>
              <Text style={styles.mainBtnText}>▶  Start</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Done state message */}
        {isDone && (
          <View style={styles.doneMessage}>
            <Text style={styles.doneText}>
              ✓  {Math.floor(selectedSeconds / 60)} minutes focused. That's real.
            </Text>
          </View>
        )}

        {/* Body double card */}
        <View style={styles.bodyDoubleCard}>
          {/* Placeholder — swap for: require('@/assets/illustrations/body-double.png') */}
          <IllustrationPlaceholder
            emoji="🧑‍💻"
            size={52}
            bgColor={Colors.primary + '20'}
          />
          <View style={styles.bodyDoubleText}>
            <Text style={styles.bodyDoubleTitle}>You're not working alone</Text>
            <Text style={styles.bodyDoubleBody}>
              {BODY_DOUBLE_MESSAGES[messageIndex]}
            </Text>
          </View>
        </View>
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
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
    alignSelf: 'flex-start',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 36,
    alignSelf: 'flex-start',
  },
  timerWrap: {
    marginBottom: 32,
  },
  presets: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  preset: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetDisabled: {
    opacity: 0.4,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetTextActive: {
    color: '#FFFFFF',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  resetBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.3,
  },
  resetIcon: {
    fontSize: 22,
    color: Colors.textSecondary,
  },
  mainBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 40,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  pauseBtn: {
    backgroundColor: Colors.surfaceHigh,
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mainBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneMessage: {
    backgroundColor: Colors.success + '20',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.success + '40',
  },
  doneText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.success,
    textAlign: 'center',
  },
  bodyDoubleCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 16,
    width: '100%',
    alignItems: 'flex-start',
  },
  bodyDoubleText: {
    flex: 1,
  },
  bodyDoubleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  bodyDoubleBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

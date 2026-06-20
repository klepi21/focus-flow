import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';

const { width: W } = Dimensions.get('window');

interface Props {
  streak: number;
  onDismiss: () => void;
}

const MILESTONE_COPY: Record<number, { emoji: string; headline: string; body: string }> = {
  3:   { emoji: '🌱', headline: '3-day streak!',   body: "You're building momentum. Three days in a row — that's a habit forming." },
  7:   { emoji: '🔥', headline: 'One week streak!', body: "A whole week of showing up. That's remarkable for any brain, especially yours." },
  14:  { emoji: '⚡', headline: 'Two weeks!',        body: "Fourteen days. You didn't just try — you stuck with it. This is what change looks like." },
  30:  { emoji: '🏆', headline: '30-day streak!',   body: "A month. A full month of choosing yourself every day. This is huge." },
  50:  { emoji: '🌟', headline: '50 days!',          body: "Fifty days of focus. You've proven to yourself that consistency is possible." },
  100: { emoji: '🚀', headline: '100 days!',         body: "One hundred days. You are not the same person who started. You did this." },
};

export function StreakMilestoneOverlay({ streak, onDismiss }: Props) {
  const copy = MILESTONE_COPY[streak] ?? {
    emoji: '🔥',
    headline: `${streak}-day streak!`,
    body: "You keep showing up. Day after day. That matters more than you know.",
  };

  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.8)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, useNativeDriver: true, tension: 60, friction: 9 }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      Animated.spring(emojiScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 6 }).start();
    });
  }, []);

  function handleDismiss() {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onDismiss);
  }

  return (
    <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleDismiss} activeOpacity={1} />
      <Animated.View
        style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}
      >
        {/* Glow ring */}
        <View style={styles.glowRing}>
          <Animated.Text style={[styles.emoji, { transform: [{ scale: emojiScale }] }]}>
            {copy.emoji}
          </Animated.Text>
        </View>

        <Text style={styles.headline}>{copy.headline}</Text>
        <Text style={styles.body}>{copy.body}</Text>

        <View style={styles.streakPill}>
          <Text style={styles.streakPillText}>🔥 {streak} day streak</Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handleDismiss} activeOpacity={0.85}>
          <Text style={styles.btnText}>Keep going</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(27,42,29,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  card: {
    width: W - 48,
    backgroundColor: Colors.surface,
    borderRadius: 28,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 20,
  },
  glowRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emoji: { fontSize: 52 },
  headline: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  streakPill: {
    backgroundColor: Colors.warning + '18',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 28,
  },
  streakPillText: { fontSize: 14, fontWeight: '700', color: Colors.warning },
  btn: {
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  btnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
});

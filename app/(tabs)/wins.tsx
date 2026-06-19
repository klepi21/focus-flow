import { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  ScrollView, Animated,
} from 'react-native';
import { Colors } from '@/src/constants/colors';
import { useTaskStore } from '@/src/store/taskStore';
import { IllustrationPlaceholder } from '@/src/components/IllustrationPlaceholder';
import { useMotivationalQuote } from '@/src/hooks/useMotivationalQuote';

function getMood(count: number): { emoji: string; label: string } {
  if (count === 0) return { emoji: '😴', label: 'Rest is productive too' };
  if (count === 1) return { emoji: '🌱', label: 'You started. That matters.' };
  if (count <= 3) return { emoji: '🙂', label: 'Solid day.' };
  if (count <= 6) return { emoji: '😄', label: 'You\'re on a roll!' };
  if (count <= 10) return { emoji: '🔥', label: 'On fire today!' };
  return { emoji: '🤯', label: 'Legendary focus day.' };
}

function formatTime(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export default function WinsScreen() {
  const { tasks, streak } = useTaskStore();
  const quote = useMotivationalQuote();

  const completed = tasks.filter((t) => t.status === 'completed');
  const dropped = tasks.filter((t) => t.status === 'dropped');
  const { emoji, label } = getMood(completed.length);

  // Animated number counter
  const countAnim = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(countAnim, {
        toValue: completed.length,
        duration: 600,
        useNativeDriver: false,
      }),
      Animated.spring(emojiScale, {
        toValue: 1,
        friction: 4,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [completed.length]);

  const displayCount = countAnim.interpolate({
    inputRange: [0, completed.length || 1],
    outputRange: ['0', String(completed.length)],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Today's Wins</Text>

        {/* Mood + big number */}
        <View style={styles.heroSection}>
          <Animated.Text style={[styles.moodEmoji, { transform: [{ scale: emojiScale }] }]}>
            {emoji}
          </Animated.Text>
          <Animated.Text style={styles.bigNumber}>{displayCount}</Animated.Text>
          <Text style={styles.bigLabel}>tasks completed</Text>
          <Text style={styles.moodLabel}>{label}</Text>
        </View>

        {/* Stat cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, streak > 0 && styles.statCardGlow]}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>{streak}</Text>
            <Text style={styles.statLabel}>day streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🗑</Text>
            <Text style={[styles.statNumber, { color: Colors.textMuted }]}>{dropped.length}</Text>
            <Text style={styles.statLabel}>dropped today</Text>
            {dropped.length > 0 && (
              <Text style={styles.statNote}>dropping tasks is ok</Text>
            )}
          </View>
        </View>

        {/* Completed list */}
        {completed.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COMPLETED</Text>
            {completed.map((task) => (
              <Animated.View
                key={task.id}
                style={[styles.completedItem, { opacity: 1 }]}
              >
                <Text style={styles.completedCheck}>✅</Text>
                <Text style={styles.completedTitle} numberOfLines={2}>
                  {task.title}
                </Text>
                <Text style={styles.completedTime}>{formatTime(task.completedAt)}</Text>
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            {/* Placeholder — swap for: require('@/assets/illustrations/empty-wins.png') */}
            <IllustrationPlaceholder emoji="🏆" size={96} bgColor={Colors.surface} />
            <Text style={styles.emptyTitle}>No wins yet today</Text>
            <Text style={styles.emptySubtext}>
              Go check off a task — you've got this.
            </Text>
          </View>
        )}

        {/* Motivational quote */}
        <View style={styles.quoteCard}>
          <View style={styles.quoteAccent} />
          <Text style={styles.quoteText}>"{quote}"</Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 28,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  bigNumber: {
    fontSize: 72,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 80,
  },
  bigLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  moodLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    alignItems: 'center',
  },
  statCardGlow: {
    shadowColor: Colors.warning,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderColor: Colors.warning + '40',
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statNote: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 12,
  },
  completedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 6,
    gap: 10,
  },
  completedCheck: {
    fontSize: 16,
  },
  completedTitle: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  completedTime: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 12,
    gap: 14,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  quoteCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 20,
    gap: 14,
  },
  quoteAccent: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    alignSelf: 'stretch',
  },
  quoteText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
});

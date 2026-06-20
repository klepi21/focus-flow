import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { useTaskStore } from '@/src/store/taskStore';
import { useMotivationalQuote } from '@/src/hooks/useMotivationalQuote';
import { StreakMilestoneOverlay } from '@/src/components/StreakMilestoneOverlay';

function getMood(count: number): { emoji: string; label: string } {
  if (count === 0) return { emoji: '😴', label: 'Rest is productive too.' };
  if (count === 1) return { emoji: '🌱', label: 'You started. That matters.' };
  if (count <= 3) return { emoji: '🙂', label: 'Solid day.' };
  if (count <= 6) return { emoji: '😄', label: "You're on a roll." };
  if (count <= 10) return { emoji: '🔥', label: 'On fire today.' };
  return { emoji: '🤯', label: 'Legendary day.' };
}

function formatTime(iso?: string) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function WinsScreen() {
  const insets = useSafeAreaInsets();
  const { tasks, streak, getPendingMilestone, markMilestoneCelebrated } = useTaskStore();
  const quote = useMotivationalQuote();
  const [pendingMilestone, setPendingMilestone] = useState<number | null>(null);

  const done = tasks.filter(t => t.status === 'completed');
  const dropped = tasks.filter(t => t.status === 'dropped');
  const { emoji, label } = getMood(done.length);

  const countAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(countAnim, { toValue: done.length, duration: 700, useNativeDriver: false }),
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [done.length]);

  // Check milestone when screen mounts or streak changes
  useEffect(() => {
    const milestone = getPendingMilestone();
    if (milestone) setPendingMilestone(milestone);
  }, [streak]);

  function handleMilestoneDismiss() {
    if (pendingMilestone) {
      markMilestoneCelebrated(pendingMilestone);
      setPendingMilestone(null);
      // Check again in case multiple milestones queued (e.g. user opened app after 8 days away)
      const next = getPendingMilestone();
      if (next) setTimeout(() => setPendingMilestone(next), 500);
    }
  }

  const displayCount = countAnim.interpolate({
    inputRange: [0, Math.max(done.length, 1)],
    outputRange: ['0', String(done.length)],
  });

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Editorial header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Wins</Text>
            <Text style={styles.subtitle}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.weekBtn}
            onPress={() => router.push('/modal/weekly-stats')}
            activeOpacity={0.7}
          >
            <Text style={styles.weekBtnText}>📊 This week</Text>
          </TouchableOpacity>
        </View>

        {/* Hero — big number with emoji, centered */}
        <Animated.View style={[styles.hero, { opacity: fadeIn }]}>
          <Text style={styles.heroEmoji}>{emoji}</Text>
          <Animated.Text style={styles.heroNumber}>{displayCount}</Animated.Text>
          <Text style={styles.heroUnit}>tasks done today</Text>
          <Text style={styles.heroLabel}>{label}</Text>
        </Animated.View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.stat, streak > 0 && styles.statHighlight]}
            onPress={() => router.push('/modal/weekly-stats')}
            activeOpacity={0.7}
          >
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>🔥 streak</Text>
          </TouchableOpacity>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{dropped.length}</Text>
            <Text style={styles.statLabel}>🗑 dropped</Text>
          </View>
        </View>

        {/* Completed list */}
        {done.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed</Text>
            {done.map(task => (
              <View key={task.id} style={styles.doneItem}>
                <View style={[styles.doneCheck, { backgroundColor: Colors.primary + '20' }]}>
                  <Text style={[styles.doneCheckText, { color: Colors.primary }]}>✓</Text>
                </View>
                <Text style={styles.doneTitle} numberOfLines={2}>{task.title}</Text>
                <Text style={styles.doneTime}>{formatTime(task.completedAt)}</Text>
              </View>
            ))}
          </View>
        )}

        {done.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🏆</Text>
            <Text style={styles.emptyTitle}>No wins yet</Text>
            <Text style={styles.emptySub}>Go check off a task.</Text>
          </View>
        )}

        {/* Quote — undecorated, just beautiful text */}
        <Text style={styles.quote}>"{quote}"</Text>
      </ScrollView>

      {/* Streak milestone celebration */}
      {pendingMilestone !== null && (
        <StreakMilestoneOverlay
          streak={pendingMilestone}
          onDismiss={handleMilestoneDismiss}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 24 },

  header: {
    paddingTop: 20,
    marginBottom: 28,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 2,
  },
  subtitle: { fontSize: 15, color: Colors.textMuted, fontWeight: '500' },
  weekBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 2,
  },
  weekBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },

  hero: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.surface,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  heroEmoji: { fontSize: 56, marginBottom: 8 },
  heroNumber: {
    fontSize: 80,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -3,
    lineHeight: 88,
  },
  heroUnit: { fontSize: 15, color: Colors.textMuted, marginTop: 4 },
  heroLabel: { fontSize: 14, color: Colors.textSecondary, marginTop: 6, fontStyle: 'italic' },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statHighlight: { backgroundColor: Colors.warning + '12' },
  statValue: { fontSize: 30, fontWeight: '700', color: Colors.textPrimary, marginBottom: 2 },
  statLabel: { fontSize: 13, color: Colors.textMuted },

  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  doneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  doneCheck: {
    width: 24, height: 24, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  doneCheckText: { fontSize: 11, fontWeight: '800' },
  doneTitle: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  doneTime: { fontSize: 12, color: Colors.textMuted },

  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  emptySub: { fontSize: 14, color: Colors.textSecondary },

  quote: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
});

import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { TaskSlot } from '@/src/types';
import { useTaskStore } from '@/src/store/taskStore';
import { SlotSection } from '@/src/components/SlotSection';
import { CelebrationOverlay } from '@/src/components/CelebrationOverlay';

const ENERGY_EMOJI: Record<string, string> = {
  low: '🌙',
  medium: '🌿',
  high: '⚡',
};

const SLOTS: TaskSlot[] = ['now', 'next', 'later'];

export default function TodayScreen() {
  const [celebration, setCelebration] = useState(false);
  const insets = useSafeAreaInsets();
  const { energyLevel, streak, getActiveTasks, updateTaskStatus, moveTask, tasks } = useTaskStore();

  const date = new Date();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const allActive = SLOTS.flatMap(s => getActiveTasks(s));
  const completedToday = tasks.filter(t => t.status === 'completed');
  const totalToday = allActive.length + completedToday.length;
  const doneCount = completedToday.length;
  const progress = totalToday > 0 ? doneCount / totalToday : 0;

  function handleComplete(id: string) { updateTaskStatus(id, 'completed'); setCelebration(true); }
  function handleDrop(id: string) { updateTaskStatus(id, 'dropped'); }
  function handlePromote(id: string, slot: TaskSlot) { moveTask(id, slot); }
  function handleAddTask(slot: TaskSlot) {
    router.push({ pathname: '/modal/add-task', params: { slot } });
  }

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            {/* Large editorial date — the hero of the screen */}
            <Text style={styles.weekday}>{weekday}</Text>
            <Text style={styles.monthDay}>{monthDay}</Text>
          </View>

          <View style={styles.headerActions}>
            {streak > 0 && (
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 {streak}</Text>
              </View>
            )}
            <TouchableOpacity
              onPress={() => router.push('/modal/settings')}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress + energy — single line, muted */}
        <View style={styles.subRow}>
          {energyLevel ? (
            <Text style={styles.subText}>
              {ENERGY_EMOJI[energyLevel]} {totalToday > 0 ? `${doneCount} of ${totalToday} done` : 'No tasks yet'}
            </Text>
          ) : (
            <TouchableOpacity onPress={() => router.push('/(auth)/onboarding')} hitSlop={{ top: 8, bottom: 8, left: 0, right: 8 }}>
              <Text style={styles.subTextLink}>Set your energy →</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Progress bar — the signature element */}
        {totalToday > 0 && (
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {SLOTS.map((slot) => (
          <SlotSection
            key={slot}
            slot={slot}
            tasks={getActiveTasks(slot)}
            onAddTask={() => handleAddTask(slot)}
            onComplete={handleComplete}
            onDrop={handleDrop}
            onPromote={handlePromote}
          />
        ))}

        <TouchableOpacity
          style={styles.distractedBtn}
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/modal/distracted'); }}
          activeOpacity={0.5}
        >
          <Text style={styles.distractedText}>I got distracted</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + (Platform.OS === 'ios' ? 92 : 76) }]}
        onPress={() => handleAddTask('now')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      <CelebrationOverlay visible={celebration} onFinish={() => setCelebration(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  header: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: { flex: 1 },

  // Large editorial typography — this is the "hero" of the today screen
  weekday: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  monthDay: {
    fontSize: 34,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: -0.8,
    lineHeight: 38,
  },

  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4 },
  streakBadge: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  streakText: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  settingsIcon: { fontSize: 20 },

  subRow: { marginBottom: 12 },
  subText: { fontSize: 14, color: Colors.textMuted, fontWeight: '500' },
  subTextLink: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

  // Signature element: thin pistachio progress line
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },

  scroll: { paddingTop: 24, paddingHorizontal: 20 },

  distractedBtn: { alignItems: 'center', paddingVertical: 20 },
  distractedText: { fontSize: 13, color: Colors.textMuted, textDecorationLine: 'underline' },

  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabIcon: { fontSize: 28, color: '#FFF', lineHeight: 32, fontWeight: '300' },
});

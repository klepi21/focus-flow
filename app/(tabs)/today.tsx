import { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { TaskSlot } from '@/src/types';
import { useTaskStore } from '@/src/store/taskStore';
import { SlotSection } from '@/src/components/SlotSection';
import { StreakBadge } from '@/src/components/StreakBadge';
import { CelebrationOverlay } from '@/src/components/CelebrationOverlay';

const ENERGY_LABEL: Record<string, string> = {
  low: '🌙 Low energy day',
  medium: '⚡ Medium energy day',
  high: '🔥 High energy day',
};

const SLOTS: TaskSlot[] = ['now', 'next', 'later'];

export default function TodayScreen() {
  const [celebration, setCelebration] = useState(false);
  const {
    energyLevel,
    streak,
    getActiveTasks,
    updateTaskStatus,
    moveTask,
  } = useTaskStore();

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  function handleComplete(id: string) {
    updateTaskStatus(id, 'completed');
    setCelebration(true);
  }

  function handleDrop(id: string) {
    updateTaskStatus(id, 'dropped');
  }

  function handlePromote(id: string, slot: TaskSlot) {
    moveTask(id, slot);
  }

  function handleAddTask(slot: TaskSlot) {
    router.push({ pathname: '/modal/add-task', params: { slot } });
  }

  function handleDistracted() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/modal/distracted');
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.date}>{date}</Text>
          <Text style={styles.energy}>
            {energyLevel ? ENERGY_LABEL[energyLevel] : '👋 Choose energy level'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <StreakBadge count={streak} />
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => router.push('/modal/settings')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Main content */}
      <ScrollView
        contentContainerStyle={styles.scroll}
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

        {/* I got distracted */}
        <TouchableOpacity
          style={styles.distractedBtn}
          onPress={handleDistracted}
          activeOpacity={0.7}
        >
          <Text style={styles.distractedText}>
            😵 I got distracted — reset & refocus
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: Platform.OS === 'ios' ? 96 : 80 }]}
        onPress={() => handleAddTask('now')}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/* Celebration */}
      <CelebrationOverlay
        visible={celebration}
        onFinish={() => setCelebration(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  date: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  energy: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 0,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120,
  },
  distractedBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  distractedText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
    fontWeight: '300',
  },
});

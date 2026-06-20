import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { WaterTimer } from '@/src/components/WaterTimer';
import { useTaskStore } from '@/src/store/taskStore';
import { Task } from '@/src/types';

const BODY_DOUBLES = [
  'Imagine someone sitting quietly beside you. Working. Focused.',
  "Millions of ADHD brains are working right now. You're one of them.",
  "You showed up. That's already the hardest part.",
  'No pressure. Just you and the timer, one minute at a time.',
];

const PRESETS = [
  { label: '5 min', seconds: 300 },
  { label: '15 min', seconds: 900 },
  { label: '25 min', seconds: 1500 },
  { label: '45 min', seconds: 2700 },
];

export default function FocusScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(1500);
  const [remaining, setRemaining] = useState(1500);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [focusTaskId, setFocusTaskId] = useState<string | null>(null);
  const [markDonePrompt, setMarkDonePrompt] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgIdx = useRef(Math.floor(Math.random() * BODY_DOUBLES.length)).current;
  const doneOpacity = useRef(new Animated.Value(0)).current;

  const { getActiveTasks, updateTaskStatus } = useTaskStore();
  const nowTasks = getActiveTasks('now');
  const focusTask: Task | undefined = nowTasks.find(t => t.id === focusTaskId);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setDone(true);
            // Prompt to mark task done if one is selected
            if (focusTaskId) setMarkDonePrompt(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) clearInterval(intervalRef.current);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  useEffect(() => {
    Animated.timing(doneOpacity, { toValue: done ? 1 : 0, duration: 400, useNativeDriver: true }).start();
  }, [done]);

  // If the selected task gets completed externally, deselect it
  useEffect(() => {
    if (focusTaskId && !nowTasks.find(t => t.id === focusTaskId)) {
      setFocusTaskId(null);
    }
  }, [nowTasks]);

  function pickPreset(s: number) {
    if (running) return;
    setSelected(s); setRemaining(s); setDone(false); Haptics.selectionAsync();
  }
  function start() { setDone(false); setMarkDonePrompt(false); setRunning(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }
  function pause() { setRunning(false); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }
  function reset() { setRunning(false); setRemaining(selected); setDone(false); setMarkDonePrompt(false); }
  function again() { setRemaining(selected); setDone(false); setMarkDonePrompt(false); setRunning(true); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); }

  function handleMarkTaskDone() {
    if (focusTaskId) {
      updateTaskStatus(focusTaskId, 'completed');
      setFocusTaskId(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setMarkDonePrompt(false);
  }

  const progress = 1 - remaining / selected;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Editorial header */}
        <View style={styles.header}>
          <Text style={styles.title}>Focus</Text>
          <Text style={styles.subtitle}>
            {running
              ? focusTask ? `Working on: ${focusTask.title}` : 'Stay with it.'
              : done
                ? 'Session complete.'
                : 'Choose a duration.'}
          </Text>
        </View>

        {/* Task chip selector — NOW tasks only */}
        {nowTasks.length > 0 && !running && !done && (
          <View style={styles.taskPicker}>
            <Text style={styles.taskPickerLabel}>Working on:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.taskChips}
            >
              {nowTasks.map(task => {
                const active = task.id === focusTaskId;
                return (
                  <TouchableOpacity
                    key={task.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => {
                      setFocusTaskId(active ? null : task.id);
                      Haptics.selectionAsync();
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]} numberOfLines={1}>
                      {task.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Active focus task indicator (during session) */}
        {running && focusTask && (
          <View style={styles.activeFocusTask}>
            <View style={[styles.activeFocusDot, { backgroundColor: Colors.now }]} />
            <Text style={styles.activeFocusText} numberOfLines={1}>{focusTask.title}</Text>
          </View>
        )}

        {/* Timer — dominant visual element */}
        <View style={styles.timerWrap}>
          <WaterTimer totalSeconds={selected} remainingSeconds={remaining} isRunning={running} />
        </View>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as any }]} />
        </View>

        {/* Preset selector */}
        <View style={styles.presets}>
          {PRESETS.map(p => {
            const active = selected === p.seconds;
            return (
              <TouchableOpacity
                key={p.seconds}
                style={[styles.preset, active && styles.presetActive, running && styles.presetDisabled]}
                onPress={() => pickPreset(p.seconds)}
                disabled={running}
                activeOpacity={0.65}
              >
                <Text style={[styles.presetText, active && styles.presetTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Mark task done prompt — shown right after timer ends if task was selected */}
        {markDonePrompt && focusTask && (
          <View style={styles.markDoneCard}>
            <Text style={styles.markDoneTitle}>Did you finish it?</Text>
            <Text style={styles.markDoneTask} numberOfLines={2}>{focusTask.title}</Text>
            <View style={styles.markDoneBtns}>
              <TouchableOpacity
                style={styles.markDoneYes}
                onPress={handleMarkTaskDone}
                activeOpacity={0.85}
              >
                <Text style={styles.markDoneYesText}>✓ Mark done</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.markDoneNo}
                onPress={() => setMarkDonePrompt(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.markDoneNoText}>Not yet</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          {!running && remaining !== selected && (
            <TouchableOpacity style={styles.secondaryBtn} onPress={reset} activeOpacity={0.7}>
              <Text style={styles.secondaryText}>Reset</Text>
            </TouchableOpacity>
          )}

          {done ? (
            <TouchableOpacity style={[styles.mainBtn, { backgroundColor: Colors.success }]} onPress={again} activeOpacity={0.85}>
              <Text style={styles.mainBtnText}>Start again</Text>
            </TouchableOpacity>
          ) : running ? (
            <TouchableOpacity style={[styles.mainBtn, styles.pauseBtn]} onPress={pause} activeOpacity={0.85}>
              <Text style={[styles.mainBtnText, { color: Colors.textPrimary }]}>Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.mainBtn} onPress={start} activeOpacity={0.85}>
              <Text style={styles.mainBtnText}>
                {focusTask ? `Start — ${focusTask.title.split(' ').slice(0, 3).join(' ')}${focusTask.title.split(' ').length > 3 ? '…' : ''}` : 'Start'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Done message (when no task selected) */}
        {!markDonePrompt && (
          <Animated.View style={[styles.doneMsg, { opacity: doneOpacity }]} pointerEvents={done ? 'auto' : 'none'}>
            <Text style={styles.doneMsgText}>✓ {Math.floor(selected / 60)} minutes of real focus.</Text>
          </Animated.View>
        )}

        {/* Body double card */}
        <View style={styles.bodyCard}>
          <View style={[styles.bodyStripe, { backgroundColor: Colors.primary }]} />
          <View style={styles.bodyContent}>
            <Text style={styles.bodyTitle}>You're not alone</Text>
            <Text style={styles.bodyBody}>{BODY_DOUBLES[msgIdx]}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 24, alignItems: 'center' },

  header: { alignSelf: 'stretch', paddingTop: 20, marginBottom: 24 },
  title: { fontSize: 34, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.8, marginBottom: 4 },
  subtitle: { fontSize: 15, color: Colors.textMuted },

  taskPicker: { alignSelf: 'stretch', marginBottom: 20 },
  taskPickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  taskChips: { gap: 8, paddingRight: 4 },
  chip: {
    maxWidth: 200,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.now,
    borderColor: Colors.now,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: { color: '#FFF' },

  activeFocusTask: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.now + '12',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  activeFocusDot: { width: 8, height: 8, borderRadius: 4 },
  activeFocusText: { fontSize: 14, fontWeight: '600', color: Colors.now, flex: 1 },

  timerWrap: { marginBottom: 20 },

  progressTrack: {
    alignSelf: 'stretch', height: 3,
    backgroundColor: Colors.border, borderRadius: 2,
    overflow: 'hidden', marginBottom: 24,
  },
  progressFill: { height: '100%', borderRadius: 2, backgroundColor: Colors.primary },

  presets: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  preset: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 10, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  presetActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  presetDisabled: { opacity: 0.3 },
  presetText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  presetTextActive: { color: '#FFF' },

  markDoneCard: {
    alignSelf: 'stretch',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  markDoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  markDoneTask: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  markDoneBtns: { flexDirection: 'row', gap: 8 },
  markDoneYes: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markDoneYesText: { fontSize: 15, fontWeight: '700', color: '#FFF' },
  markDoneNo: {
    paddingHorizontal: 18,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markDoneNoText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'stretch',
    marginBottom: 20,
  },
  secondaryBtn: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  secondaryText: { fontSize: 15, fontWeight: '600', color: Colors.textSecondary },
  mainBtn: {
    flex: 1, height: 54, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
    paddingHorizontal: 12,
  },
  pauseBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
    shadowOpacity: 0, elevation: 0,
  },
  mainBtnText: { fontSize: 17, fontWeight: '700', color: '#FFF' },

  doneMsg: {
    alignSelf: 'stretch',
    backgroundColor: Colors.primary + '14',
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1, borderColor: Colors.primary + '30',
  },
  doneMsgText: { fontSize: 15, fontWeight: '600', color: Colors.primary },

  bodyCard: {
    alignSelf: 'stretch', flexDirection: 'row',
    backgroundColor: Colors.surface, borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bodyStripe: { width: 4 },
  bodyContent: { flex: 1, padding: 18 },
  bodyTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  bodyBody: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
});

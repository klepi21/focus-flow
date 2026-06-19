import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { useTaskStore } from '@/src/store/taskStore';
import { TaskSlot } from '@/src/types';

const SLOT_META: Record<TaskSlot, { emoji: string; label: string; color: string }> = {
  now: { emoji: '⚡', label: 'NOW', color: Colors.now },
  next: { emoji: '👉', label: 'NEXT', color: Colors.next },
  later: { emoji: '🌙', label: 'LATER', color: Colors.later },
};

const TIME_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
];

export default function AddTaskModal() {
  const { slot } = useLocalSearchParams<{ slot: TaskSlot }>();
  const resolvedSlot: TaskSlot = (slot as TaskSlot) ?? 'now';
  const meta = SLOT_META[resolvedSlot];

  const [title, setTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>();
  const addTask = useTaskStore((s) => s.addTask);

  function handleAdd() {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTask(title.trim(), resolvedSlot, estimatedMinutes);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Slot badge */}
          <View style={[styles.slotBadge, { borderColor: meta.color + '60' }]}>
            <Text style={[styles.slotBadgeText, { color: meta.color }]}>
              {meta.emoji} {meta.label}
            </Text>
          </View>

          <Text style={styles.title}>Add a task</Text>

          {/* Input */}
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleAdd}
            maxLength={100}
            multiline={false}
          />

          {/* Time estimate */}
          <Text style={styles.timeLabel}>How long will it take? (optional)</Text>
          <View style={styles.timeOptions}>
            {TIME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.timeBtn,
                  estimatedMinutes === opt.value && styles.timeBtnActive,
                ]}
                onPress={() =>
                  setEstimatedMinutes(estimatedMinutes === opt.value ? undefined : opt.value)
                }
              >
                <Text
                  style={[
                    styles.timeBtnText,
                    estimatedMinutes === opt.value && styles.timeBtnTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Add button */}
          <TouchableOpacity
            style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
            onPress={handleAdd}
            disabled={!title.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.addBtnText}>Add to {meta.label}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  kav: {
    flex: 1,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 28,
  },
  slotBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 12,
  },
  slotBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 14,
    padding: 18,
    fontSize: 17,
    color: Colors.textPrimary,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  timeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 32,
  },
  timeBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: Colors.surfaceHigh,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timeBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  timeBtnTextActive: {
    color: '#FFFFFF',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  addBtnDisabled: {
    opacity: 0.4,
    shadowOpacity: 0,
    elevation: 0,
  },
  addBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

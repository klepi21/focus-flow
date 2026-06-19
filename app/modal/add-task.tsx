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

const SLOT_META: Record<TaskSlot, { label: string; color: string }> = {
  now:   { label: 'Now',   color: Colors.now },
  next:  { label: 'Next',  color: Colors.next },
  later: { label: 'Later', color: Colors.later },
};

const TIME_OPTIONS = [
  { label: '5 min', value: 5 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hr', value: 60 },
];

export default function AddTaskModal() {
  const { slot } = useLocalSearchParams<{ slot: TaskSlot }>();
  const [selectedSlot, setSelectedSlot] = useState<TaskSlot>((slot as TaskSlot) ?? 'now');
  const [title, setTitle] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | undefined>();
  const addTask = useTaskStore((s) => s.addTask);
  const meta = SLOT_META[selectedSlot];

  function handleAdd() {
    if (!title.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTask(title.trim(), selectedSlot, estimatedMinutes);
    router.back();
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.handle} />

            <Text style={styles.title}>New task</Text>

            {/* Slot picker — text buttons only, no pills */}
            <Text style={styles.fieldLabel}>Add to</Text>
            <View style={styles.slotRow}>
              {(Object.keys(SLOT_META) as TaskSlot[]).map((s) => {
                const m = SLOT_META[s];
                const active = selectedSlot === s;
                return (
                  <TouchableOpacity
                    key={s}
                    style={[styles.slotBtn, active && { borderColor: m.color, backgroundColor: m.color + '12' }]}
                    onPress={() => { setSelectedSlot(s); Haptics.selectionAsync(); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.slotBtnText, active && { color: m.color }]}>{m.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Task name */}
            <Text style={styles.fieldLabel}>Task name</Text>
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
            />

            {/* Time estimate */}
            <Text style={styles.fieldLabel}>Time needed <Text style={styles.optional}>(optional)</Text></Text>
            <View style={styles.timeRow}>
              {TIME_OPTIONS.map((opt) => {
                const active = estimatedMinutes === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.timeBtn, active && styles.timeBtnActive]}
                    onPress={() => setEstimatedMinutes(active ? undefined : opt.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.timeBtnText, active && styles.timeBtnTextActive]}>{opt.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add button */}
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: title.trim() ? meta.color : Colors.border }]}
              onPress={handleAdd}
              disabled={!title.trim()}
              activeOpacity={0.85}
            >
              <Text style={[styles.addBtnText, { color: title.trim() ? '#FFF' : Colors.textMuted }]}>
                Add to {meta.label}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safe: { flex: 1 },
  kav: { flex: 1 },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  handle: {
    width: 36, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 28,
  },
  title: { fontSize: 26, fontWeight: '700', color: Colors.textPrimary, marginBottom: 24, letterSpacing: -0.4 },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: Colors.textMuted, letterSpacing: 0.3, textTransform: 'uppercase', marginBottom: 10 },
  optional: { fontWeight: '400', textTransform: 'none', letterSpacing: 0 },
  slotRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  slotBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', backgroundColor: Colors.surface,
  },
  slotBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16, fontSize: 16, color: Colors.textPrimary,
    borderWidth: 1, borderColor: Colors.border, marginBottom: 24,
  },
  timeRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  timeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  timeBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '12' },
  timeBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  timeBtnTextActive: { color: Colors.primary },
  addBtn: {
    borderRadius: 14, height: 54,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  addBtnText: { fontSize: 16, fontWeight: '700' },
  cancelBtn: { alignItems: 'center', paddingVertical: 12 },
  cancelText: { fontSize: 15, color: Colors.textMuted },
});

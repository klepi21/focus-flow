import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Task, TaskSlot } from '@/src/types';
import { TaskCard } from './TaskCard';

const SLOT_CONFIG: Record<TaskSlot, {
  label: string;
  color: string;
  tint: string;
  emptyText: string;
}> = {
  now:   { label: 'Now',   color: Colors.now,   tint: 'rgba(212,112,58,0.07)',   emptyText: "What's the most important thing right now?" },
  next:  { label: 'Next',  color: Colors.next,  tint: 'rgba(75,142,200,0.07)',   emptyText: 'What comes after?' },
  later: { label: 'Later', color: Colors.later, tint: 'rgba(127,168,153,0.07)',  emptyText: 'Anything else on your mind?' },
};

interface Props {
  slot: TaskSlot;
  tasks: Task[];
  onAddTask: () => void;
  onComplete: (id: string) => void;
  onDrop: (id: string) => void;
  onPromote: (id: string, newSlot: TaskSlot) => void;
}

export function SlotSection({ slot, tasks, onAddTask, onComplete, onDrop, onPromote }: Props) {
  const cfg = SLOT_CONFIG[slot];

  return (
    // Each slot is its own "room" — a tinted container that gives identity without visual noise
    <View style={[styles.room, { backgroundColor: cfg.tint }]}>
      {/* Header: label left, add button right */}
      <View style={styles.roomHeader}>
        <View style={[styles.labelLine, { backgroundColor: cfg.color }]} />
        <Text style={[styles.label, { color: cfg.color }]}>{cfg.label}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={onAddTask}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.addBtnText, { color: cfg.color }]}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Tasks or empty state */}
      {tasks.length === 0 ? (
        <TouchableOpacity onPress={onAddTask} activeOpacity={0.5} style={styles.emptyWrap}>
          <Text style={styles.emptyText}>{cfg.emptyText}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDrop={onDrop}
              onPromote={onPromote}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  room: {
    borderRadius: 20,
    marginBottom: 12,
    padding: 16,
    // No border — the tint IS the identity. Borders add noise.
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  labelLine: {
    width: 3,
    height: 16,
    borderRadius: 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
    flex: 1,
  },
  addBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '300',
  },
  emptyWrap: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  taskList: {
    gap: 0,
  },
});

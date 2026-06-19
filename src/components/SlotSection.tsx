import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { Task, TaskSlot } from '@/src/types';
import { TaskCard } from './TaskCard';

const SLOT_CONFIG: Record<TaskSlot, { emoji: string; label: string; description: string; color: string }> = {
  now: { emoji: '⚡', label: 'NOW', description: 'do this first', color: Colors.now },
  next: { emoji: '👉', label: 'NEXT', description: 'up next', color: Colors.next },
  later: { emoji: '🌙', label: 'LATER', description: 'not yet', color: Colors.later },
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
  const config = SLOT_CONFIG[slot];
  const isLater = slot === 'later';

  return (
    <View style={[styles.section, isLater && styles.sectionMuted]}>
      {/* Section header */}
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.label, { color: config.color }]}>
          {config.emoji} {config.label}
        </Text>
        <Text style={styles.description}>{config.description}</Text>
      </View>

      {/* Tasks */}
      {tasks.length === 0 ? (
        <TouchableOpacity style={styles.emptySlot} onPress={onAddTask} activeOpacity={0.6}>
          <Text style={styles.emptyText}>＋ Add your first task</Text>
        </TouchableOpacity>
      ) : (
        <>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={onComplete}
              onDrop={onDrop}
              onPromote={onPromote}
            />
          ))}
          <TouchableOpacity style={styles.addMore} onPress={onAddTask} activeOpacity={0.6}>
            <Text style={styles.addMoreText}>＋ Add another</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 28,
  },
  sectionMuted: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  description: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 'auto',
  },
  emptySlot: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  addMore: {
    paddingTop: 4,
    paddingLeft: 4,
  },
  addMoreText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});

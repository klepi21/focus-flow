import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Task, TaskSlot } from '@/src/types';

const SLOT_COLORS: Record<TaskSlot, string> = {
  now: Colors.now,
  next: Colors.next,
  later: Colors.later,
};

const SLOT_ABOVE: Record<TaskSlot, TaskSlot | null> = {
  now: null,
  next: 'now',
  later: 'next',
};

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onDrop: (id: string) => void;
  onPromote: (id: string, slot: TaskSlot) => void;
}

export function TaskCard({ task, onComplete, onDrop, onPromote }: Props) {
  const [completed, setCompleted] = useState(false);
  const swipeableRef = useRef<Swipeable>(null);
  const checkScale = useRef(new Animated.Value(1)).current;
  const color = SLOT_COLORS[task.slot];
  const slotAbove = SLOT_ABOVE[task.slot];

  function handleComplete() {
    if (completed) return;
    setCompleted(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 1.2, friction: 4, useNativeDriver: true }),
      Animated.timing(checkScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => onComplete(task.id), 300);
    });
  }

  function handleDrop() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    swipeableRef.current?.close();
    onDrop(task.id);
  }

  function handlePromote() {
    if (!slotAbove) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    swipeableRef.current?.close();
    onPromote(task.id, slotAbove);
  }

  function renderRightActions(_: unknown, dragX: Animated.AnimatedInterpolation<number>) {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={handleDrop} activeOpacity={0.8}>
        <Animated.View style={[styles.swipeRight, { transform: [{ scale }] }]}>
          <Text style={styles.swipeIcon}>🗑</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  function renderLeftActions(_: unknown, dragX: Animated.AnimatedInterpolation<number>) {
    if (!slotAbove) return null;
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0.8, 1],
      extrapolate: 'clamp',
    });
    return (
      <TouchableOpacity onPress={handlePromote} activeOpacity={0.8}>
        <Animated.View style={[styles.swipeLeft, { backgroundColor: color + 'CC', transform: [{ scale }] }]}>
          <Text style={styles.swipeIcon}>↑</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  }

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootRight={false}
      overshootLeft={false}
      friction={2}
    >
      <View style={[styles.card, { borderLeftColor: color }]}>
        <TouchableOpacity
          onPress={handleComplete}
          style={styles.checkboxWrap}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Animated.View
            style={[
              styles.checkbox,
              { borderColor: color },
              completed && { backgroundColor: color },
              { transform: [{ scale: checkScale }] },
            ]}
          >
            {completed && <Text style={styles.checkmark}>✓</Text>}
          </Animated.View>
        </TouchableOpacity>

        <Text
          style={[styles.title, completed && styles.titleDone]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {task.estimatedMinutes !== undefined && (
          <View style={styles.timeTag}>
            <Text style={styles.timeText}>{task.estimatedMinutes} min</Text>
          </View>
        )}
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderLeftWidth: 3,
    paddingVertical: 16,
    paddingRight: 16,
    paddingLeft: 12,
    marginBottom: 8,
    gap: 12,
  },
  checkboxWrap: {
    padding: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  titleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  timeTag: {
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  swipeRight: {
    backgroundColor: Colors.danger,
    borderRadius: 12,
    width: 72,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  swipeLeft: {
    borderRadius: 12,
    width: 72,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  swipeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
});

import { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { Task, TaskSlot } from '@/src/types';

const SLOT_COLOR: Record<TaskSlot, string> = {
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
  const [done, setDone] = useState(false);
  const swipeRef = useRef<Swipeable>(null);
  const checkScale = useRef(new Animated.Value(1)).current;
  const cardOpacity = useRef(new Animated.Value(1)).current;
  const color = SLOT_COLOR[task.slot];
  const slotAbove = SLOT_ABOVE[task.slot];

  function handleComplete() {
    if (done) return;
    setDone(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 1.3, friction: 4, useNativeDriver: true }),
      Animated.timing(checkScale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(cardOpacity, { toValue: 0, duration: 240, useNativeDriver: true }).start();
        setTimeout(() => onComplete(task.id), 240);
      }, 160);
    });
  }

  function renderRight(_: unknown, dragX: Animated.AnimatedInterpolation<number>) {
    const scale = dragX.interpolate({ inputRange: [-72, 0], outputRange: [1, 0.85], extrapolate: 'clamp' });
    return (
      <Animated.View style={[styles.swipeRight, { transform: [{ scale }] }]}>
        <TouchableOpacity style={styles.swipeTap} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); swipeRef.current?.close(); onDrop(task.id); }}>
          <Text style={styles.swipeIcon}>🗑</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  function renderLeft(_: unknown, dragX: Animated.AnimatedInterpolation<number>) {
    if (!slotAbove) return null;
    const scale = dragX.interpolate({ inputRange: [0, 72], outputRange: [0.85, 1], extrapolate: 'clamp' });
    return (
      <Animated.View style={[styles.swipeLeft, { backgroundColor: color + 'DD', transform: [{ scale }] }]}>
        <TouchableOpacity style={styles.swipeTap} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); swipeRef.current?.close(); onPromote(task.id, slotAbove); }}>
          <Text style={styles.swipeIcon}>↑</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: cardOpacity, marginBottom: 8 }}>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRight}
        renderLeftActions={renderLeft}
        overshootRight={false}
        overshootLeft={false}
        friction={2}
      >
        <View style={styles.card}>
          {/* Slot color: only here, nowhere else on the card */}
          <View style={[styles.stripe, { backgroundColor: color }]} />

          {/* Checkbox — rounds to filled circle with slot color when done */}
          <TouchableOpacity onPress={handleComplete} hitSlop={{ top: 16, bottom: 16, left: 8, right: 16 }}>
            <Animated.View style={[
              styles.checkbox,
              { borderColor: color },
              done && { backgroundColor: color },
              { transform: [{ scale: checkScale }] },
            ]}>
              {done && <Text style={styles.check}>✓</Text>}
            </Animated.View>
          </TouchableOpacity>

          {/* Title — 17pt, the iOS standard for list items */}
          <Text style={[styles.title, done && styles.titleDone]} numberOfLines={2}>
            {task.title}
          </Text>

          {/* Time estimate — plain muted text, right aligned */}
          {task.estimatedMinutes !== undefined && (
            <Text style={styles.time}>{task.estimatedMinutes}m</Text>
          )}
        </View>
      </Swipeable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    paddingVertical: 15,
    paddingRight: 16,
    gap: 12,
    // Real shadow — no border. Shadow IS the depth, not a border.
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  stripe: {
    width: 4,
    alignSelf: 'stretch',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11, // circle
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  title: {
    flex: 1,
    fontSize: 17, // iOS standard for list items
    fontWeight: '400',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  titleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  time: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  swipeRight: {
    width: 64,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 8,
  },
  swipeLeft: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 8,
  },
  swipeTap: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeIcon: { fontSize: 20 },
});

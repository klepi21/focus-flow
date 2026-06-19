import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface Props {
  count: number;
}

export function StreakBadge({ count }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={styles.count}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 56,
  },
  flame: {
    fontSize: 16,
    lineHeight: 20,
  },
  count: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
});

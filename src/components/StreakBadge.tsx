import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface Props {
  count: number;
}

export function StreakBadge({ count }: Props) {
  return (
    <View style={[styles.badge, count > 0 && { borderColor: Colors.warning + '50', backgroundColor: Colors.warning + '10' }]}>
      <Text style={styles.flame}>🔥</Text>
      <Text style={[styles.count, count > 0 && { color: Colors.warning }]}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  flame: { fontSize: 14 },
  count: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
});

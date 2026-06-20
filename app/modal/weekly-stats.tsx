import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/src/constants/colors';
import { useTaskStore } from '@/src/store/taskStore';
import { DailyRecord } from '@/src/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_MAX_HEIGHT = 140;
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return DAY_LABELS[d.getDay()];
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function energyDot(energy: DailyRecord['energy']): string {
  if (energy === 'high')   return '⚡';
  if (energy === 'medium') return '🌿';
  if (energy === 'low')    return '🌙';
  return '—';
}

function totalStats(records: DailyRecord[]) {
  return records.reduce(
    (acc, r) => ({
      completed: acc.completed + r.completed,
      dropped: acc.dropped + r.dropped,
      bestStreak: Math.max(acc.bestStreak, r.streak),
    }),
    { completed: 0, dropped: 0, bestStreak: 0 }
  );
}

export default function WeeklyStatsModal() {
  const insets = useSafeAreaInsets();
  const { weeklyHistory, streak } = useTaskStore();

  // Last 7 days, oldest → newest for the bar chart
  const last7 = [...weeklyHistory].slice(0, 7).reverse();
  const maxCompleted = Math.max(...last7.map(r => r.completed), 1);
  const { completed, dropped, bestStreak } = totalStats(last7);
  const completionRate = completed + dropped > 0
    ? Math.round((completed / (completed + dropped)) * 100)
    : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16 }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>This Week</Text>
          <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.closeBtn}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Bar chart */}
        {last7.length > 0 ? (
          <View style={styles.chartCard}>
            <Text style={styles.chartLabel}>Tasks Completed</Text>
            <View style={styles.chart}>
              {last7.map((rec, i) => {
                const barH = Math.max(4, (rec.completed / maxCompleted) * BAR_MAX_HEIGHT);
                return (
                  <View key={rec.date} style={styles.barCol}>
                    <Text style={styles.barCount}>{rec.completed}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.bar, { height: barH }]} />
                    </View>
                    <Text style={styles.barDay}>{dayLabel(rec.date)}</Text>
                    <Text style={styles.barDate}>{shortDate(rec.date)}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptySub}>Complete tasks each day to build your stats.</Text>
          </View>
        )}

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{completed}</Text>
            <Text style={styles.summaryLabel}>Done</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{completionRate}%</Text>
            <Text style={styles.summaryLabel}>Rate</Text>
          </View>
          <View style={[styles.summaryCard, streak > 0 && styles.summaryCardStreak]}>
            <Text style={styles.summaryValue}>{streak}</Text>
            <Text style={styles.summaryLabel}>🔥 Streak</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{bestStreak}</Text>
            <Text style={styles.summaryLabel}>Best</Text>
          </View>
        </View>

        {/* Day breakdown */}
        {last7.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Day by Day</Text>
            {[...last7].reverse().map((rec) => (
              <View key={rec.date} style={styles.dayRow}>
                <View style={styles.dayLeft}>
                  <Text style={styles.dayName}>{dayLabel(rec.date)}</Text>
                  <Text style={styles.dayDate}>{shortDate(rec.date)}</Text>
                </View>
                <Text style={styles.dayEnergy}>{energyDot(rec.energy)}</Text>
                <View style={styles.dayRight}>
                  <Text style={styles.dayDone}>
                    <Text style={styles.dayDoneNum}>{rec.completed}</Text>
                    <Text style={styles.dayDoneSub}> done</Text>
                  </Text>
                  {rec.dropped > 0 && (
                    <Text style={styles.dayDropped}>{rec.dropped} dropped</Text>
                  )}
                </View>
                {rec.streak > 0 && (
                  <View style={styles.dayStreakBadge}>
                    <Text style={styles.dayStreakText}>🔥{rec.streak}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, letterSpacing: -0.6 },
  closeBtn: { fontSize: 16, fontWeight: '600', color: Colors.primary },

  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 60,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  barCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  barTrack: {
    width: 28,
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 6,
  },
  barDay: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  barDate: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  emptyChart: {
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    marginBottom: 14,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  emptySub: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 24 },

  summaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  summaryCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryCardStreak: {
    backgroundColor: Colors.warning + '14',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  summaryLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '500' },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 6,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  dayLeft: { width: 44 },
  dayName: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary },
  dayDate: { fontSize: 11, color: Colors.textMuted },
  dayEnergy: { fontSize: 16, width: 24, textAlign: 'center' },
  dayRight: { flex: 1 },
  dayDone: { fontSize: 14 },
  dayDoneNum: { fontWeight: '700', color: Colors.textPrimary },
  dayDoneSub: { color: Colors.textMuted },
  dayDropped: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  dayStreakBadge: {
    backgroundColor: Colors.warning + '18',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  dayStreakText: { fontSize: 11, fontWeight: '700', color: Colors.warning },
});

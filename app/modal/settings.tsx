import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
  ScrollView, Switch, Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { useTaskStore } from '@/src/store/taskStore';
import { EnergyLevel } from '@/src/types';

const ENERGY_OPTIONS: { level: EnergyLevel; emoji: string; label: string }[] = [
  { level: 'low', emoji: '🌙', label: 'Low' },
  { level: 'medium', emoji: '🔥', label: 'Medium' },
  { level: 'high', emoji: '⚡', label: 'High' },
];

const HOUR_OPTIONS = [6, 7, 8, 9, 10, 11, 12];

export default function SettingsScreen() {
  const {
    energyLevel,
    setEnergyLevel,
    notificationEnabled,
    notificationHour,
    setNotificationEnabled,
    setNotificationTime,
    isPremium,
    tasks,
    clearPendingTasks,
  } = useTaskStore();

  const [localHour, setLocalHour] = useState(notificationHour);

  function handleEnergyChange(level: EnergyLevel) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEnergyLevel(level);
  }

  function handleHourChange(hour: number) {
    Haptics.selectionAsync();
    setLocalHour(hour);
    setNotificationTime(hour, 0);
  }

  function handleToggleNotifications(val: boolean) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationEnabled(val);
  }

  function handleClearTasks() {
    Alert.alert(
      'Clear all tasks?',
      'This will remove all pending tasks for today. Completed tasks stay in your wins.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearPendingTasks();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  }

  const APP_VERSION = '1.0.0';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Handle */}
        <View style={styles.handle} />
        <Text style={styles.title}>Settings</Text>

        {/* ── Energy Level ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TODAY'S ENERGY</Text>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Change your energy for today</Text>
            <View style={styles.energyRow}>
              {ENERGY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.level}
                  style={[
                    styles.energyBtn,
                    energyLevel === opt.level && styles.energyBtnActive,
                  ]}
                  onPress={() => handleEnergyChange(opt.level)}
                >
                  <Text style={styles.energyEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.energyLabel,
                      energyLevel === opt.level && styles.energyLabelActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Notifications ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MORNING REMINDER</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Daily reminder</Text>
              <Switch
                value={notificationEnabled}
                onValueChange={handleToggleNotifications}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>

            {notificationEnabled && (
              <>
                <View style={styles.dividerLine} />
                <Text style={styles.cardLabel}>Reminder time</Text>
                <View style={styles.hourRow}>
                  {HOUR_OPTIONS.map((h) => (
                    <TouchableOpacity
                      key={h}
                      style={[
                        styles.hourBtn,
                        localHour === h && styles.hourBtnActive,
                      ]}
                      onPress={() => handleHourChange(h)}
                    >
                      <Text
                        style={[
                          styles.hourText,
                          localHour === h && styles.hourTextActive,
                        ]}
                      >
                        {h < 12 ? `${h}am` : `${h === 12 ? 12 : h - 12}pm`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>

        {/* ── Premium ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUBSCRIPTION</Text>
          <TouchableOpacity
            style={[styles.card, styles.premiumCard]}
            onPress={() => {
              router.push('/modal/paywall');
            }}
            activeOpacity={0.85}
          >
            <View style={styles.premiumRow}>
              <View>
                <Text style={styles.premiumTitle}>
                  {isPremium ? '✨ Premium Active' : '✨ Go Premium'}
                </Text>
                <Text style={styles.premiumSub}>
                  {isPremium
                    ? 'Thank you for supporting Focus Flow'
                    : 'Unlock all features — $9.99/month'}
                </Text>
              </View>
              {!isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>Upgrade</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Tasks ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TASKS</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.row} onPress={handleClearTasks}>
              <Text style={[styles.rowLabel, { color: Colors.danger }]}>
                Clear pending tasks
              </Text>
              <Text style={styles.rowArrow}>→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── About ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Version</Text>
              <Text style={styles.rowValue}>{APP_VERSION}</Text>
            </View>
            <View style={styles.dividerLine} />
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tasks today</Text>
              <Text style={styles.rowValue}>{tasks.length}</Text>
            </View>
          </View>
        </View>

        {/* Close */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Text style={styles.closeBtnText}>Done</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 48 },
  handle: {
    width: 40, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26, fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 28,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 2,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLabel: {
    fontSize: 13, color: Colors.textSecondary,
    marginBottom: 12,
  },
  energyRow: { flexDirection: 'row', gap: 10 },
  energyBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 4,
  },
  energyBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  energyEmoji: { fontSize: 22 },
  energyLabel: { fontSize: 12, fontWeight: '600', color: Colors.textSecondary },
  energyLabelActive: { color: Colors.primaryLight },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  rowLabel: { fontSize: 16, color: Colors.textPrimary, fontWeight: '500' },
  rowValue: { fontSize: 15, color: Colors.textSecondary },
  rowArrow: { fontSize: 16, color: Colors.textMuted },
  dividerLine: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  hourRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  hourBtn: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 100,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hourBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hourText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  hourTextActive: { color: '#FFFFFF' },
  premiumCard: { borderColor: Colors.primary + '40' },
  premiumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumTitle: { fontSize: 16, fontWeight: '700', color: Colors.primaryLight, marginBottom: 4 },
  premiumSub: { fontSize: 13, color: Colors.textSecondary },
  premiumBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  premiumBadgeText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  closeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  closeBtnText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
});

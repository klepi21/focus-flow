import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';
import { useTaskStore } from '@/src/store/taskStore';
import { purchasePremium, restorePurchases } from '@/src/lib/revenuecat';

const FEATURES = [
  { emoji: '♾️', title: 'Unlimited tasks', desc: 'No cap on NOW/NEXT/LATER tasks' },
  { emoji: '📊', title: 'Weekly reports', desc: 'See your focus trends over time' },
  { emoji: '🎵', title: 'Custom boop sounds', desc: 'Personalize your completion sounds' },
  { emoji: '🎨', title: 'Theme customization', desc: 'Unlock additional color themes' },
  { emoji: '☁️', title: 'Cloud sync', desc: 'Your tasks across all devices' },
];

export default function PaywallScreen() {
  const [selected, setSelected] = useState<'monthly' | 'annual'>('annual');
  const [loading, setLoading] = useState(false);
  const setIsPremium = useTaskStore((s) => s.setIsPremium);

  async function handlePurchase() {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const success = await purchasePremium(selected);
      if (success) {
        setIsPremium(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Welcome to Premium! ✨', 'All features are now unlocked.', [
          { text: 'Let\'s go!', onPress: () => router.back() },
        ]);
      }
    } catch {
      Alert.alert('Something went wrong', 'Please try again or restore your purchases.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRestore() {
    setLoading(true);
    try {
      const success = await restorePurchases();
      if (success) {
        setIsPremium(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Restored! ✨', 'Your premium access has been restored.', [
          { text: 'Done', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('No purchases found', 'No previous purchase was found for this Apple ID.');
      }
    } catch {
      Alert.alert('Restore failed', 'Please check your internet connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Handle + close */}
        <View style={styles.topRow}>
          <View style={styles.handle} />
          <TouchableOpacity onPress={() => router.back()} style={styles.closeX}>
            <Text style={styles.closeXText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <Text style={styles.badge}>✨ PREMIUM</Text>
        <Text style={styles.title}>Focus without{'\n'}limits</Text>
        <Text style={styles.subtitle}>
          Everything you need to manage your ADHD brain — every day.
        </Text>

        {/* Feature list */}
        <View style={styles.featureList}>
          {FEATURES.map((f) => (
            <View key={f.title} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{f.emoji}</Text>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Plan selector */}
        <View style={styles.plans}>
          <TouchableOpacity
            style={[styles.plan, selected === 'annual' && styles.planActive]}
            onPress={() => { setSelected('annual'); Haptics.selectionAsync(); }}
          >
            <View style={styles.planBestValue}>
              <Text style={styles.planBestValueText}>BEST VALUE</Text>
            </View>
            <Text style={[styles.planName, selected === 'annual' && styles.planNameActive]}>
              Annual
            </Text>
            <Text style={[styles.planPrice, selected === 'annual' && styles.planPriceActive]}>
              $59.99
            </Text>
            <Text style={styles.planPer}>per year</Text>
            <Text style={styles.planSavings}>Save 50% vs monthly</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.plan, selected === 'monthly' && styles.planActive]}
            onPress={() => { setSelected('monthly'); Haptics.selectionAsync(); }}
          >
            <Text style={[styles.planName, selected === 'monthly' && styles.planNameActive]}>
              Monthly
            </Text>
            <Text style={[styles.planPrice, selected === 'monthly' && styles.planPriceActive]}>
              $9.99
            </Text>
            <Text style={styles.planPer}>per month</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.cta, loading && styles.ctaLoading]}
          onPress={handlePurchase}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaText}>
              Start {selected === 'annual' ? 'Annual' : 'Monthly'} Plan →
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.restoreBtn}
          onPress={handleRestore}
          disabled={loading}
        >
          <Text style={styles.restoreText}>Restore purchases</Text>
        </TouchableOpacity>

        <Text style={styles.legal}>
          Payment will be charged to your Apple ID. Subscription auto-renews unless
          cancelled at least 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 48 },
  topRow: {
    alignItems: 'center',
    marginBottom: 28,
    position: 'relative',
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  closeX: {
    position: 'absolute',
    right: 0,
    top: -6,
    width: 32, height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeXText: { fontSize: 18, color: Colors.textMuted },
  badge: {
    fontSize: 12, fontWeight: '800',
    color: Colors.primaryLight,
    letterSpacing: 2,
    marginBottom: 10,
  },
  title: {
    fontSize: 36, fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 44,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15, color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  featureList: {
    gap: 16,
    marginBottom: 32,
  },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  featureEmoji: { fontSize: 22, width: 28, textAlign: 'center', marginTop: 1 },
  featureText: { flex: 1 },
  featureTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  featureDesc: { fontSize: 13, color: Colors.textSecondary },
  plans: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  plan: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'visible',
    paddingTop: 24,
  },
  planActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  planBestValue: {
    position: 'absolute',
    top: -12,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  planBestValueText: { fontSize: 9, fontWeight: '800', color: '#FFFFFF', letterSpacing: 1 },
  planName: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  planNameActive: { color: Colors.primaryLight },
  planPrice: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  planPriceActive: { color: Colors.primaryLight },
  planPer: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  planSavings: { fontSize: 11, fontWeight: '600', color: Colors.success },
  cta: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  ctaLoading: { opacity: 0.7 },
  ctaText: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  restoreBtn: { alignItems: 'center', paddingVertical: 12, marginBottom: 16 },
  restoreText: { fontSize: 14, color: Colors.textSecondary },
  legal: {
    fontSize: 11, color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 17,
  },
});

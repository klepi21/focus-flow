import { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, Animated, TextInput,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/src/constants/colors';

// Breathing circle animation — placeholder for breathe.json Lottie
// When assets/animations/breathe.json is ready, replace with:
//   import LottieView from 'lottie-react-native';
//   <LottieView source={require('@/assets/animations/breathe.json')} autoPlay loop />

function BreathingCircle() {
  const scale = useRef(new Animated.Value(1)).current;
  const [label, setLabel] = useState('Breathe in');

  useEffect(() => {
    const breath = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.4,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    breath.start();

    let inhale = true;
    const labelInterval = setInterval(() => {
      inhale = !inhale;
      setLabel(inhale ? 'Breathe in' : 'Breathe out');
    }, 4000);

    return () => {
      breath.stop();
      clearInterval(labelInterval);
    };
  }, []);

  return (
    <View style={styles.breatheWrap}>
      <Animated.View style={[styles.breatheCircle, { transform: [{ scale }] }]}>
        <View style={styles.breatheInner} />
      </Animated.View>
      <Text style={styles.breatheLabel}>{label}</Text>
    </View>
  );
}

export default function DistractedModal() {
  const [note, setNote] = useState('');

  function handleBack() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        {/* Handle */}
        <View style={styles.handle} />

        <Text style={styles.title}>Take a breath. 🌬️</Text>
        <Text style={styles.subtitle}>
          Getting distracted is normal. Your brain is not broken.
        </Text>

        {/* Breathing animation */}
        <BreathingCircle />

        {/* Optional note */}
        <TextInput
          style={styles.noteInput}
          placeholder="What pulled you away? (optional)"
          placeholderTextColor={Colors.textMuted}
          value={note}
          onChangeText={setNote}
          multiline
          maxLength={200}
        />

        {/* Back to work button */}
        <TouchableOpacity style={styles.backBtn} onPress={handleBack} activeOpacity={0.85}>
          <Text style={styles.backBtnText}>I'm back. Let's go. →</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dismissBtn} onPress={() => router.back()}>
          <Text style={styles.dismissText}>Close</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  breatheWrap: {
    alignItems: 'center',
    marginBottom: 40,
  },
  breatheCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary + '20',
    borderWidth: 2,
    borderColor: Colors.primary + '60',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  breatheInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary + '40',
  },
  breatheLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  noteInput: {
    width: '100%',
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 80,
    marginBottom: 28,
    textAlignVertical: 'top',
  },
  backBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  backBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dismissBtn: {
    paddingVertical: 12,
  },
  dismissText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

import { useEffect } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { useTaskStore } from '@/src/store/taskStore';
import { Colors } from '@/src/constants/colors';

function todayString() {
  return new Date().toISOString().split('T')[0];
}

export default function Index() {
  const _hasHydrated = useTaskStore((s) => s._hasHydrated);
  const todayEnergyDate = useTaskStore((s) => s.todayEnergyDate);
  const checkAndResetDay = useTaskStore((s) => s.checkAndResetDay);

  useEffect(() => {
    if (_hasHydrated) {
      checkAndResetDay();
    }
  }, [_hasHydrated]);

  // Show dark splash while AsyncStorage is loading
  if (!_hasHydrated) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  // Energy was already set today → skip onboarding
  if (todayEnergyDate === todayString()) {
    return <Redirect href="/(tabs)/today" />;
  }

  return <Redirect href="/(auth)/onboarding" />;
}

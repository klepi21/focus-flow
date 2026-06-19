import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import { initRevenueCat } from '@/src/lib/revenuecat';
import { useTaskStore } from '@/src/store/taskStore';
import { Colors } from '@/src/constants/colors';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function requestNotificationPermission() {
  if (Platform.OS !== 'ios') return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }
}

async function scheduleReminder(hour: number, minute: number) {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Good morning! ⚡',
      body: "Time to plan your day. How's your energy today?",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export default function RootLayout() {
  const notificationEnabled = useTaskStore((s) => s.notificationEnabled);
  const notificationHour = useTaskStore((s) => s.notificationHour);
  const notificationMinute = useTaskStore((s) => s.notificationMinute);
  const _hasHydrated = useTaskStore((s) => s._hasHydrated);

  useEffect(() => {
    initRevenueCat();
    requestNotificationPermission();
  }, []);

  // Re-schedule reminder whenever settings change
  useEffect(() => {
    if (!_hasHydrated) return;
    if (notificationEnabled) {
      scheduleReminder(notificationHour, notificationMinute);
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [_hasHydrated, notificationEnabled, notificationHour, notificationMinute]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal/add-task" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/distracted" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/settings" options={{ presentation: 'modal' }} />
        <Stack.Screen name="modal/paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

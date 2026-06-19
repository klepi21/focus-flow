import { Tabs } from 'expo-router';
import { Colors } from '@/src/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarActiveTintColor: Colors.primaryLight,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{ title: 'Today', tabBarIcon: ({ color, focused }) => <TabIcon emoji="⚡" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="focus"
        options={{ title: 'Focus', tabBarIcon: ({ color, focused }) => <TabIcon emoji="🎯" color={color} focused={focused} /> }}
      />
      <Tabs.Screen
        name="wins"
        options={{ title: 'Wins', tabBarIcon: ({ color, focused }) => <TabIcon emoji="🏆" color={color} focused={focused} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean; color: import('react-native').ColorValue }) {
  const { Text } = require('react-native');
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>;
}

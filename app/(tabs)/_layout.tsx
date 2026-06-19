import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/colors';

const TABS = [
  { name: 'today', title: 'Today', icon: '⚡' },
  { name: 'focus', title: 'Focus', icon: '🎯' },
  { name: 'wins',  title: 'Wins',  icon: '🏆' },
];

function TabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + 16 }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, i: number) => {
          const focused = state.index === i;
          const tab = TABS.find(t => t.name === route.name) ?? { title: route.name, icon: '•' };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
              }}
              activeOpacity={0.7}
              style={styles.tab}
            >
              <Text style={[styles.icon, !focused && styles.iconInactive]}>{tab.icon}</Text>
              <Text style={[styles.label, focused && styles.labelActive]}>{tab.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      {TABS.map(t => (
        <Tabs.Screen key={t.name} name={t.name} options={{ title: t.title }} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 28,
    right: 28,
    borderRadius: 26,
    shadowColor: Colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    // Pistachio-tinted background — immediately reads as "this is the nav"
    backgroundColor: Colors.primaryDeep,
    borderRadius: 26,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  icon: { fontSize: 16 },
  iconInactive: { opacity: 0.4 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
  },
  labelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

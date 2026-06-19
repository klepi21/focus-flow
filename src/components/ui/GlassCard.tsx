import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  borderColor?: string;
  glowColor?: string;
  padding?: number;
}

export function GlassCard({
  children,
  style,
  borderColor = Colors.border,
  glowColor,
  padding = 16,
}: Props) {
  return (
    <View
      style={[
        styles.card,
        { borderColor, padding },
        glowColor && {
          shadowColor: glowColor,
          shadowOpacity: 0.2,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 4 },
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
});

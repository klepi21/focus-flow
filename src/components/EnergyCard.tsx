import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { useRef } from 'react';
import { Colors } from '@/src/constants/colors';
import { EnergyLevel } from '@/src/types';
import { IllustrationPlaceholder } from './IllustrationPlaceholder';

const SLOT_COLORS: Record<EnergyLevel, string> = {
  low: '#2563EB',
  medium: '#F59E0B',
  high: '#7C3AED',
};

const EMOJI: Record<EnergyLevel, string> = {
  low: '🌙',
  medium: '🔥',
  high: '⚡',
};

interface Props {
  level: EnergyLevel;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export function EnergyCard({ level, label, description, selected, onPress }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const color = SLOT_COLORS[level];

  function handlePress() {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.97, duration: 80, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onPress();
  }

  // Illustration sources — swap null for require() once assets exist:
  // low:    require('@/assets/illustrations/energy-low.png')
  // medium: require('@/assets/illustrations/energy-medium.png')
  // high:   require('@/assets/illustrations/energy-high.png')
  const illustrationSource = undefined;

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          selected && { borderColor: color, backgroundColor: Colors.surfaceHigh },
        ]}
        onPress={handlePress}
        activeOpacity={1}
      >
        {selected && <View style={[styles.selectedBar, { backgroundColor: color }]} />}

        <IllustrationPlaceholder
          source={illustrationSource}
          emoji={EMOJI[level]}
          size={52}
          bgColor={color + '20'}
        />

        <View style={styles.textBlock}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
  selectedBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});

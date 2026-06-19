import { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from '@/src/constants/colors';
import { EnergyLevel } from '@/src/types';

const { width: W, height: H } = Dimensions.get('window');

// Soft pastel blobs on a light background — calming, not overstimulating
const AURA: Record<NonNullable<EnergyLevel>, [string, string]> = {
  low:    [Colors.auraLow,    Colors.auraLowSecondary],
  medium: [Colors.auraMedium, Colors.auraMediumSecondary],
  high:   [Colors.auraHigh,   Colors.auraHighSecondary],
};

interface Props {
  energy?: EnergyLevel | null;
}

export function AmbientBackground({ energy }: Props) {
  const blob1X = useRef(new Animated.Value(0)).current;
  const blob1Y = useRef(new Animated.Value(0)).current;
  const blob2X = useRef(new Animated.Value(0)).current;
  const blob2Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = (val: Animated.Value, range: number, duration: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, { toValue: range, duration, useNativeDriver: true, easing: t => Math.sin(t * Math.PI) }),
          Animated.timing(val, { toValue: -range, duration, useNativeDriver: true, easing: t => Math.sin(t * Math.PI) }),
        ])
      );

    const a1 = animate(blob1X, 40, 9000);
    const a2 = animate(blob1Y, 30, 11000);
    const a3 = animate(blob2X, -35, 10000);
    const a4 = animate(blob2Y, 45, 8000);

    a1.start(); a2.start(); a3.start(); a4.start();
    return () => { a1.stop(); a2.stop(); a3.stop(); a4.stop(); };
  }, []);

  const colors = energy ? AURA[energy] : AURA.medium;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.background }]} />

      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: colors[0],
            top: -H * 0.12,
            left: -W * 0.18,
            transform: [{ translateX: blob1X }, { translateY: blob1Y }],
          },
        ]}
      />

      <Animated.View
        style={[
          styles.blob,
          {
            backgroundColor: colors[1],
            bottom: -H * 0.18,
            right: -W * 0.22,
            transform: [{ translateX: blob2X }, { translateY: blob2Y }],
          },
        ]}
      />
    </View>
  );
}

const BLOB_SIZE = W * 1.05;

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: BLOB_SIZE,
    height: BLOB_SIZE,
    borderRadius: BLOB_SIZE / 2,
    opacity: 0.38,   // higher opacity on light bg — still soft, not overstimulating
  },
});

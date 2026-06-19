import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Path, Defs, ClipPath, Circle as SvgCircle } from 'react-native-svg';
import { Colors } from '@/src/constants/colors';

const SIZE = 220;
const RADIUS = SIZE / 2;
const WAVE_AMPLITUDE = 8;

function buildWavePath(offsetX: number, waterY: number): string {
  // Two full sine cycles across 3x the width so it tiles seamlessly.
  const w = SIZE;
  const a = WAVE_AMPLITUDE;
  const o = offsetX;
  return [
    `M ${-w + o} ${waterY}`,
    `Q ${-w * 0.75 + o} ${waterY - a} ${-w * 0.5 + o} ${waterY}`,
    `Q ${-w * 0.25 + o} ${waterY + a} ${o} ${waterY}`,
    `Q ${w * 0.25 + o} ${waterY - a} ${w * 0.5 + o} ${waterY}`,
    `Q ${w * 0.75 + o} ${waterY + a} ${w + o} ${waterY}`,
    `Q ${w * 1.25 + o} ${waterY - a} ${w * 1.5 + o} ${waterY}`,
    `Q ${w * 1.75 + o} ${waterY + a} ${w * 2 + o} ${waterY}`,
    `L ${w * 2 + o} ${SIZE}`,
    `L ${-w + o} ${SIZE}`,
    'Z',
  ].join(' ');
}

interface Props {
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export function WaterTimer({ totalSeconds, remainingSeconds, isRunning }: Props) {
  const [waveOffset, setWaveOffset] = useState(0);
  const waveRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fillAnim = useRef(new Animated.Value(remainingSeconds / Math.max(totalSeconds, 1))).current;

  // Animate water fill level when remaining seconds changes
  useEffect(() => {
    Animated.timing(fillAnim, {
      toValue: remainingSeconds / Math.max(totalSeconds, 1),
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [remainingSeconds, totalSeconds]);

  // Scroll the wave horizontally when running
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        waveRef.current = (waveRef.current + 2.5) % SIZE;
        setWaveOffset(waveRef.current);
      }, 40); // ~25fps
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // fillPercent 1 = full timer → water at top (waterY near 0)
  // fillPercent 0 = empty timer → water at bottom (waterY = SIZE)
  const waterY = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [SIZE, 0],
    extrapolate: 'clamp',
  });

  // We can't pass Animated.Value directly to SVG path string,
  // so we listen to the value and update state:
  const [waterYValue, setWaterYValue] = useState(
    remainingSeconds / Math.max(totalSeconds, 1) === 1 ? 0 : SIZE * (1 - remainingSeconds / Math.max(totalSeconds, 1))
  );

  useEffect(() => {
    const id = waterY.addListener(({ value }) => setWaterYValue(value));
    return () => waterY.removeListener(id);
  }, [waterY]);

  const wavePath = buildWavePath(waveOffset, waterYValue);
  // Second wave slightly behind for depth
  const wavePath2 = buildWavePath((waveOffset + SIZE * 0.5) % SIZE, waterYValue + 4);

  return (
    <View
      style={[
        styles.container,
        isRunning && styles.containerGlow,
      ]}
    >
      <Svg width={SIZE} height={SIZE} style={StyleSheet.absoluteFill}>
        <Defs>
          <ClipPath id="circle">
            <SvgCircle cx={RADIUS} cy={RADIUS} r={RADIUS} />
          </ClipPath>
        </Defs>

        {/* Back wave (subtle) */}
        <Path
          d={wavePath2}
          fill={Colors.primary + '28'}
          clipPath="url(#circle)"
        />
        {/* Front wave */}
        <Path
          d={wavePath}
          fill={Colors.primary + '55'}
          clipPath="url(#circle)"
        />
      </Svg>

      {/* Time display */}
      <Text style={styles.time}>{timeStr}</Text>

      {isRunning && (
        <View style={styles.statusRow}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>recording</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIZE,
    height: SIZE,
    borderRadius: RADIUS,
    backgroundColor: Colors.surface,
    borderWidth: 3,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  containerGlow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 24,
    elevation: 12,
  },
  time: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.textPrimary,
    textShadowColor: '#00000080',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    zIndex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
    zIndex: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: '500',
  },
});

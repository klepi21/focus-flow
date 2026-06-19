import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

// Placeholder celebration: expands + fades ring from center.
// Replace with Lottie when assets/animations/task-complete.json is ready:
//   import LottieView from 'lottie-react-native';
//   <LottieView source={require('@/assets/animations/task-complete.json')} autoPlay loop={false} />

interface Props {
  visible: boolean;
  onFinish?: () => void;
}

export function CelebrationOverlay({ visible, onFinish }: Props) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0);
    opacity.setValue(1);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 3,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.ring,
            { transform: [{ scale }], opacity },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#7C3AED',
  },
});

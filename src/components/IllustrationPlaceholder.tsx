import { View, Text, StyleSheet, Image, ImageSourcePropType } from 'react-native';
import { Colors } from '@/src/constants/colors';

interface Props {
  source?: ImageSourcePropType;
  emoji: string;
  size: number;
  bgColor?: string;
}

// Renders the real image when the asset exists, otherwise a colored
// placeholder with the emoji — drop the asset file and it auto-activates.
export function IllustrationPlaceholder({ source, emoji, size, bgColor = Colors.surfaceHigh }: Props) {
  if (source) {
    return (
      <Image
        source={source}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: size * 0.25, backgroundColor: bgColor },
      ]}
    >
      <Text style={{ fontSize: size * 0.5 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

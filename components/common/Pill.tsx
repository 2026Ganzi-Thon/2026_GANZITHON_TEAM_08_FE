import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  label: string;
  onPress?: () => void;
  width?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Pill({ label, onPress, width, style }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.pill, { width }, pressed && styles.pressed, style]}
    >
      <Text style={styles.label} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { height: 19, borderRadius: 50, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  label: { color: palette.white, fontSize: 12 },
  pressed: { opacity: 0.7 },
});

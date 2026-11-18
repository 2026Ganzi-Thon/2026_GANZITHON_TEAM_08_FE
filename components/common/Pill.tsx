import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/constants/theme';

type Props = {
  label: string;
  onPress?: () => void;
  width?: number;
  height?: number;
  fontSize?: number;
  active?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Pill({ label, onPress, width, height = 19, fontSize = 12, active = true, style }: Props) {
  const body = [
    styles.pill,
    { width, height, backgroundColor: active ? palette.primary : palette.chipOff, borderRadius: Math.max(height, 19) },
    style,
  ];
  const text = (
    <Text style={[styles.label, { fontSize, color: active ? palette.white : palette.textMuted }]} numberOfLines={1}>
      {label}
    </Text>
  );
  if (!onPress) return <Pressable disabled style={body}>{text}</Pressable>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [body, pressed && styles.pressed]}>
      {text}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  label: { },
  pressed: { opacity: 0.7 },
});

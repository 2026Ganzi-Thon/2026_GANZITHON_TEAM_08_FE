import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, View } from 'react-native';

import { palette } from '@/constants/theme';

type Props = { uri?: string; size: number; radius?: number };

export default function FeedPhoto({ uri, size, radius = 12 }: Props) {
  const box = { width: size, height: size, borderRadius: radius };
  if (uri) return <Image source={{ uri }} style={box} resizeMode="cover" />;
  return (
    <View style={[styles.empty, box]}>
      <Ionicons name="image-outline" size={Math.round(size * 0.3)} color={palette.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { backgroundColor: palette.tint, alignItems: 'center', justifyContent: 'center' },
});

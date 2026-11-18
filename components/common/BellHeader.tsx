import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/theme';

type Props = { title: string; onBellPress?: () => void };

export default function BellHeader({ title, onBellPress }: Props) {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[styles.header, { paddingTop: top + 28 }]}>
      <Text style={styles.title}>{title}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="알림" onPress={onBellPress} hitSlop={10}>
        <Ionicons name="notifications-outline" size={20} color="#000000" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: palette.white },
  title: { fontWeight: '600', fontSize: 16, color: palette.text },
});

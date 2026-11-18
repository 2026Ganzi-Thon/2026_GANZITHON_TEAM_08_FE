import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/constants/theme';
import { illustrations } from '@/data/illustrations';
import { isMindCode, mindTypes } from '@/data/mindTypes';

export default function ResultScreen() {
  const { type, mode, name: resultName } = useLocalSearchParams<{ type: string; mode?: string; name?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const code = type?.toUpperCase() ?? '';

  if (!isMindCode(code)) {
    return (
      <View style={[styles.screen, styles.center]}>
        <Text style={styles.description}>알 수 없는 유형이에요.</Text>
      </View>
    );
  }

  const { name: localName, description } = mindTypes[code];
  const name = resultName || localName;
  const retest = mode === 'retest';
  const illustration = illustrations[code];

  return (
    <View style={[styles.screen, { paddingTop: top + 80, paddingBottom: Math.max(bottom, 16) + 28 }]}>
      <Text style={styles.heading}>나의 유형은?</Text>
      <View style={styles.art}>
        {illustration ? (
          <Image source={illustration} style={styles.artImage} resizeMode="contain" accessibilityLabel={name} />
        ) : (
          <View style={styles.artEmpty} />
        )}
      </View>
      <Text style={styles.code} accessibilityLabel={code}>{code}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.spacer} />
      <Pressable accessibilityRole="button" onPress={() => router.dismissTo(retest ? '/mypage' : '/group')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>{retest ? '마이페이지로 돌아가기' : '내 그룹 보기'}</Text>
        <Ionicons name="arrow-forward" size={18} color="#F7F7F8" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white, paddingHorizontal: 16, alignItems: 'center' },
  center: { justifyContent: 'center' },
  heading: { fontWeight: '600', fontSize: 16, color: palette.text },
  art: { width: 220, height: 164, marginTop: 61, alignItems: 'center', justifyContent: 'center' },
  artImage: { width: '100%', height: '100%' },
  artEmpty: { width: 172, height: 164, borderRadius: 82, backgroundColor: palette.tint },
  code: { fontFamily: 'Modak_400Regular', fontSize: 96, lineHeight: 130, color: palette.primary, textAlign: 'center', marginTop: 46 },
  name: { fontWeight: '600', fontSize: 20, color: palette.text, marginTop: -2 },
  description: { fontSize: 12, lineHeight: 15, color: palette.textMuted, textAlign: 'center', marginTop: 21 },
  spacer: { flex: 1 },
  button: { alignSelf: 'stretch', height: 59, borderRadius: 50, backgroundColor: palette.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  buttonText: { fontSize: 14, color: '#F7F7F8' },
  pressed: { opacity: 0.8 },
});

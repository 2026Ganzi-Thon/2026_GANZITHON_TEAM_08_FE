import { palette } from '@/constants/Colors';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { browserAuthEnabled, getMyType, kakaoLoginUrl } from './browserSession';

export default function LoginScreen() {
  const [error, setError] = useState('');
  const canUseWebSession = Platform.OS === 'web' && browserAuthEnabled;

  useEffect(() => {
    if (!canUseWebSession) return;
    let active = true;
    void getMyType().then((response) => {
      if (!active) return;
      if (response.ok) router.replace('/home');
      if (response.status === 409) router.replace('/type-test');
    }).catch(() => {
      // The login button remains available if session detection fails.
    });
    return () => { active = false; };
  }, [canUseWebSession]);

  async function login() {
    setError('');
    try {
      if (Platform.OS === 'web') {
        window.location.assign(canUseWebSession ? '/api/auth/kakao' : kakaoLoginUrl);
        return;
      }
      await Linking.openURL(kakaoLoginUrl);
    } catch {
      setError('카카오 로그인 페이지를 열지 못했어요. 다시 시도해 주세요.');
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="MINDOT" />
            <Text style={styles.tagline}>나의 작은 점들이 하나의 기록을 만든다</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={login} style={({ pressed }) => [styles.kakaoButton, pressed && styles.pressed]}>
            <Image source={require('../../../assets/images/kakaotalk.png')} style={styles.kakaoIcon} resizeMode="contain" />
            <Text style={styles.kakaoText}>카카오로 시작하기</Text>
            <View style={styles.kakaoSpacer} />
          </Pressable>
          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, paddingHorizontal: 14, paddingBottom: 56 },
  brand: { flexGrow: 1, minHeight: 260, alignItems: 'center', justifyContent: 'center', paddingTop: 64 },
  logo: { width: '64%', maxWidth: 264, aspectRatio: 234 / 57 },
  tagline: { color: palette.primary, fontSize: 13, fontWeight: '600', marginTop: 23, textAlign: 'center' },
  kakaoButton: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 11, backgroundColor: palette.kakaoBackground },
  kakaoIcon: { width: 40, height: 40 },
  kakaoText: { flex: 1, textAlign: 'center', color: palette.kakaoText, fontSize: 15, fontWeight: '600' },
  kakaoSpacer: { width: 40 },
  error: { color: palette.textMuted, textAlign: 'center', marginTop: 12 },
  pressed: { opacity: 0.65 },
});

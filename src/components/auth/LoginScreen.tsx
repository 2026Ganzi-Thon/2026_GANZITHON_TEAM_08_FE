import { palette } from '@/constants/Colors';
import { router } from 'expo-router';
import { type ComponentRef, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const login = () => {
    router.push('/type-test');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.brand}>
              <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="MINDOT" />
              <Text style={styles.tagline}>나의 작은 점들이 하나의 기록을 만든다</Text>
            </View>
            <View style={styles.form}>
              <TextInput
                accessibilityLabel="아이디" placeholder="아이디" placeholderTextColor={palette.textMuted} style={styles.input}
                value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false}
                autoComplete="username" textContentType="username" returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <TextInput
                ref={passwordRef} accessibilityLabel="비밀번호" placeholder="비밀번호" placeholderTextColor={palette.textMuted} style={styles.input}
                value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false}
                autoComplete="current-password" textContentType="password" returnKeyType="go" onSubmitEditing={login}
              />
              <Pressable accessibilityRole="button" onPress={login} style={({ pressed }) => [styles.login, pressed && styles.pressed]}>
                <Text style={styles.loginText}>로그인</Text>
              </Pressable>
              <View style={styles.socialDivider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>간편 로그인</Text>
                <View style={styles.dividerLine} />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="카카오로 시작하기"
                onPress={login}
                style={({ pressed }) => [styles.kakaoButton, pressed && styles.pressed]}>
                <Image source={require('../../../assets/images/kakaotalk.png')} style={styles.kakaoIcon} resizeMode="contain" />
                <Text style={styles.kakaoText}>카카오로 시작하기</Text>
                <View style={styles.kakaoSpacer} />
              </Pressable>
              <View style={styles.links}>
                {['비밀번호 찾기', '회원가입'].map((label) => (
                  <Pressable key={label} accessibilityRole="button" onPress={() => router.push(label === '회원가입' ? '/sign-up' : '/forgot-password')} style={({ pressed }) => [styles.link, pressed && styles.pressed]}>
                    <Text style={styles.linkText}>{label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, paddingHorizontal: 14, paddingBottom: 56 },
  brand: { flexGrow: 1, flexBasis: 330, minHeight: 260, alignItems: 'center', justifyContent: 'center', paddingTop: 64 },
  logo: { width: '64%', maxWidth: 264, aspectRatio: 234 / 57 },
  tagline: { color: palette.primary, fontSize: 13, fontWeight: '600', marginTop: 23, textAlign: 'center' },
  form: { width: '100%', paddingTop: 30 },
  input: { height: 56, borderRadius: 11, backgroundColor: palette.white, color: palette.text, textAlign: 'center', fontSize: 15, paddingHorizontal: 18, marginBottom: 12 },
  login: { height: 56, borderRadius: 11, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  loginText: { color: palette.white, fontSize: 16, fontWeight: '600' },
  socialDivider: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 26, marginBottom: 18, paddingHorizontal: 6 },
  dividerLine: { flex: 1, height: 1, backgroundColor: palette.divider },
  dividerText: { color: palette.textDivider, fontSize: 12 },
  kakaoButton: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 11, backgroundColor: palette.kakaoBackground },
  kakaoIcon: { width: 40, height: 40 },
  kakaoText: { flex: 1, textAlign: 'center', color: palette.kakaoText, fontSize: 15, fontWeight: '600' },
  kakaoSpacer: { width: 40 },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 34, marginTop: 20 },
  link: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 10 },
  linkText: { color: palette.textMuted, fontSize: 14 },
  pressed: { opacity: 0.65 },
});

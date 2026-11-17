import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountScreen({ mode }: { mode: 'signup' | 'recovery' }) {
  const signup = mode === 'signup';
  const [agreed, setAgreed] = useState(false);
  const title = signup ? '회원가입' : '비밀번호 찾기';

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Pressable accessibilityRole="button" accessibilityLabel="로그인으로 돌아가기" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.back}>
                <Text style={styles.backText}>‹</Text>
              </Pressable>
              <Text style={styles.headerTitle}>{title}</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.brand}>
              <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="MINDOT" />
              <Text style={styles.title}>{signup ? '나의 첫 번째 점을 찍어볼까요?' : '다시, 나의 기록으로'}</Text>
              <Text style={styles.description}>{signup ? '작은 순간들이 모여 나만의 기록이 돼요.' : '가입한 아이디와 이메일을 입력해 주세요.\n비밀번호 재설정 링크를 보내드릴게요.'}</Text>
            </View>

            <View style={styles.fields}>
              {signup && <Field label="닉네임" placeholder="어떻게 불러드릴까요?" autoComplete="nickname" />}
              <Field label="아이디" placeholder="아이디를 입력해 주세요" autoComplete="username" />
              <Field label="이메일" placeholder="example@email.com" autoComplete="email" email />
              {signup && <>
                <Field label="비밀번호" placeholder="비밀번호를 입력해 주세요" secure autoComplete="new-password" />
                <Field label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해 주세요" secure />
              </>}
            </View>

            {signup && (
              <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: agreed }} onPress={() => setAgreed(!agreed)} style={styles.agreement}>
                <View style={[styles.checkbox, agreed && styles.checked]}>
                  {agreed && <View style={styles.checkmark} />}
                </View>
                <Text style={styles.agreementText}>[필수] 이용약관 및 개인정보 수집·이용 동의</Text>
              </Pressable>
            )}

            <Pressable accessibilityRole="button" onPress={() => Alert.alert(title, signup ? '회원가입 기능을 준비 중입니다.' : '이메일 발송 기능을 준비 중입니다.')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>{signup ? '가입하기' : '재설정 링크 받기'}</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.returnLink}>
              <Text style={styles.returnText}>{signup ? '이미 계정이 있나요?  로그인' : '로그인으로 돌아가기'}</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field({ label, placeholder, secure = false, email = false, autoComplete }: {
  label: string; placeholder: string; secure?: boolean; email?: boolean;
  autoComplete?: React.ComponentProps<typeof TextInput>['autoComplete'];
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput accessibilityLabel={label} placeholder={placeholder} placeholderTextColor="#9B9AA8" style={styles.input}
        secureTextEntry={secure} keyboardType={email ? 'email-address' : 'default'} autoCapitalize="none" autoCorrect={false} autoComplete={autoComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#EFEFFB' },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { width: '100%', maxWidth: 480, paddingHorizontal: 24, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 56 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  backText: { color: '#9391EE', fontSize: 38, lineHeight: 42 },
  headerTitle: { color: '#55536F', fontSize: 16, fontWeight: '600' },
  headerSpacer: { width: 44 },
  brand: { alignItems: 'center', paddingTop: 38, paddingBottom: 36 },
  logo: { width: 168, aspectRatio: 234 / 57, marginBottom: 28 },
  title: { color: '#66638F', fontSize: 21, fontWeight: '700', textAlign: 'center' },
  description: { color: '#9491B2', fontSize: 13, lineHeight: 21, marginTop: 12, textAlign: 'center' },
  fields: { gap: 18 },
  field: { gap: 8 },
  label: { color: '#66638F', fontSize: 13, fontWeight: '600', paddingLeft: 3 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, height: 54, paddingHorizontal: 18, color: '#48465E', fontSize: 14 },
  agreement: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, marginTop: 18 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 1.5, borderColor: '#9391EE', alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: '#9391EE' },
  checkmark: { width: 6, height: 11, borderRightWidth: 2, borderBottomWidth: 2, borderColor: '#FFFFFF', transform: [{ rotate: '45deg' }] },
  agreementText: { color: '#807D99', fontSize: 12, flex: 1, lineHeight: 18 },
  button: { height: 56, backgroundColor: '#9391EE', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 26 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  returnLink: { minHeight: 48, alignItems: 'center', justifyContent: 'center', marginTop: 14 },
  returnText: { color: '#88849F', fontSize: 13 },
  pressed: { opacity: 0.65 },
});

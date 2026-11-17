import { router } from 'expo-router';
import { type ComponentRef, useRef, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const providers = [
  { name: 'Apple', image: require('../../../assets/images/apple.png') },
  { name: '카카오', image: require('../../../assets/images/kakaotalk.png') },
  { name: 'Google', image: require('../../../assets/images/google.png') },
];
const pending = (name: string) => Alert.alert(name, '서비스 연결을 준비 중입니다.');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<ComponentRef<typeof TextInput>>(null);
  const login = () => {
    pending('로그인');
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
                accessibilityLabel="아이디" placeholder="아이디" placeholderTextColor="#808080" style={styles.input}
                value={username} onChangeText={setUsername} autoCapitalize="none" autoCorrect={false}
                autoComplete="username" textContentType="username" returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              <TextInput
                ref={passwordRef} accessibilityLabel="비밀번호" placeholder="비밀번호" placeholderTextColor="#808080" style={styles.input}
                value={password} onChangeText={setPassword} secureTextEntry autoCapitalize="none" autoCorrect={false}
                autoComplete="current-password" textContentType="password" returnKeyType="go" onSubmitEditing={login}
              />
              <Pressable accessibilityRole="button" onPress={login} style={({ pressed }) => [styles.login, pressed && styles.pressed]}>
                <Text style={styles.loginText}>로그인</Text>
              </Pressable>
              <View style={styles.socials}>
                {providers.map(({ name, image }) => (
                  <Pressable key={name} accessibilityRole="button" accessibilityLabel={`${name}로 로그인`} onPress={() => pending(`${name} 로그인`)} style={({ pressed }) => [styles.social, pressed && styles.pressed]}>
                    <Image source={image} style={styles.socialIcon} resizeMode="contain" />
                  </Pressable>
                ))}
              </View>
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
  screen: { flex: 1, backgroundColor: '#EFEFFB' },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, paddingHorizontal: 14, paddingBottom: 56 },
  brand: { flexGrow: 1, flexBasis: 330, minHeight: 260, alignItems: 'center', justifyContent: 'center', paddingTop: 64 },
  logo: { width: '64%', maxWidth: 264, aspectRatio: 234 / 57 },
  tagline: { color: '#9391EE', fontSize: 13, fontWeight: '600', marginTop: 23, textAlign: 'center' },
  form: { width: '100%', paddingTop: 30 },
  input: { height: 56, borderRadius: 11, backgroundColor: '#FFFFFF', color: '#333333', textAlign: 'center', fontSize: 15, paddingHorizontal: 18, marginBottom: 12 },
  login: { height: 56, borderRadius: 11, backgroundColor: '#9391EE', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  loginText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  socials: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 22, marginTop: 26 },
  social: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  socialIcon: { width: 40, height: 40 },
  links: { flexDirection: 'row', justifyContent: 'center', gap: 34, marginTop: 20 },
  link: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 10 },
  linkText: { color: '#808080', fontSize: 14 },
  pressed: { opacity: 0.65 },
});

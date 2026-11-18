import { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { browserAuthEnabled, logout } from '../../components/auth/browserSession';

export default function SettingsScreen() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  async function signOut() {
    setPending(true);
    setError('');
    try {
      await logout();
      window.location.replace('/');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '로그아웃하지 못했어요.');
    } finally {
      setPending(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>설정</Text>
      <Text style={styles.description}>앱 설정이 여기에 표시됩니다.</Text>
      {Platform.OS === 'web' && browserAuthEnabled && (
        <>
          <Pressable accessibilityRole="button" disabled={pending} onPress={signOut} style={styles.action}>
            <Text>{pending ? '로그아웃 중…' : '로그아웃'}</Text>
          </Pressable>
          {error ? <Text accessibilityRole="alert">{error}</Text> : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  description: { fontSize: 16, lineHeight: 24 },
  action: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
});


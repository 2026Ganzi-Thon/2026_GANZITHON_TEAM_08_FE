import { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { browserAuthEnabled, logout, withdraw } from '../../components/auth/browserSession';

export default function SettingsScreen() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [confirmingWithdraw, setConfirmingWithdraw] = useState(false);

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

  async function leaveService() {
    setPending(true);
    setError('');
    try {
      await withdraw();
      window.location.replace('/');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : '회원 탈퇴하지 못했어요.');
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
          {confirmingWithdraw ? (
            <View style={styles.confirm}>
              <Text>탈퇴하면 기록과 사진이 삭제되고 되돌릴 수 없어요. 정말 탈퇴할까요?</Text>
              <View style={styles.confirmButtons}>
                <Pressable accessibilityRole="button" disabled={pending} onPress={leaveService} style={styles.action}>
                  <Text style={styles.danger}>{pending ? '탈퇴 중…' : '탈퇴하기'}</Text>
                </Pressable>
                <Pressable accessibilityRole="button" disabled={pending} onPress={() => setConfirmingWithdraw(false)} style={styles.action}>
                  <Text>취소</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable accessibilityRole="button" disabled={pending} onPress={() => setConfirmingWithdraw(true)} style={styles.action}>
              <Text style={styles.danger}>회원 탈퇴</Text>
            </Pressable>
          )}
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
  confirm: { gap: 12 },
  confirmButtons: { flexDirection: 'row', gap: 24 },
  danger: { color: '#D32F2F' },
  action: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start' },
});


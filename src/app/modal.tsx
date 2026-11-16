import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function AppInfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TEAM 08</Text>
      <Text style={styles.description}>함께 만들어 가는 새로운 시작.</Text>
      <Link dismissTo href="/" style={styles.link}>홈으로 돌아가기</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700' },
  description: { fontSize: 16, lineHeight: 24 },
  link: { color: '#2563eb', fontSize: 16, paddingVertical: 12 },
});


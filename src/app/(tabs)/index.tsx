import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>GANZITHON · TEAM 08</Text>
      <Text style={styles.title}>우리 앱의 시작</Text>
      <Text style={styles.description}>이제 필요한 기능을 하나씩 만들어 보세요.</Text>
      <Link href="/modal" asChild>
        <Pressable accessibilityRole="button" style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}>
          <Text style={styles.buttonText}>앱 정보 보기</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  eyebrow: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  title: { fontSize: 30, fontWeight: '700' },
  description: { fontSize: 16, lineHeight: 25 },
  button: { alignSelf: 'flex-start', backgroundColor: '#2563eb', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 14, marginTop: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});


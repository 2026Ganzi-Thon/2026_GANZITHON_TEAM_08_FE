import { palette } from '@/constants/Colors';
import { router, Stack } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TypeTestScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.content}>
          <View style={styles.brand}>
            <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="MINDOT" />
            <Text style={styles.tagline}>나의 작은 점들이 하나의 기록을 만든다</Text>
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/type-test-questions')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>내 유형 검사하기</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, minHeight: 560, paddingHorizontal: 16, paddingBottom: 110 },
  brand: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingBottom: 60 },
  logo: { width: '88%', aspectRatio: 234 / 57 },
  tagline: { color: palette.primary, fontSize: 13, fontWeight: '500', textAlign: 'center', marginTop: 36 },
  button: { minHeight: 80, paddingVertical: 16, borderRadius: 20, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: palette.white, fontSize: 18, fontWeight: '500' },
  pressed: { opacity: 0.75 },
});

import { palette } from '@/constants/Colors';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { questions } from '../components/type-test/questions';

export default function TypeTestQuestionsScreen() {
  const { step, answers: previousAnswers } = useLocalSearchParams<{ step?: string; answers?: string }>();
  const parsedStep = Number(step ?? 0);
  const index = Number.isInteger(parsedStep) && parsedStep >= 0 && parsedStep < questions.length ? parsedStep : 0;
  // Each step is a route entry, so the native back gesture restores earlier answers.
  const [selections, setSelections] = useState<Record<number, number>>({});
  const selected = selections[index] ?? Number(previousAnswers?.[index] ?? -1);
  const question = questions[index];
  const last = index === questions.length - 1;

  function next() {
    if (selected < 0) return;
    const answers = `${(previousAnswers ?? '').slice(0, index)}${selected}`;
    if (last) {
      Alert.alert('유형 검사 완료', '모든 답변을 선택했어요. 결과 화면은 준비 중입니다.');
      return;
    }
    router.push({ pathname: '/type-test-questions', params: { step: String(index + 1), answers } });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.progress} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 4, now: index + 1 }}>
            <Text style={styles.progressText}>{index + 1} / 4</Text>
            <View style={styles.track}><View style={[styles.fill, { width: `${((index + 1) / questions.length) * 100}%` }]} /></View>
          </View>
          <View style={styles.heading}>
            <View style={styles.badge}><Text style={styles.badgeText}>Q{index + 1}</Text></View>
            <Text style={styles.question}>{question.title}</Text>
          </View>
          <View style={styles.options} accessibilityRole="radiogroup" accessibilityLabel={`질문 ${index + 1} 답변`}>
            {question.options.map((option, optionIndex) => (
              <Pressable key={optionIndex} accessibilityRole="radio" accessibilityState={{ checked: selected === optionIndex }}
                onPress={() => setSelections((current) => ({ ...current, [index]: optionIndex }))}
                style={({ pressed }) => [styles.option, selected === optionIndex && styles.selectedOption, pressed && styles.pressed]}>
                <Text style={[styles.optionLetter, selected === optionIndex && styles.selectedText]}>{optionIndex === 0 ? 'A.' : 'B.'}</Text>
                <Text style={[styles.optionText, selected === optionIndex && styles.selectedText]}>{option}</Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.spacer} />
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: selected < 0 }} disabled={selected < 0} onPress={next}
            style={({ pressed }) => [styles.next, pressed && styles.pressed]}>
            <Text style={styles.nextText}>{last ? '결과보기' : '다음'}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, minHeight: 660, paddingHorizontal: 16, paddingBottom: 32 },
  progress: { width: 132, alignSelf: 'center', marginTop: 58, marginBottom: 56, gap: 10 },
  progressText: { color: palette.textStrong, fontSize: 12, textAlign: 'center' },
  track: { height: 3, backgroundColor: palette.progressTrack, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: palette.primary },
  heading: { gap: 24 },
  badge: { alignSelf: 'flex-start', backgroundColor: palette.questionBadge, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { color: palette.white, fontSize: 13, fontWeight: '700' },
  question: { color: palette.text, fontSize: 18, lineHeight: 28 },
  options: { marginTop: 64, gap: 40 },
  option: { minHeight: 94, borderWidth: 1, borderColor: palette.optionBorder, backgroundColor: palette.optionBackground, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 18, paddingHorizontal: 28, paddingVertical: 20 },
  selectedOption: { backgroundColor: palette.optionSelected, borderColor: palette.primary, borderWidth: 2, paddingHorizontal: 27, paddingVertical: 19 },
  optionLetter: { color: palette.textMuted, fontSize: 14 },
  optionText: { flex: 1, color: palette.textMuted, fontSize: 14, lineHeight: 19 },
  selectedText: { color: palette.questionBadge },
  spacer: { flexGrow: 1, minHeight: 50 },
  next: { minHeight: 58, borderRadius: 30, backgroundColor: palette.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  nextText: { color: palette.white, fontSize: 14 },
  arrow: { color: palette.white, fontSize: 22 },
  pressed: { opacity: 0.75 },
});

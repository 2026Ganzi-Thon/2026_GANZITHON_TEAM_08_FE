import { palette } from '@/constants/Colors';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { browserAuthEnabled } from '../components/auth/browserSession';
import {
  getQuestionnaire, getResultCode, getRetestAnswers, OnboardingRequestError, submitQuestionnaire,
  type Questionnaire,
} from '../components/type-test/onboardingApi';

export default function TypeTestQuestionsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const retest = mode === 'retest';
  const supportsSession = Platform.OS === 'web' && browserAuthEnabled;
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();
  const [lifeStage, setLifeStage] = useState('');
  const [answers, setAnswers] = useState<Record<number, 'A' | 'B'>>({});
  const [step, setStep] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submitInFlight = useRef(false);

  useEffect(() => {
    if (!supportsSession) return;
    let active = true;
    void Promise.all([getQuestionnaire(), retest ? getRetestAnswers() : undefined]).then(([data, saved]) => {
      if (!active) return;
      if (!data.questions.length || !data.lifeStages.length) throw new Error('유형 검사 문항을 불러오지 못했어요.');
      setLifeStage(saved?.lifeStage ?? '');
      setAnswers(Object.fromEntries(saved?.answers.map(({ questionId, choice }) => [questionId, choice]) ?? []));
      setQuestionnaire(data);
    }).catch((cause: unknown) => {
      if (!active) return;
      setNeedsLogin(cause instanceof OnboardingRequestError && cause.status === 401);
      setError(cause instanceof OnboardingRequestError ? cause.message : '유형 검사 문항을 불러오지 못했어요.');
    });
    return () => { active = false; };
  }, [attempt, retest, supportsSession]);

  const question = questionnaire?.questions[step - 1];
  const stepCount = (questionnaire?.questions.length ?? 0) + 1;
  const last = step === stepCount - 1;
  const selected = question ? answers[question.questionId] : lifeStage;

  async function next() {
    if (!questionnaire || !selected || submitInFlight.current) return;
    if (!last) {
      setStep(step + 1);
      return;
    }

    const submitted = questionnaire.questions.flatMap(({ questionId }) => {
      const choice = answers[questionId];
      return choice ? [{ questionId, choice }] : [];
    });
    if (submitted.length !== questionnaire.questions.length) return;
    submitInFlight.current = true;
    setSubmitting(true);
    setError('');
    try {
      const result = await submitQuestionnaire({ lifeStage, answers: submitted }, retest);
      const type = getResultCode(result);
      if (!type) throw new Error('서버가 반환한 유형을 표시할 수 없어요.');
      router.replace({ pathname: '/result/[type]', params: { type, name: result.typeName, mode: retest ? 'retest' : 'onboarding' } });
    } catch (cause) {
      setNeedsLogin(cause instanceof OnboardingRequestError && cause.status === 401);
      setError(cause instanceof Error ? cause.message : '응답을 저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      submitInFlight.current = false;
      setSubmitting(false);
    }
  }

  function retry() {
    if (needsLogin) {
      router.replace('/');
      return;
    }
    setError('');
    setAttempt((current) => current + 1);
  }

  const options = question
    ? [{ code: 'A', label: question.optionA }, { code: 'B', label: question.optionB }]
    : questionnaire?.lifeStages ?? [];

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {!supportsSession ? (
          <View style={styles.feedback}>
            <Text style={styles.question}>카카오 로그인 후 웹에서 유형 검사를 진행해 주세요.</Text>
          </View>
        ) : !questionnaire ? (
          <View style={styles.feedback}>
            {error ? (
              <>
                <Text accessibilityRole="alert" style={styles.question}>{error}</Text>
                <Pressable accessibilityRole="button" onPress={retry} style={styles.next}>
                  <Text style={styles.nextText}>{needsLogin ? '로그인으로 이동' : '다시 시도'}</Text>
                </Pressable>
              </>
            ) : <ActivityIndicator accessibilityLabel="유형 검사 문항 불러오는 중" color={palette.primary} />}
          </View>
        ) : (
          <View style={styles.content}>
            <View style={styles.progress} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: stepCount, now: step + 1 }}>
              <Text style={styles.progressText}>{step + 1} / {stepCount}</Text>
              <View style={styles.track}><View style={[styles.fill, { width: `${(step + 1) / stepCount * 100}%` }]} /></View>
            </View>
            <View style={styles.heading}>
              <View style={styles.badge}><Text style={styles.badgeText}>{question ? `Q${step}` : '생활 단계'}</Text></View>
              <Text style={styles.question}>{question?.content ?? '현재 나의 생활 단계를 선택해 주세요.'}</Text>
            </View>
            <View style={styles.options} accessibilityRole="radiogroup">
              {options.map(({ code, label }) => (
                <Pressable
                  key={code} accessibilityRole="radio" accessibilityState={{ checked: selected === code }} disabled={submitting}
                  onPress={() => {
                    if (question && (code === 'A' || code === 'B')) {
                      setAnswers((current) => ({ ...current, [question.questionId]: code }));
                    } else {
                      setLifeStage(code);
                    }
                  }}
                  style={({ pressed }) => [styles.option, selected === code && styles.selectedOption, pressed && styles.pressed]}
                >
                  {question && <Text style={[styles.optionLetter, selected === code && styles.selectedText]}>{code}.</Text>}
                  <Text style={[styles.optionText, selected === code && styles.selectedText]}>{label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.spacer} />
            {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
            <Pressable accessibilityRole="button" disabled={!selected || submitting}
              onPress={needsLogin ? retry : next} style={({ pressed }) => [styles.next, pressed && styles.pressed]}>
              <Text style={styles.nextText}>{needsLogin ? '로그인으로 이동' : submitting ? '저장 중…' : last ? '결과보기' : '다음'}</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
            {step > 0 && (
              <Pressable accessibilityRole="button" disabled={submitting} onPress={() => setStep(step - 1)} style={styles.previous}>
                <Text style={styles.progressText}>이전</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  scroll: { flexGrow: 1, alignItems: 'center' },
  content: { flexGrow: 1, width: '100%', maxWidth: 480, minHeight: 660, paddingHorizontal: 16, paddingBottom: 32 },
  feedback: { flex: 1, padding: 24, gap: 16, justifyContent: 'center' },
  error: { color: palette.text, marginBottom: 12 },
  previous: { minHeight: 44, justifyContent: 'center' },
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

import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Pill from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import type { MissionKind, Visibility } from '@/data/feedStore';
import { notifyFeedChanged } from '@/src/components/feed/useFeed';
import { getCertifiableMission, submitCertification, type PickedImage, type TodayMission } from '@/src/components/write/writeApi';

const MAX_LENGTH = 300;

const kinds: { key: MissionKind; label: string }[] = [
  { key: 'group', label: '그룹 미션' },
  { key: 'personal', label: '개인 미션' },
];

const visibilities: { key: Visibility; label: string }[] = [
  { key: 'group', label: '그룹 공개' },
  { key: 'all', label: '전체 공개' },
  { key: 'me', label: '나만 보기' },
];

export default function WriteScreen() {
  const params = useLocalSearchParams<{ kind?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const [kind, setKind] = useState<MissionKind>(params.kind === 'personal' ? 'personal' : 'group');
  const [visibility, setVisibility] = useState<Visibility>('group');
  const [text, setText] = useState('');
  const [image, setImage] = useState<PickedImage>();
  const [mission, setMission] = useState<{ kind: MissionKind; data?: TodayMission; error?: string }>();
  const [message, setMessage] = useState<string>();
  const [submitting, setSubmitting] = useState(false);
  const imageUri = image?.uri;
  const currentMission = mission?.kind === kind ? mission : undefined;

  useEffect(() => {
    const request = new AbortController();
    void getCertifiableMission(kind, request.signal)
      .then((data) => {
        if (!request.signal.aborted) setMission({ kind, data });
      })
      .catch((error: Error) => {
        if (!request.signal.aborted) setMission({ kind, error: error.message });
      });
    return () => request.abort();
  }, [kind]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('사진 접근 권한', '사진을 추가하려면 사진 접근 권한이 필요해요.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) {
      const asset = result.assets[0];
      setImage({ uri: asset.uri, mimeType: asset.mimeType, fileName: asset.fileName ?? undefined });
    }
  };

  const submit = async () => {
    if (submitting) return;
    if (!text.trim()) return setMessage('오늘의 미션 기록을 적어주세요.');
    if (!image) return setMessage('인증 사진을 추가해 주세요.');
    const target = currentMission?.data;
    if (!target) return setMessage(currentMission?.error ?? '미션 정보를 불러오는 중이에요.');
    if (!target.canCertify) return setMessage('지금은 이 미션을 인증할 수 없어요.');
    setSubmitting(true);
    setMessage(undefined);
    try {
      await submitCertification({ kind, missionId: target.missionId, content: text.trim(), visibility, image });
      notifyFeedChanged();
      router.back();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '기록을 올리지 못했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { paddingTop: top + 28 }]}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} hitSlop={10}>
          <Text style={styles.cancel}>취소</Text>
        </Pressable>
        <Text style={styles.title}>피드 작성</Text>
        <Pressable accessibilityRole="button" onPress={submit} hitSlop={10}>
          <Text style={styles.submit}>{submitting ? '올리는 중' : '게시하기'}</Text>
        </Pressable>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.kinds}>
          {kinds.map(({ key, label }) => (
            <Pill key={key} label={label} width={89} height={31} active={kind === key} onPress={() => setKind(key)} />
          ))}
        </View>

        <View style={styles.inputBox}>
          <TextInput
            accessibilityLabel="미션 기록" placeholder="오늘의 미션을 기록해보세요!" placeholderTextColor={palette.textMuted}
            style={styles.input} multiline maxLength={MAX_LENGTH} value={text} onChangeText={setText} textAlignVertical="top"
          />
          <Text style={styles.counter}>{text.length} / {MAX_LENGTH}</Text>
        </View>

        {currentMission?.data ? <Text style={styles.missionName}>{currentMission.data.missionTitle}</Text> : null}
        {message ?? currentMission?.error ? <Text style={styles.error}>{message ?? currentMission?.error}</Text> : null}

        <Pressable accessibilityRole="button" accessibilityLabel="사진 추가" onPress={pickImage} style={styles.photoBox}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          ) : (
            <>
              <Text style={styles.plus}>+</Text>
              <Text style={styles.photoLabel}>사진 추가</Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      <View style={[styles.visibility, { marginBottom: Math.max(bottom, 16) + 21 }]}>
        <Text style={styles.visibilityLabel}>공개 범위</Text>
        <View style={styles.visibilityChips}>
          {visibilities.map(({ key, label }) => (
            <Pill key={key} label={label} width={69} height={24} active={visibility === key} onPress={() => setVisibility(key)} />
          ))}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  cancel: { fontSize: 14, color: palette.text },
  title: { fontWeight: '600', fontSize: 16, color: palette.text },
  submit: { fontWeight: '500', fontSize: 14, color: palette.text },
  scroll: { paddingHorizontal: 16, paddingTop: 42, paddingBottom: 24 },
  kinds: { flexDirection: 'row', gap: 17 },
  inputBox: { height: 167, marginTop: 32, borderWidth: 1, borderColor: palette.border, borderRadius: 10, padding: 14 },
  input: { flex: 1, fontSize: 12, color: palette.text, padding: 0 },
  counter: { alignSelf: 'flex-end', fontSize: 12, color: palette.textMuted, marginTop: 6 },
  photoBox: { width: 138, height: 138, marginTop: 24, borderWidth: 1, borderColor: palette.border, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  preview: { width: '100%', height: '100%' },
  missionName: { fontSize: 12, color: palette.textMuted, marginTop: 12 },
  error: { fontSize: 12, color: palette.heart, marginTop: 8 },
  plus: { fontSize: 20, color: palette.textMuted },
  photoLabel: { fontSize: 12, color: palette.textMuted, marginTop: 4 },
  visibility: { marginHorizontal: 16, height: 63, borderWidth: 1, borderColor: palette.border, borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 21 },
  visibilityLabel: { fontSize: 14, color: palette.text, width: 90 },
  visibilityChips: { flexDirection: 'row', gap: 15 },
});

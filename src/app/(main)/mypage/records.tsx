import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FeedPhoto from '@/components/common/FeedPhoto';
import Pill from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import { browserAuthEnabled } from '../../../components/auth/browserSession';
import { dateKey, monthKey, todayInSeoul } from '../../../components/mypage/recordDates';
import { getDayRecords, getMonthlyRecords, type DayRecord, type RecordItem } from '../../../components/mypage/recordsApi';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const missionLabels = { personal: '개인 미션', group: '그룹 미션' };
const missionColors = { personal: palette.gradientTop, group: palette.primary };
type MissionKind = keyof typeof missionLabels;

type DateResult<T> = { key: string; data?: T; error?: string };

export default function PracticeRecordsScreen() {
  const [month, setMonth] = useState(() => {
    const today = todayInSeoul();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number>();
  const [monthResult, setMonthResult] = useState<DateResult<Map<string, DayRecord>>>();
  const [dayResult, setDayResult] = useState<DateResult<RecordItem[]>>();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = month.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const numberOfCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const key = monthKey(month);
  const selectedDate = selectedDay === undefined ? undefined : dateKey(new Date(year, monthIndex, selectedDay));
  const activeMonth = monthResult?.key === key ? monthResult : undefined;
  const activeDay = dayResult?.key === selectedDate ? dayResult : undefined;
  const connected = Platform.OS === 'web' && browserAuthEnabled;

  useEffect(() => {
    if (!connected) return;
    const request = new AbortController();
    void getMonthlyRecords(key, request.signal).then(({ days }) => {
      if (!request.signal.aborted) setMonthResult({ key, data: new Map(days.map((day) => [day.date, day])) });
    }).catch((error: Error) => {
      if (!request.signal.aborted) setMonthResult({ key, error: error.message });
    });
    return () => request.abort();
  }, [connected, key]);

  useEffect(() => {
    if (!connected || !selectedDate) return;
    const request = new AbortController();
    void getDayRecords(selectedDate, request.signal).then((data) => {
      if (!request.signal.aborted) setDayResult({ key: selectedDate, data });
    }).catch((error: Error) => {
      if (!request.signal.aborted) setDayResult({ key: selectedDate, error: error.message });
    });
    return () => request.abort();
  }, [connected, selectedDate]);

  function moveMonth(offset: number) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
    setSelectedDay(undefined);
  }

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="마이페이지로 돌아가기"
            onPress={() => router.canGoBack() ? router.back() : router.replace('/mypage')}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={23} color={palette.text} />
          </Pressable>
          <Text accessibilityRole="header" style={styles.heading}>나의 실천 기록</Text>
        </View>

        <View style={styles.monthBar}>
          <Pressable accessibilityRole="button" accessibilityLabel="이전 달" onPress={() => moveMonth(-1)} style={styles.arrow}>
            <Ionicons name="chevron-back" size={21} color={palette.text} />
          </Pressable>
          <Text accessibilityLiveRegion="polite" style={styles.monthTitle}>{year}년 {monthIndex + 1}월</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="다음 달" onPress={() => moveMonth(1)} style={styles.arrow}>
            <Ionicons name="chevron-forward" size={21} color={palette.text} />
          </Pressable>
        </View>

        <View style={styles.calendar}>
          <View style={styles.grid}>
            {weekdays.map((weekday) => (
              <Text key={weekday} style={styles.weekday}>{weekday}</Text>
            ))}
            {Array.from({ length: numberOfCells }, (_, index) => {
              const day = index - firstWeekday + 1;
              const date = new Date(year, monthIndex, day);
              const inMonth = day >= 1 && day <= daysInMonth;
              const record = inMonth ? activeMonth?.data?.get(dateKey(date)) : undefined;
              const kinds: MissionKind[] = [];
              if (record?.personalCompleted) kinds.push('personal');
              if (record?.groupCompleted && date.getDay() === 1) kinds.push('group');
              const selected = inMonth && day === selectedDay;

              return (
                <Pressable
                  key={index}
                  disabled={!inMonth || !connected}
                  accessibilityRole="button"
                  accessibilityLabel={`${date.getMonth() + 1}월 ${date.getDate()}일${kinds.map((kind) => `, ${missionLabels[kind]} 완료`).join('')}`}
                  accessibilityState={{ selected, disabled: !inMonth || !connected }}
                  onPress={() => setSelectedDay(day)}
                  style={styles.day}
                >
                  <View style={[styles.dayNumber, selected && styles.selected]}>
                    <Text style={[styles.dayText, !inMonth && styles.outsideMonth]}>{date.getDate()}</Text>
                  </View>
                  <View style={styles.dots}>
                    {kinds.map((kind) => <View key={kind} style={[styles.dot, { backgroundColor: missionColors[kind] }]} />)}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: missionColors.personal }]} />
              <Text style={styles.legendText}>{missionLabels.personal}</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: missionColors.group }]} />
              <Text style={styles.legendText}>{missionLabels.group} (주 시작일)</Text>
            </View>
          </View>
        </View>
        {!activeMonth?.data && (
          <Text accessibilityLiveRegion="polite" style={styles.status}>
            {connected ? activeMonth?.error ?? '월별 기록 불러오는 중…' : '카카오 로그인 후 웹에서 기록을 확인해 주세요.'}
          </Text>
        )}

        {selectedDay !== undefined && (
          <View style={styles.details}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailTitle}>{monthIndex + 1}월 {selectedDay}일 ({weekdays[(firstWeekday + selectedDay - 1) % 7]})</Text>
              {activeDay?.data && <Text style={styles.recordCount}>{activeDay.data.length}개의 기록</Text>}
            </View>
            {!activeDay?.data && <Text style={styles.recordCount}>{activeDay?.error ?? '기록 불러오는 중…'}</Text>}
            {activeDay?.data?.length === 0 && <Text style={styles.recordCount}>이날의 실천 기록이 없어요.</Text>}
            {activeDay?.data?.map((record) => (
              <View key={record.certificationId} style={styles.record}>
                <View style={styles.photo}><FeedPhoto uri={record.imageUrl ?? undefined} size={76} radius={10} /></View>
                <View style={styles.recordText}>
                  <Pill label={missionLabels[record.missionType === 'GROUP' ? 'group' : 'personal']} style={styles.badge} />
                  <Text style={styles.detailTitle}>{record.missionTitle}</Text>
                  <Text style={styles.description}>{record.content}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  content: { paddingTop: 20, paddingBottom: 30, alignSelf: 'center', width: '100%', maxWidth: 540 },
  header: { minHeight: 44, justifyContent: 'center', alignItems: 'center' },
  back: { position: 'absolute', left: 0, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  heading: { color: palette.text, fontSize: 16, fontWeight: '700' },
  monthBar: {
    minHeight: 55, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: palette.border,
  },
  monthTitle: { color: palette.text, fontSize: 21, fontWeight: '700', textAlign: 'center', minWidth: 132 },
  arrow: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  calendar: { paddingHorizontal: 25, paddingTop: 28 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.285%', textAlign: 'center', color: palette.text, fontSize: 15, fontWeight: '600', marginBottom: 9 },
  day: { width: '14.285%', height: 69, alignItems: 'center', justifyContent: 'center' },
  dayNumber: { width: 25, height: 25, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  selected: { backgroundColor: palette.tint },
  dayText: { color: palette.text, fontSize: 14, fontWeight: '600' },
  outsideMonth: { color: palette.borderSoft },
  dots: { height: 8, flexDirection: 'row', gap: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 32, marginTop: 7 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 13, fontWeight: '600', color: palette.textMuted },
  status: { marginTop: 16, marginHorizontal: 16, textAlign: 'center', color: palette.textMuted },
  details: { marginHorizontal: 16, marginTop: 31, padding: 15, borderRadius: 10, backgroundColor: palette.tint, gap: 10 },
  detailsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  detailTitle: { fontSize: 14, fontWeight: '600', color: palette.text },
  recordCount: { fontSize: 11, color: palette.textMuted },
  record: { flexDirection: 'row', alignItems: 'flex-start', gap: 18, paddingBottom: 3 },
  photo: { overflow: 'hidden', borderRadius: 10, backgroundColor: '#E3E2F1' },
  recordText: { flex: 1, gap: 5 },
  badge: { alignSelf: 'flex-start' },
  description: { fontSize: 12, lineHeight: 15, color: palette.text },
});

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FeedPhoto from '@/components/common/FeedPhoto';
import Pill from '@/components/common/Pill';
import { palette } from '@/constants/theme';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
const missionLabels = { personal: '개인 미션', group: '그룹 미션' };
const missionColors = { personal: palette.gradientTop, group: palette.primary };
type MissionKind = keyof typeof missionLabels;

const previewMissions = {
  personal: {
    title: '책상 한 쪽 비우기',
    description: '공부 공간 한 쪽을 정리하고\n달라진 공간의 사진을 남겨주세요!',
  },
  group: {
    title: '한 주의 휴식 풍경',
    description: '이번 주 혼자 쉬며 좋았던 장면을 그룹에 남겨주세요!',
  },
};

const previewDays: Partial<Record<number, MissionKind[]>> = {
  2: ['personal'], 3: ['personal'], 4: ['personal'], 5: ['personal'],
  7: ['personal', 'group'], 9: ['personal'], 11: ['personal'], 12: ['personal'],
  13: ['group'], 18: ['personal'], 19: ['group'], 20: ['personal'], 21: ['personal'],
};

export default function PracticeRecordsScreen() {
  const [month, setMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDay, setSelectedDay] = useState<number>();
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = month.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const numberOfCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const records = year === 2026 && monthIndex === 10 ? previewDays : {};
  const selectedRecords = selectedDay === undefined ? [] : records[selectedDay] ?? [];

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
            onPress={() => router.canGoBack() ? router.back() : router.replace('/mypage/index')}
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
              const kinds = inMonth ? records[day] ?? [] : [];
              const selected = inMonth && day === selectedDay;

              return (
                <Pressable
                  key={index}
                  disabled={!inMonth}
                  accessibilityRole="button"
                  accessibilityLabel={`${date.getMonth() + 1}월 ${date.getDate()}일${kinds.map((kind) => `, ${missionLabels[kind]} 완료`).join('')}`}
                  accessibilityState={{ selected, disabled: !inMonth }}
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
              <Text style={styles.legendText}>{missionLabels.group}</Text>
            </View>
          </View>
        </View>

        {selectedDay !== undefined && (
          <View style={styles.details}>
            <View style={styles.detailsHeader}>
              <Text style={styles.detailTitle}>{monthIndex + 1}월 {selectedDay}일 ({weekdays[(firstWeekday + selectedDay - 1) % 7]})</Text>
              <Text style={styles.recordCount}>{selectedRecords.length}개의 기록</Text>
            </View>
            {selectedRecords.length === 0 && <Text style={styles.recordCount}>이날의 실천 기록이 없어요.</Text>}
            {selectedRecords.map((kind) => (
              <View key={kind} style={styles.record}>
                <View style={styles.photo}><FeedPhoto size={76} radius={10} /></View>
                <View style={styles.recordText}>
                  <Pill label={missionLabels[kind]} style={styles.badge} />
                  <Text style={styles.detailTitle}>{previewMissions[kind].title}</Text>
                  <Text style={styles.description}>{previewMissions[kind].description}</Text>
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

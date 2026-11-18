import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Avatar from '@/components/common/Avatar';
import Pill from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import { currentUser, groupInfo } from '@/data/feedStore';
import { illustrations } from '@/data/illustrations';
import { mindTypes } from '@/data/mindTypes';

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];
const practice = { currentStreak: 3, longestStreak: 12, completedDays: 5 };
const missions = [
  { label: '이번 주 개인 미션', done: 3, total: 7 },
  { label: '이번 주 그룹 미션', done: 1, total: 1 },
];

const comingSoon = (title: string) => Alert.alert(title, '화면을 준비 중입니다.');

export default function MyPageScreen() {
  const mindType = mindTypes[currentUser.mindCode];

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.heading}>마이페이지</Text>
          <Pressable accessibilityRole="button" accessibilityLabel="설정" hitSlop={10} onPress={() => router.push('/settings')}>
            <Ionicons name="settings-outline" size={21} color={palette.text} />
          </Pressable>
        </View>

        <View style={styles.profile}>
          <Avatar size={65} />
          <View style={styles.identity}>
            <Text style={styles.name}>{currentUser.name}</Text>
            <Text style={styles.profileMeta}>{currentUser.stage}  {currentUser.mindCode}</Text>
          </View>
        </View>

        <View style={styles.typeCard}>
          <Pill label="나의 유형" style={styles.typeBadge} />
          <Text style={styles.typeName}>{mindType.name.replace(/회복형$/, ' 회복형')}</Text>
          <View style={styles.typeDetails}>
            <Text style={styles.description}>{mindType.description}</Text>
            <Pill label="유형 재검사" width={75} onPress={() => router.push('/type-test')} />
          </View>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryCard}>
            <Pressable accessibilityRole="button" onPress={() => router.push('/mypage/records')} hitSlop={8} style={styles.recordHeader}>
              <Text style={styles.label}>나의 실천 기록</Text>
              <Ionicons name="chevron-forward" size={12} color={palette.text} />
            </Pressable>
            <View style={styles.streaks}>
              <View style={styles.streak}>
                <Text style={styles.unit}><Text style={styles.count}>{practice.currentStreak}</Text>일</Text>
                <Text style={styles.meta}>현재 연속 완료</Text>
              </View>
              <View style={styles.streak}>
                <Text style={styles.unit}><Text style={styles.count}>{practice.longestStreak}</Text>일</Text>
                <Text style={styles.meta}>최장 연속 완료</Text>
              </View>
            </View>
            <View style={styles.week}>
              {weekdays.map((day, index) => (
                <View key={day} style={styles.day} accessible accessibilityLabel={`${day}요일 ${index < practice.completedDays ? '완료' : '미완료'}`}>
                  <Text style={styles.meta}>{day}</Text>
                  <View style={[styles.dot, index < practice.completedDays && styles.completedDot, index === practice.completedDays - 1 && styles.latestDot]} />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.label}>나의 미션 현황</Text>
            <View style={styles.missions}>
              {missions.map(({ label, done, total }) => (
                <View key={label} accessibilityRole="progressbar" accessibilityLabel={label} accessibilityValue={{ min: 0, max: total, now: done }}>
                  <View style={styles.missionHeading}>
                    <Text style={[styles.meta, styles.missionLabel]}>{label}</Text>
                    <Text style={styles.meta}>{done}/{total}</Text>
                  </View>
                  <View style={styles.track}><View style={[styles.fill, { width: `${done / total * 100}%` }]} /></View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={() => router.navigate('/group')} style={styles.groupCard}>
          <Text style={styles.label}>내 그룹</Text>
          <View style={styles.groupRow}>
            <View style={styles.groupImageFrame}>
              <Image source={illustrations[groupInfo.mindCode]} style={styles.groupImage} resizeMode="contain" />
            </View>
            <View style={styles.groupIdentity}>
              <Text style={styles.groupName}>{groupInfo.name}</Text>
              <View style={styles.groupTags}>
                <Pill label={groupInfo.stage} />
                <Pill label={groupInfo.mindCode} />
                <Pill label={`${groupInfo.members.length}명`} />
              </View>
            </View>
          </View>
        </Pressable>

        <View style={styles.links}>
          {['고객센터', '공지사항'].map((label) => (
            <Pressable key={label} accessibilityRole="button" onPress={() => comingSoon(label)} style={styles.link}>
              <Text style={styles.linkText}>{label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  content: { paddingHorizontal: 16, paddingTop: 25, paddingBottom: 22, width: '100%', maxWidth: 540, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 32 },
  heading: { color: palette.text, fontSize: 16, fontWeight: '700' },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 23, marginBottom: 19 },
  identity: { flex: 1, gap: 2 },
  name: { color: palette.text, fontSize: 20, fontWeight: '600' },
  profileMeta: { color: palette.textMuted, fontSize: 14 },
  typeCard: { borderRadius: 10, backgroundColor: palette.tint, padding: 15, minHeight: 132 },
  typeBadge: { alignSelf: 'flex-start', paddingHorizontal: 9 },
  typeName: { color: palette.text, fontSize: 16, fontWeight: '600', marginTop: 8 },
  typeDetails: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, marginTop: 8 },
  description: { flexGrow: 1, flexShrink: 1, flexBasis: 170, maxWidth: 224, color: palette.textMuted, fontSize: 12, lineHeight: 14 },
  summary: { flexDirection: 'row', gap: 18, marginTop: 24 },
  summaryCard: {
    flex: 1, minWidth: 0, minHeight: 152, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 13,
    backgroundColor: palette.white, borderWidth: StyleSheet.hairlineWidth, borderColor: '#E6E6E6',
    shadowColor: '#000000', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.16, shadowRadius: 2, elevation: 2,
  },
  recordHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: palette.text, fontSize: 12, fontWeight: '500' },
  streaks: { flexDirection: 'row', gap: 4, marginTop: 8 },
  streak: { flex: 1, alignItems: 'center', gap: 2 },
  count: { fontSize: 24, fontWeight: '500' },
  unit: { color: palette.text, fontSize: 12 },
  meta: { color: palette.textMuted, fontSize: 11 },
  week: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  day: { alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C4C4C4' },
  completedDot: { backgroundColor: palette.gradientTop },
  latestDot: { backgroundColor: palette.primary },
  missions: { flex: 1, justifyContent: 'flex-end', gap: 11, paddingBottom: 8 },
  missionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 5 },
  missionLabel: { flexShrink: 1 },
  track: { height: 5, borderRadius: 3, backgroundColor: palette.tint, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3, backgroundColor: palette.primary },
  groupCard: { marginTop: 25, minHeight: 106, backgroundColor: palette.tint, padding: 10, paddingTop: 13, borderRadius: 10 },
  groupRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  groupImageFrame: {
    width: 57, height: 57, borderRadius: 10, backgroundColor: palette.white,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.19, shadowRadius: 2, elevation: 2,
  },
  groupImage: { width: '100%', height: '100%', borderRadius: 10 },
  groupIdentity: { flex: 1, gap: 8 },
  groupName: { color: palette.text, fontSize: 14, fontWeight: '600' },
  groupTags: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  links: { marginTop: 23 },
  link: { minHeight: 47, justifyContent: 'center', alignItems: 'flex-start' },
  linkText: { color: palette.textMuted, fontSize: 14, fontWeight: '700' },
});

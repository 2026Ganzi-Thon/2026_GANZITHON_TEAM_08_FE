import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/common/Avatar';
import FeedPhoto from '@/components/common/FeedPhoto';
import MissionCard from '@/components/common/MissionCard';
import Pill from '@/components/common/Pill';
import { palette } from '@/constants/theme';

type Activity = {
  id: string;
  author: string;
  stage: string;
  mindCode: string;
  text: string;
  imageUri?: string;
  timeAgo: string;
  likes: number;
  comments: number;
};

const todayMission = {
  date: '11/21',
  title: '책상 한 쪽 비우기',
  description: '공부 공간 한 쪽을 정리하고\n달라진 공간의 사진을 남겨주세요!',
};

const weeklyMission = {
  range: '11/16 ~ 11/22',
  title: '한 주의 휴식 풍경',
  description: '이번 주 혼자 쉬며 좋았던 장면 하나를 찾아\n그룹에 남겨주세요!',
};

const recentActivities: Activity[] = [
  { id: 'a1', author: '주댕치', stage: '취준생', mindCode: 'AAAA', text: '어질러져 있던 책상을 드디어 정리했어요!', timeAgo: '1시간 전', likes: 10, comments: 3 },
  { id: 'a2', author: '유자차', stage: '취준생', mindCode: 'ABBA', text: '오래 앉아있어서 몸이 찌뿌둥할 때\n다들 기지개 한 번씩 펴보세요!!\n척추 수술 2000만원...', timeAgo: '2시간 전', likes: 3, comments: 1 },
];

const comingSoon = (title: string) => Alert.alert(title, '화면을 준비 중입니다.');

function ActivityCard({ item }: { item: Activity }) {
  const [liked, setLiked] = useState(false);
  const likes = item.likes + (liked ? 1 : 0);

  return (
    <Pressable accessibilityRole="button" onPress={() => comingSoon('피드 상세')} style={({ pressed }) => [styles.activity, pressed && styles.pressed]}>
      <View style={styles.activityRow}>
        {item.imageUri ? <FeedPhoto uri={item.imageUri} size={75} /> : null}
        <View style={styles.activityBody}>
          <View style={styles.activityTop}>
            <Avatar />
            <Text style={styles.name}>{item.author}</Text>
            <Text style={styles.meta}>{item.stage}</Text>
            <Text style={styles.meta}>{item.mindCode}</Text>
            <View style={styles.spacer} />
            <Pill label="개인 미션" width={63} />
          </View>
          <Text style={styles.activityText} numberOfLines={3}>{item.text}</Text>
        </View>
      </View>
      <View style={styles.activityFooter}>
        <Text style={styles.meta}>{item.timeAgo}</Text>
        <View style={styles.reactions}>
          <Pressable accessibilityRole="button" accessibilityLabel="응원하기" onPress={() => setLiked((value) => !value)} hitSlop={8} style={styles.reaction}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={20} color={liked ? palette.heart : palette.text} />
            <Text style={styles.reactionText}>응원하기 {likes}</Text>
          </Pressable>
          <View style={styles.reaction}>
            <Ionicons name="chatbubble-outline" size={20} color="#000000" />
            <Text style={styles.reactionText}>댓글 {item.comments}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
      <LinearGradient colors={[palette.gradientTop, palette.white]} style={[styles.header, { paddingTop: top + 35 }]}>
        <View style={styles.headerRow}>
          <Image source={require('../../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" accessibilityLabel="MINDOT" />
          <Pressable accessibilityRole="button" accessibilityLabel="알림" onPress={() => comingSoon('알림')} hitSlop={10}>
            <Ionicons name="notifications-outline" size={20} color="#000000" />
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <MissionCard
          pillLabel="오늘의 개인 미션" pillWidth={93} dateText={todayMission.date}
          title={todayMission.title} description={todayMission.description}
          actionLabel="미션 하러 가기" onAction={() => comingSoon('개인 미션')}
        />
        <MissionCard
          pillLabel="이번 주 그룹 미션" pillWidth={101} dateText={weeklyMission.range}
          title={weeklyMission.title} description={weeklyMission.description}
          actionLabel="미션 하러 가기" onAction={() => comingSoon('그룹 미션')}
        />
        <Text style={styles.section}>최근 활동</Text>
        {recentActivities.map((item) => <ActivityCard key={item.id} item={item} />)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  scroll: { paddingBottom: 24 },
  header: { height: 165, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  logo: { width: 198, height: 48.6 },
  content: { paddingHorizontal: 16, gap: 17, marginTop: 34 },
  section: { fontSize: 14, fontWeight: '500', color: '#000000', marginTop: 12, marginLeft: 1 },
  activity: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.border, borderRadius: 10, padding: 9, paddingBottom: 14 },
  pressed: { opacity: 0.85 },
  activityRow: { flexDirection: 'row', gap: 14 },
  activityBody: { flex: 1, gap: 12 },
  activityTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  spacer: { flex: 1 },
  name: { fontSize: 14, fontWeight: '500', color: '#000000' },
  meta: { fontSize: 12, color: palette.textMuted },
  activityText: { fontSize: 12, lineHeight: 15, color: '#000000' },
  activityFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 4 },
  reactions: { flexDirection: 'row', alignItems: 'center', gap: 22 },
  reaction: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reactionText: { fontSize: 12, color: palette.text },
});

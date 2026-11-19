import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/common/Avatar';
import FeedPhoto from '@/components/common/FeedPhoto';
import MissionCard from '@/components/common/MissionCard';
import Pill from '@/components/common/Pill';
import ReactionBar from '@/components/common/ReactionBar';
import { palette } from '@/constants/theme';
import { timeAgo, type Post } from '@/data/feedStore';
import { useFeed } from '@/src/components/feed/useFeed';
import { formatMissionDate, formatMissionRange, type HomeMission } from '@/src/components/home/homeApi';
import { useHomeMissions } from '@/src/components/home/useHomeMissions';

const comingSoon = (title: string) => Alert.alert(title, '화면을 준비 중입니다.');

function ActivityCard({ item, onCheer }: { item: Post; onCheer: (post: Post) => void }) {
  const open = () => router.push({ pathname: '/post/[id]', params: { id: item.id } });

  return (
    <Pressable onPress={open} style={({ pressed }) => [styles.activity, pressed && styles.pressed]}>
      <View style={styles.activityRow}>
        {item.imageUri ? <FeedPhoto uri={item.imageUri} size={75} /> : null}
        <View style={styles.activityBody}>
          <View style={styles.activityTop}>
            <Avatar />
            <Text style={styles.name}>{item.author}</Text>
            {item.stage ? <Text style={styles.meta}>{item.stage}</Text> : null}
            {item.mindCode ? <Text style={styles.meta}>{item.mindCode}</Text> : null}
            <View style={styles.spacer} />
            <Pill label={item.missionTitle ?? (item.kind === 'group' ? '그룹 미션' : '개인 미션')} width={63} />
          </View>
          <Text style={styles.activityText} numberOfLines={3}>{item.text}</Text>
        </View>
      </View>
      <View style={styles.activityFooter}>
        <Text style={styles.meta}>{timeAgo(item.createdAt)}</Text>
        <ReactionBar post={item} onCommentPress={open} onLikePress={() => onCheer(item)} />
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const { personal, group, personalError, groupError, loading } = useHomeMissions();
  const { posts, cheer } = useFeed('all');
  const recentActivities = posts.slice(0, 2);

  const missionCard = (kind: 'personal' | 'group', mission: HomeMission | undefined, error: string | undefined) => {
    const isGroup = kind === 'group';
    if (!mission) {
      return <Text style={styles.notice}>{loading ? '미션을 불러오는 중이에요.' : error}</Text>;
    }
    return (
      <MissionCard
        pillLabel={isGroup ? '이번 주 그룹 미션' : '오늘의 개인 미션'} pillWidth={isGroup ? 101 : 93}
        dateText={isGroup ? formatMissionRange(mission) : formatMissionDate(mission)}
        title={mission.missionTitle} description={mission.missionDescription}
        actionLabel={mission.completed ? '인증 완료' : '미션 하러 가기'}
        onAction={mission.completed ? undefined : () => router.push({ pathname: '/write', params: { kind } })}
      />
    );
  };

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
        {missionCard('personal', personal, personalError)}
        {missionCard('group', group, groupError)}
        <Text style={styles.section}>최근 활동</Text>
        {recentActivities.map((item) => <ActivityCard key={item.id} item={item} onCheer={cheer} />)}
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
  notice: { fontSize: 14, color: palette.textMuted, textAlign: 'center', paddingVertical: 24 },
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
});

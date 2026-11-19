import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import Avatar from '@/components/common/Avatar';
import BellHeader from '@/components/common/BellHeader';
import FeedPhoto from '@/components/common/FeedPhoto';
import MissionCard from '@/components/common/MissionCard';
import Pill from '@/components/common/Pill';
import ReactionBar from '@/components/common/ReactionBar';
import { palette } from '@/constants/theme';
import { groupInfo, usePosts, type Post } from '@/data/feedStore';
import { mindTypes } from '@/data/mindTypes';

function GroupPost({ post }: { post: Post }) {
  const open = () => router.push({ pathname: '/post/[id]', params: { id: post.id } });
  return (
    <Pressable onPress={open} style={({ pressed }) => [styles.post, pressed && styles.pressed]}>
      <View style={styles.postTop}>
        <Avatar />
        <View style={styles.who}>
          <Text style={styles.name}>{post.author}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>{post.stage}</Text>
            <Text style={styles.meta}>{post.mindCode}</Text>
          </View>
        </View>
      </View>
      <Pill label="그룹 미션" width={61} style={styles.postPill} />
      <Text style={styles.postText}>{post.text}</Text>
      {post.imageUri ? <View style={styles.photoRow}><FeedPhoto uri={post.imageUri} size={98} radius={12} /></View> : null}
      <View style={styles.reaction}><ReactionBar post={post} onCommentPress={open} /></View>
    </Pressable>
  );
}

export default function GroupScreen() {
  const posts = usePosts().filter((post) => post.kind === 'group' && post.visibility !== 'me');
  const typeName = mindTypes[groupInfo.mindCode].name;
  const rate = Math.round((groupInfo.done / groupInfo.total) * 100);

  return (
    <View style={styles.screen}>
      <BellHeader title="내 그룹" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.profile}>
          <View style={styles.groupImage}><Ionicons name="people" size={28} color={palette.primary} /></View>
          <Text style={styles.groupName}>{groupInfo.name}</Text>
        </View>

        <View style={styles.membersRow}>
          <View style={styles.members}>
            {groupInfo.members.map((member) => (
              <View key={member} style={styles.member}>
                <Avatar />
                <Text style={styles.meta}>{member}</Text>
              </View>
            ))}
          </View>
          <View style={styles.info}>
            {[
              ['생활 단계', groupInfo.stage],
              ['유형', `${groupInfo.mindCode} ${typeName}`],
              ['인원', `${groupInfo.members.length}/${groupInfo.capacity}`],
            ].map(([label, value]) => (
              <View key={label} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <MissionCard
            pillLabel="이번 주 그룹 미션" pillWidth={101} dateText={groupInfo.weekRange}
            title={groupInfo.missionTitle} description={groupInfo.missionDescription} descriptionSize={14}
          />
        </View>

        <View style={styles.progress}>
          <Text style={styles.progressTitle}>이번 주 미션 진행 상황</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressLeft}>
              <Text style={styles.meta}>{groupInfo.done}/{groupInfo.total}</Text>
              <View style={styles.track}><View style={[styles.fill, { width: `${rate}%` }]} /></View>
            </View>
            <View style={styles.progressRight}>
              <Text style={styles.meta}>참여율</Text>
              <Text style={styles.rate}>{rate}%</Text>
            </View>
          </View>
        </View>

        <View style={styles.list}>
          {posts.map((post) => <GroupPost key={post.id} post={post} />)}
        </View>
      </ScrollView>
      <Pressable accessibilityRole="button" accessibilityLabel="그룹 미션 작성" onPress={() => router.push({ pathname: '/write', params: { kind: 'group' } })} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
        <Ionicons name="create-outline" size={26} color={palette.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  scroll: { paddingBottom: 100 },
  pressed: { opacity: 0.8 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingHorizontal: 15, marginTop: 5 },
  groupImage: { width: 57, height: 57, borderRadius: 12, backgroundColor: palette.tint, alignItems: 'center', justifyContent: 'center' },
  groupName: { fontWeight: '500', fontSize: 14, color: palette.text },
  membersRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 12 },
  members: { flexDirection: 'row', gap: 13, alignItems: 'flex-start', paddingTop: 21 },
  member: { alignItems: 'center', gap: 5, width: 36 },
  info: { width: 175, minHeight: 78, backgroundColor: palette.tint, borderRadius: 10, paddingVertical: 13, paddingHorizontal: 11, gap: 7 },
  infoRow: { flexDirection: 'row', gap: 10 },
  infoLabel: { width: 60, fontSize: 12, color: palette.text },
  infoValue: { flex: 1, fontSize: 12, color: palette.text },
  meta: { fontSize: 12, color: palette.textMuted },
  block: { paddingHorizontal: 16, marginTop: 15 },
  progress: { marginHorizontal: 16, marginTop: 20, borderWidth: 1, borderColor: palette.borderSoft, borderRadius: 10, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  progressTitle: { fontWeight: '500', fontSize: 14, color: palette.text },
  progressRow: { flexDirection: 'row', marginTop: 10 },
  progressLeft: { flex: 1, gap: 8 },
  progressRight: { width: 90, paddingLeft: 12, gap: 3 },
  track: { height: 7, borderRadius: 10, backgroundColor: palette.tint, overflow: 'hidden' },
  fill: { height: 7, borderRadius: 10, backgroundColor: palette.primary },
  rate: { fontWeight: '500', fontSize: 14, color: palette.text },
  list: { paddingHorizontal: 16, marginTop: 20, gap: 21 },
  post: {
    backgroundColor: palette.white, borderRadius: 10, padding: 10, paddingBottom: 14,
    shadowColor: '#000000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 3,
  },
  postTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  who: { gap: 4 },
  name: { fontWeight: '500', fontSize: 14, color: palette.text },
  metaRow: { flexDirection: 'row', gap: 8 },
  postPill: { marginTop: 8, marginLeft: 3 },
  postText: { fontSize: 12, lineHeight: 15, color: palette.text, marginTop: 14, marginLeft: 3 },
  photoRow: { flexDirection: 'row', gap: 14, marginTop: 14, marginLeft: 3 },
  reaction: { marginTop: 14, marginLeft: 2 },
  fab: { position: 'absolute', right: 16, bottom: 24, width: 53, height: 53, borderRadius: 27, backgroundColor: palette.primary, alignItems: 'center', justifyContent: 'center', shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 4 },
});

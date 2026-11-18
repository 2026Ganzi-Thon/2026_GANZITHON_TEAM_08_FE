import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { timeAgo, type Post } from '@/data/feedStore';

import Avatar from './Avatar';
import FeedPhoto from './FeedPhoto';
import Pill from './Pill';
import ReactionBar from './ReactionBar';

export default function PostCard({ post }: { post: Post }) {
  const open = () => router.push({ pathname: '/post/[id]', params: { id: post.id } });
  return (
    <Pressable accessibilityRole="button" onPress={open} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.top}>
        <Avatar />
        <View style={styles.who}>
          <Text style={styles.name}>{post.author}</Text>
          <View style={styles.meta}>
            <Text style={styles.metaText}>{post.stage}</Text>
            <Text style={styles.metaText}>{post.mindCode}</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-horizontal" size={16} color="#555555" />
      </View>
      <Pill label={post.kind === 'group' ? '그룹 미션' : '개인 미션'} width={61} style={styles.pill} />
      <Text style={styles.body}>{post.text}</Text>
      {post.imageUri ? <View style={styles.photo}><FeedPhoto uri={post.imageUri} size={216} radius={15} /></View> : null}
      <View style={styles.reaction}><ReactionBar post={post} onCommentPress={open} /></View>
      <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.white, borderRadius: 10, padding: 11, paddingBottom: 14,
    shadowColor: '#000000', shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width: 0, height: 0 }, elevation: 3,
  },
  pressed: { opacity: 0.85 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  who: { flex: 1, gap: 4 },
  name: { fontWeight: '500', fontSize: 14, color: palette.text },
  meta: { flexDirection: 'row', gap: 10 },
  metaText: { fontSize: 12, color: palette.textMuted },
  pill: { marginTop: 8, marginLeft: 3 },
  body: { fontSize: 14, lineHeight: 17, color: '#000000', marginTop: 14, marginLeft: 3 },
  photo: { marginTop: 14, marginLeft: 3 },
  reaction: { marginTop: 16, marginLeft: 6 },
  time: { fontSize: 12, color: palette.textMuted, marginTop: 14, marginLeft: 3 },
});

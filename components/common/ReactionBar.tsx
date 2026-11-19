import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { toggleLike, type Post } from '@/data/feedStore';

type Props = { post: Post; onCommentPress?: () => void; onLikePress?: () => void };

export default function ReactionBar({ post, onCommentPress, onLikePress }: Props) {
  return (
    <View style={styles.row}>
      <Pressable accessibilityRole="button" accessibilityLabel="응원하기" onPress={onLikePress ?? (() => toggleLike(post.id))} hitSlop={8} style={styles.item}>
        <Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={20} color={post.liked ? palette.heart : palette.text} />
        <Text style={styles.label}>응원하기</Text>
        <Text style={styles.count}>{post.likes}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel="댓글" onPress={onCommentPress} hitSlop={8} style={styles.item}>
        <Ionicons name="chatbubble-outline" size={20} color="#000000" />
        <Text style={styles.label}>댓글</Text>
        <Text style={styles.count}>{post.comments.length}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 22 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  label: { fontSize: 12, color: palette.text },
  count: { fontSize: 12, color: palette.text, minWidth: 12 },
});

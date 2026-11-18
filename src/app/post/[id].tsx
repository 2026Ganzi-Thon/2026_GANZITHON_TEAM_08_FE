import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '@/components/common/Avatar';
import FeedPhoto from '@/components/common/FeedPhoto';
import Pill from '@/components/common/Pill';
import ReactionBar from '@/components/common/ReactionBar';
import { palette } from '@/constants/theme';
import { addComment, timeAgo, usePost } from '@/data/feedStore';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const post = usePost(id);
  const { top, bottom } = useSafeAreaInsets();
  const [draft, setDraft] = useState('');

  if (!post) {
    return (
      <View style={[styles.missing, { paddingTop: top + 28 }]}>
        <Pressable accessibilityRole="button" accessibilityLabel="뒤로" onPress={() => router.back()} hitSlop={10}>
          <Ionicons name="arrow-back" size={22} color="#000000" />
        </Pressable>
        <Text style={styles.missingText}>삭제되었거나 찾을 수 없는 게시글이에요.</Text>
      </View>
    );
  }

  const submit = () => {
    const text = draft.trim();
    if (!text) return;
    addComment(post.id, text);
    setDraft('');
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
        <View style={[styles.back, { paddingTop: top + 28 }]}>
          <Pressable accessibilityRole="button" accessibilityLabel="뒤로" onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="arrow-back" size={22} color="#000000" />
          </Pressable>
        </View>

        <View style={styles.article}>
          <View style={styles.author}>
            <Avatar size={45} />
            <Text style={styles.name}>{post.author}</Text>
            <Text style={styles.meta}>{post.stage}</Text>
            <Text style={styles.meta}>{post.mindCode}</Text>
            <View style={styles.spacer} />
            <Ionicons name="ellipsis-horizontal" size={16} color="#555555" />
          </View>
          <Pill label={post.kind === 'group' ? '그룹 미션' : '개인 미션'} width={75} fontSize={14} style={styles.pill} />
          <Text style={styles.body}>{post.text}</Text>
          {post.imageUri ? <View style={styles.photo}><FeedPhoto uri={post.imageUri} size={255} radius={20} /></View> : null}
          <View style={styles.reactionRow}>
            <ReactionBar post={post} />
            <Text style={styles.time}>{timeAgo(post.createdAt)}</Text>
          </View>
        </View>

        <View style={styles.comments}>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Avatar size={30} />
              <View style={styles.commentBody}>
                <Text style={styles.commentName}>{comment.author}</Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.inputBar, { paddingBottom: Math.max(bottom, 12) }]}>
        <TextInput
          accessibilityLabel="댓글 입력" placeholder="댓글을 남겨보세요." placeholderTextColor={palette.textMuted}
          style={styles.input} value={draft} onChangeText={setDraft} returnKeyType="send" onSubmitEditing={submit}
        />
        <Pill label="등록" width={50} height={25} fontSize={14} onPress={submit} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  scroll: { flexGrow: 1 },
  missing: { flex: 1, backgroundColor: palette.white, paddingHorizontal: 20 },
  missingText: { fontSize: 14, color: palette.textMuted, textAlign: 'center', marginTop: 80 },
  back: { paddingHorizontal: 26, paddingBottom: 14 },
  article: { paddingHorizontal: 16, paddingTop: 20 },
  author: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { fontWeight: '500', fontSize: 16, color: palette.text, marginLeft: 0 },
  meta: { fontSize: 14, color: palette.textMuted },
  spacer: { flex: 1 },
  pill: { marginTop: 12 },
  body: { fontSize: 14, lineHeight: 17, color: palette.text, marginTop: 28, marginLeft: 3 },
  photo: { marginTop: 18, marginLeft: 3 },
  reactionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 34, marginBottom: 24, paddingHorizontal: 2 },
  time: { fontSize: 12, color: palette.textMuted },
  comments: { flexGrow: 1, backgroundColor: palette.panel, paddingHorizontal: 16, paddingTop: 29, paddingBottom: 24, gap: 22 },
  comment: { flexDirection: 'row', gap: 4, alignItems: 'flex-start' },
  commentBody: { flex: 1, gap: 0 },
  commentName: { fontWeight: '600', fontSize: 12, color: palette.text },
  commentText: { fontSize: 12, color: palette.text, marginTop: 0 },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.white, paddingHorizontal: 16, paddingTop: 14 },
  input: { flex: 1, fontSize: 14, color: palette.text, padding: 0, minHeight: 25 },
});

import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BellHeader from '@/components/common/BellHeader';
import PostCard from '@/components/common/PostCard';
import { palette } from '@/constants/theme';
import { usePosts } from '@/data/feedStore';

const filters = [
  { key: 'all', label: '전체' },
  { key: 'group', label: '그룹' },
  { key: 'personal', label: '개인' },
] as const;

export default function FeedScreen() {
  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all');
  const posts = usePosts().filter((post) => post.visibility !== 'me' && (filter === 'all' || post.kind === filter));

  return (
    <View style={styles.screen}>
      <BellHeader title="피드" />
      <View style={styles.chips}>
        {filters.map(({ key, label }) => {
          const active = filter === key;
          return (
            <Pressable key={key} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => setFilter(key)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={styles.empty}>아직 올라온 기록이 없어요.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.white },
  chips: { flexDirection: 'row', gap: 17, paddingHorizontal: 16, paddingBottom: 16 },
  chip: { width: 61, height: 33, borderRadius: 50, borderWidth: 1, borderColor: palette.primary, alignItems: 'center', justifyContent: 'center' },
  chipActive: { backgroundColor: palette.primary },
  chipText: { fontWeight: '500', fontSize: 14, color: '#6C6C6C' },
  chipTextActive: { color: palette.white },
  list: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 2 },
  gap: { height: 16 },
  empty: { fontSize: 14, color: palette.textMuted, textAlign: 'center', marginTop: 60 },
});

import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import BellHeader from '@/components/common/BellHeader';
import PostCard from '@/components/common/PostCard';
import { palette } from '@/constants/theme';
import { useFeed } from '@/src/components/feed/useFeed';

const filters = [
  { key: 'all', label: '전체' },
  { key: 'group', label: '그룹' },
] as const;

export default function FeedScreen() {
  const [filter, setFilter] = useState<(typeof filters)[number]['key']>('all');
  const { posts, loading, error, hasNext, cheer, refresh, loadMore } = useFeed(filter);

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
        renderItem={({ item }) => <PostCard post={item} onCheer={cheer} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.gap} />}
        showsVerticalScrollIndicator={false}
        onEndReached={hasNext ? loadMore : undefined}
        onEndReachedThreshold={0.5}
        refreshing={loading && posts.length === 0}
        onRefresh={refresh}
        ListHeaderComponent={error ? <Text style={styles.error}>{error}</Text> : undefined}
        ListFooterComponent={loading && posts.length > 0 ? <ActivityIndicator color={palette.primary} style={styles.footer} /> : undefined}
        ListEmptyComponent={loading || error ? undefined : <Text style={styles.empty}>아직 올라온 기록이 없어요.</Text>}
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
  error: { fontSize: 14, color: palette.heart, textAlign: 'center', marginBottom: 12 },
  footer: { marginTop: 16 },
  empty: { fontSize: 14, color: palette.textMuted, textAlign: 'center', marginTop: 60 },
});

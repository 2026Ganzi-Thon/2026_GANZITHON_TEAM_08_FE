import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import type { ComponentProps } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';

import { palette } from '@/constants/theme';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
type IconName = keyof typeof Ionicons.glyphMap;

const tabs: { route: string; label: string; icon: IconName; activeIcon: IconName }[] = [
  { route: 'home', label: '홈', icon: 'home-outline', activeIcon: 'home' },
  { route: 'group', label: '그룹', icon: 'people-outline', activeIcon: 'people' },
  { route: 'write', label: '작성', icon: 'add', activeIcon: 'add' },
  { route: 'feed', label: '피드', icon: 'document-text-outline', activeIcon: 'document-text' },
  { route: 'mypage', label: '마이페이지', icon: 'person-outline', activeIcon: 'person' },
];

function TabBar({ state, navigateToTab, insets }: TabBarProps) {
  const current = state.routes[state.index]?.name;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {tabs.map(({ route, label, icon, activeIcon }) => {
        const focused = current === route;
        const target = state.routes.find((item) => item.name === route);
        const onPress = () => {
          if (route === 'write') {
            router.push('/write');
            return;
          }
          if (!target) {
            Alert.alert(label, '화면을 준비 중입니다.');
            return;
          }
          if (!focused) navigateToTab(target.key);
        };
        return (
          <Pressable key={route} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: focused }} onPress={onPress} style={styles.item}>
            <Ionicons name={focused ? activeIcon : icon} size={route === 'write' ? 30 : 24} color={focused ? palette.primary : palette.tabOff} />
          </Pressable>
        );
      })}
    </View>
  );
}

export default function MainLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="group" />
      <Tabs.Screen name="feed" />
      <Tabs.Screen name="mypage" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row', backgroundColor: palette.white, paddingTop: 18, paddingHorizontal: 12,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    shadowColor: '#000000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 12,
  },
  item: { flex: 1, height: 44, alignItems: 'center', justifyContent: 'center' },
});

import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}>
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="settings" options={{ title: '설정' }} />
    </Tabs>
  );
}


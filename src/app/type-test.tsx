import { palette } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

// The type test UI will be implemented separately.
export default function TypeTestScreen() {
  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
});

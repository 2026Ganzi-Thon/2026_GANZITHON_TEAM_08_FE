import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import Pill from './Pill';

type Props = {
  pillLabel: string;
  pillWidth: number;
  dateText: string;
  title: string;
  description: string;
  descriptionSize?: number;
  actionLabel?: string;
  onAction?: () => void;
};

export default function MissionCard({ pillLabel, pillWidth, dateText, title, description, descriptionSize = 12, actionLabel, onAction }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Pill label={pillLabel} width={pillWidth} />
        <Text style={styles.date}>{dateText}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bottom}>
        <Text style={[styles.description, { fontSize: descriptionSize, lineHeight: descriptionSize + 2 }]}>{description}</Text>
        {actionLabel ? <Pill label={actionLabel} width={93} onPress={onAction} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.tint, borderRadius: 10, minHeight: 141, paddingTop: 15, paddingBottom: 14, paddingHorizontal: 16 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  date: { fontSize: 12, color: palette.textMuted, marginRight: 0 },
  title: { fontWeight: '500', fontSize: 16, color: palette.text, marginTop: 18 },
  bottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 12, gap: 8 },
  description: { flexShrink: 1, color: palette.textBody },
});

import { Ionicons } from '@expo/vector-icons';

export default function Avatar({ size = 36 }: { size?: number }) {
  return <Ionicons name="person-circle" size={size} color="#666666" />;
}

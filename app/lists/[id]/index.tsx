import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ListPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text testID="list-id" style={{ fontSize: 22 }}>
        List id: {String(id)}
      </Text>
      <Link href={`/lists/${id}/item/42`} style={{ color: 'blue' }}>
        Open item 42
      </Link>
    </View>
  );
}

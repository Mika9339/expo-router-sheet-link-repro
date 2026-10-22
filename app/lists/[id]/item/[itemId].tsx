import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ItemSheet() {
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId: string }>();
  return (
    <View style={{ padding: 24, gap: 8 }}>
      <Text style={{ fontSize: 22 }}>Item {itemId}</Text>
      <Text>of list {id}</Text>
    </View>
  );
}

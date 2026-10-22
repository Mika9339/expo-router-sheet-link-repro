import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 22 }}>Home</Text>
      <Text>Open a link to a sheet while the app runs:</Text>
      <Text selectable style={{ fontFamily: 'monospace' }}>
        exporoutersheetlinkrepro://lists/7/item/42
      </Text>
      <Link href="/lists/7" style={{ color: 'blue' }}>
        In-app: open list 7
      </Link>
    </View>
  );
}

import { Stack } from 'expo-router';

// The list page is the anchor: a link to an item sheet should open it over its list.
export const unstable_settings = { anchor: 'index' };

export default function ListLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'List' }} />
      <Stack.Screen name="item/[itemId]" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.5], title: 'Item' }} />
    </Stack>
  );
}

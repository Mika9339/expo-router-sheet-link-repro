import { act } from '@testing-library/react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { renderRouter } from 'expo-router/testing-library';
import { Text } from 'react-native';

// The routes of ./app, plus a +native-intent that hands the test the listener for links
// that arrive while the app runs (what the OS calls when you tap a link).

let seenListIds: (string | undefined)[] = [];
let openLink: ((url: string) => void) | undefined;

function ListPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  seenListIds.push(id);
  return <Text>list {String(id)}</Text>;
}

const routes = {
  _layout: () => <Stack />,
  '+native-intent': {
    legacy_subscribe: (listener: (url: string) => void) => {
      openLink = listener;
      return () => {};
    },
  },
  index: () => <Text>home</Text>,
  'lists/[id]/_layout': {
    default: () => (
      <Stack>
        <Stack.Screen name="item/[itemId]" options={{ presentation: 'formSheet' }} />
      </Stack>
    ),
    unstable_settings: { anchor: 'index' },
  },
  'lists/[id]/index': ListPage,
  'lists/[id]/item/[itemId]': () => <Text>item</Text>,
};

beforeEach(() => {
  seenListIds = [];
  openLink = undefined;
});

describe('a link to a sheet route of a stack with an anchor', () => {
  it('cold start: opens the sheet over its anchor, which gets its params (works)', async () => {
    const app = await renderRouter(routes, { initialUrl: '/lists/7/item/42' });

    await act(async () => router.back());
    expect(app.getPathname()).toBe('/lists/7');
    expect(seenListIds).toContain('7');
  });

  it('app running: opens the sheet over its anchor, which gets its params (fails on SDK 58)', async () => {
    const app = await renderRouter(routes, { initialUrl: '/' });

    await act(async () => openLink?.('/lists/7/item/42'));
    expect(app.getPathname()).toBe('/lists/7/item/42');

    // Back from the sheet should land on list 7, not home.
    await act(async () => router.back());
    expect(app.getPathname()).toBe('/lists/7');
    expect(seenListIds).toContain('7');
  });
});

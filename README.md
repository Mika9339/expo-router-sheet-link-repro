# expo-router: a deep link to a sheet loses the screen beneath it

This is a minimal reproduction for [expo/expo#52041](https://github.com/expo/expo/issues/52041). It uses SDK 58 (`expo` 58.0.17, `expo-router` 58.0.25, `react-native` 0.88.0, `react-native-screens` 4.30.0) with the New Architecture.

## What the app contains

The app has a Home screen and a nested stack under `app/lists/[id]/`. In that stack, the list page `index` is the anchor (`unstable_settings = { anchor: 'index' }`), and `item/[itemId]` is presented as a `formSheet`. The list page shows the `id` it receives, so you can see whether it got its params. A link to `/lists/7/item/42` should therefore open item 42 as a sheet on top of list 7, and Back should lead to list 7.

## How to reproduce it

Build and start the app on Android:

```sh
npm install
npx expo run:android --variant release
```

The app opens on Home. While it is running, open the link:

```sh
adb shell am start -a android.intent.action.VIEW -d "exporoutersheetlinkrepro://lists/7/item/42" dev.repro.exporoutersheetlink
```

Make sure you start from Home. If list 7 is already open, the sheet opens over it correctly and the bug doesn't show.

Instead of a sheet over list 7, item 42 opens as a full-screen page with nothing beneath it, and Back takes you to Home (screens 1 and 2 below). If you force-stop the app and open the same link from a cold start, it works: the sheet opens over list 7, and Back shows "List id: 7" (screens 3 and 4).

![link while the app runs (1, 2) vs. cold start (3, 4)](shots/compare.png)

## How SDK 57 behaves

I built the same app on SDK 57 (`expo` 57.0.31, `expo-router` 57.0.29, `react-native` 0.86.3). There, a link that arrives while the app runs does open the sheet over the list page, but the page gets no params and shows "List id: undefined". So the missing anchor is new in SDK 58, while the missing params on the anchor are older.

![SDK 57: the list page is there, but without its params](shots/sdk57.png)

## The test

`npm test` runs `__tests__/sheetLink.test.tsx` with `expo-router/testing-library` on SDK 58. It sends the link through a `+native-intent` `legacy_subscribe` listener, which is the path the OS uses for a link while the app runs. The cold start case passes. The "app running" case fails because Back ends up on `/` instead of `/lists/7`.

## Why it happens, and a fix

In `build/fork/useLinking.native.js`, a link that arrives while the app runs is dispatched as a `NAVIGATE` without `withAnchor`, unlike the initial URL. That is why the nested stack is created without its anchor. Adding `withAnchor: true` brings the list page back, but without its params, because `createDestinationState` in `build/global-state/resolveNavigationDestination.js` creates the anchor route without the params of the layout it belongs to. On a cold start, a seeded state does give it those params.

[`fix/expo-router.patch`](fix/expo-router.patch) changes both places. To check that it makes the test pass, apply it and run the test again:

```sh
(cd node_modules/expo-router && patch -p3 < ../../fix/expo-router.patch)
npm test
```

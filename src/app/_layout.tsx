import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSansArabic_700Bold,
} from "@expo-google-fonts/ibm-plex-sans-arabic";
import { Amiri_400Regular, Amiri_700Bold } from "@expo-google-fonts/amiri";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "@/theme/tokens";
import { storage, StorageKeys } from "@/utils/storage";
import { scheduleReminders } from "@/utils/notifications";
import { DEFAULT_SETTINGS } from "@/store/store";
import { APP_LANGUAGE, applyLayoutDirection } from "@/i18n/direction";
import type { Settings } from "@/types";

// Layout direction is derived from the language (Arabic → RTL for now). It takes
// effect after the first restart, which is the usual RN behavior. To add English
// later: change the language here, then restart.
applyLayoutDirection(APP_LANGUAGE);

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    IBMPlexSansArabic_400Regular,
    IBMPlexSansArabic_500Medium,
    IBMPlexSansArabic_600SemiBold,
    IBMPlexSansArabic_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
  });

  useEffect(() => {
    if (!loaded) return;
    SplashScreen.hideAsync();
    // Reschedule reminders on launch to make sure they stay set.
    const s = storage.get<Settings>(StorageKeys.settings, DEFAULT_SETTINGS);
    if (s.remindersEnabled) {
      scheduleReminders(s.morningTime, s.eveningTime).catch(() => {});
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.green800 },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="session/[category]" />
        <Stack.Screen name="list/[category]" />
        <Stack.Screen
          name="awrad/new"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="awrad/[id]"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="settings/reminders" />
        <Stack.Screen name="challenges" />
        <Stack.Screen name="stats" />
      </Stack>
    </GestureHandlerRootView>
  );
}

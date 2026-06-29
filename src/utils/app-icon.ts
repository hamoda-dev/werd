import { Platform } from "react-native";
import { requireOptionalNativeModule } from "expo-modules-core";
import type { ThemeId } from "@/theme/types";

/**
 * Switch the home-screen launcher icon to match the active theme.
 *
 * Backed by `expo-dynamic-app-icon` (iOS uses the private no-alert API; Android swaps an
 * `activity-alias`, which the OS applies when the app next goes to the background). Every
 * theme is registered as an alternate icon in app.json, so we always set the icon by name.
 *
 * The native module only exists in a build that was rebuilt after adding the plugin.
 * We resolve it with `requireOptionalNativeModule`, which returns `null` (no throw, no
 * error log) when it's missing — so a stale dev client that hasn't been rebuilt, or web,
 * simply no-ops and the icon stays put until the next native build. (The library's own
 * entrypoint calls `requireNativeModule`, which throws, so we deliberately bypass it.)
 */
type AppIconModule = {
  getAppIcon: () => string;
  setAppIcon: (name: string) => string | false;
};

export function syncAppIcon(themeId: ThemeId): void {
  if (Platform.OS === "web") return;
  const native = requireOptionalNativeModule<AppIconModule>("ExpoDynamicAppIcon");
  if (!native) return; // not in this binary yet — rebuild the dev client to enable
  try {
    if (native.getAppIcon() !== themeId) native.setAppIcon(themeId);
  } catch {
    // Defensive: never let an icon swap take down the app.
  }
}

import { Platform } from "react-native";
import type { ThemeId } from "@/theme/types";

/**
 * Switch the home-screen launcher icon to match the active theme.
 *
 * Backed by `expo-dynamic-app-icon` (iOS uses the private no-alert API; Android swaps an
 * `activity-alias`, which the OS applies when the app next goes to the background). Every
 * theme is registered as an alternate icon in app.json, so we always set the icon by name.
 *
 * This is wrapped defensively: the native module only exists in a dev/release build that
 * was rebuilt after adding the plugin. In a stale dev client (not yet rebuilt) or on web,
 * the require/call throws — we swallow it so the app keeps running and the icon simply
 * doesn't change until the next native build.
 */
export function syncAppIcon(themeId: ThemeId): void {
  if (Platform.OS === "web") return;
  try {
    // Lazy require (not a static import) so a not-yet-rebuilt dev client doesn't crash
    // on module load — the native module only exists after a rebuild.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require("expo-dynamic-app-icon") as {
      getAppIcon?: () => string;
      setAppIcon?: (name: string) => string | false;
    };
    if (mod.getAppIcon?.() !== themeId) {
      mod.setAppIcon?.(themeId);
    }
  } catch {
    // Native module not present (stale dev client / web) — leave the icon unchanged.
  }
}

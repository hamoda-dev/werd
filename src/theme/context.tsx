import { createContext, useContext, type ReactNode } from "react";
import { useSettings } from "@/store/store";
import { resolveTheme, THEMES, DEFAULT_THEME_ID } from "@/theme/registry";
import type { Theme } from "@/theme/types";

const ThemeContext = createContext<Theme>(THEMES[DEFAULT_THEME_ID]);

/**
 * Provides the active theme to the whole tree. The selected theme id lives in the
 * persisted settings, so changing it (from the profile picker) re-renders every
 * consumer and the UI re-themes instantly.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const theme = resolveTheme(settings.themeId);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** The active theme: tokens (`colors`, `semantic`, `radii`, `shadows`, `gradients`) + `features`. */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

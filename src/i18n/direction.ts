import { I18nManager } from "react-native";

/**
 * Layout direction is derived from the language — not hard-coded.
 * When English is added later: pass "en" and the direction becomes LTR automatically,
 * and all text using textAlign:"auto" and rows using flexDirection:"row"
 * flip with the direction without any extra changes.
 */
export type AppLanguage = "ar"; // | "en" later

/** The currently active language (the app is fully Arabic for now). */
export const APP_LANGUAGE: AppLanguage = "ar";

const RTL_LANGUAGES = new Set<AppLanguage>(["ar"]);

export function isRTLLanguage(lang: AppLanguage): boolean {
  return RTL_LANGUAGES.has(lang);
}

/**
 * Sets the layout direction (RTL/LTR) according to the given language.
 * Returns true if the direction actually changed — in which case the app needs to restart
 * (the usual I18nManager behavior: the change takes effect after the next restart).
 */
export function applyLayoutDirection(lang: AppLanguage): boolean {
  const shouldBeRTL = isRTLLanguage(lang);
  I18nManager.allowRTL(shouldBeRTL);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.forceRTL(shouldBeRTL);
    return true;
  }
  return false;
}

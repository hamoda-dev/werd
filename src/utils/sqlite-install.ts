// iOS/Android: use the expo-sqlite polyfill to provide a local localStorage.
// (On web this file is automatically swapped for sqlite-install.web.ts, which does nothing,
//  because the browser already provides localStorage — so we avoid loading wa-sqlite.wasm.)
import "expo-sqlite/localStorage/install";

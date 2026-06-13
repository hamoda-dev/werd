// iOS/Android: نستخدم polyfill الخاص بـ expo-sqlite لتوفير localStorage محلياً.
// (على الويب يُستبدل هذا الملف تلقائياً بـ sqlite-install.web.ts الذي لا يفعل شيئاً،
//  لأن المتصفّح يوفّر localStorage أصلاً — فنتجنّب تحميل wa-sqlite.wasm.)
import "expo-sqlite/localStorage/install";

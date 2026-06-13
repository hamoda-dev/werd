/**
 * تخزين محلي مفتاح-قيمة عبر polyfill الخاص بـ expo-sqlite (نمط Expo 55 الموصى به).
 * كل البيانات تُحفظ على الجهاز فقط — لا اتصال بالشبكة إطلاقاً.
 *
 * نحتفظ بـ cache للقيم المُفكَّكة (parsed) كي يُعيد get() نفس المرجع ما لم تتغيّر
 * القيمة الخام — وهذا شرط أساسي لعمل useSyncExternalStore بلا حلقات لا نهائية.
 */
import "./sqlite-install";

type Listener = () => void;
const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, { raw: string | null; value: unknown }>();

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    const raw = localStorage.getItem(key);
    const cached = cache.get(key);
    if (cached && cached.raw === raw) {
      return (cached.value === undefined ? defaultValue : cached.value) as T;
    }
    let value: unknown;
    if (raw == null) {
      value = undefined;
    } else {
      try {
        value = JSON.parse(raw);
      } catch {
        value = undefined;
      }
    }
    cache.set(key, { raw, value });
    return (value === undefined ? defaultValue : value) as T;
  },

  set<T>(key: string, value: T): void {
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
    cache.set(key, { raw, value });
    listeners.get(key)?.forEach((fn) => fn());
  },

  subscribe(key: string, listener: Listener): () => void {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key)!.add(listener);
    return () => {
      listeners.get(key)?.delete(listener);
    };
  },
};

/** مفاتيح التخزين الموحّدة. */
export const StorageKeys = {
  settings: "werd.settings",
  progress: "werd.progress",
  streak: "werd.streak",
  score: "werd.score",
  customAwrad: "werd.customAwrad",
  partialCounts: "werd.partialCounts",
} as const;

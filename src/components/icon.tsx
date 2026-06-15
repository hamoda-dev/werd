import { I18nManager, Text } from "react-native";
import { SymbolView, type SFSymbol } from "expo-symbols";

/** Unicode fallbacks for non-iOS (the app is optimized for iOS but stays readable elsewhere). */
const FALLBACK: Record<string, string> = {
  "chevron.backward": "›", // RTL: back points to the right
  "chevron.forward": "‹",
  "chevron.left": "‹",
  "chevron.right": "›",
  plus: "+",
  checkmark: "✓",
  "lock.fill": "🔒",
  "gearshape.fill": "⚙",
  "sun.max.fill": "☀",
  "moon.fill": "☾",
  "flame.fill": "🔥",
  trash: "🗑",
  pencil: "✎",
  "bell.fill": "🔔",
  ellipsis: "⋯",
  xmark: "✕",
  "arrow.counterclockwise": "↺",
  "star.fill": "★", // still used by challenges/badges; tab glyphs moved to tab-icon.tsx
  "checkmark.seal.fill": "✓",
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color }: Props) {
  // RTL fix: a header "back" chevron must point toward the start edge — which is the
  // RIGHT in RTL. SymbolView doesn't mirror `chevron.backward`, and the angle-bracket
  // fallback gets bidi-mirrored to the wrong side, so handle this one icon explicitly.
  const rtlBack = I18nManager.isRTL && name === "chevron.backward";

  if (process.env.EXPO_OS === "ios") {
    return (
      <SymbolView
        name={(rtlBack ? "chevron.right" : name) as SFSymbol}
        tintColor={color}
        size={size}
        resizeMode="scaleAspectFit"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <Text style={{ fontSize: size * 0.9, color, lineHeight: size + 2 }}>
      {/* Under RTL the bidi engine mirrors angle brackets, so "‹" renders as a
          right-pointing chevron — the correct direction for a back button. */}
      {rtlBack ? "‹" : (FALLBACK[name] ?? "•")}
    </Text>
  );
}

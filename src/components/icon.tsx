import { Text } from "react-native";
import { SymbolView, type SFSymbol } from "expo-symbols";

/** بدائل Unicode لغير iOS (التطبيق محسّن لـ iOS لكن يبقى مقروءاً على غيره). */
const FALLBACK: Record<string, string> = {
  "chevron.backward": "›", // RTL: الرجوع يشير لليمين
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
  "house.fill": "⌂",
  "circle.fill": "●",
  "star.fill": "★",
  "person.fill": "☻",
  "checkmark.seal.fill": "✓",
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color }: Props) {
  if (process.env.EXPO_OS === "ios") {
    return (
      <SymbolView
        name={name as SFSymbol}
        tintColor={color}
        size={size}
        resizeMode="scaleAspectFit"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <Text style={{ fontSize: size * 0.9, color, lineHeight: size + 2 }}>
      {FALLBACK[name] ?? "•"}
    </Text>
  );
}

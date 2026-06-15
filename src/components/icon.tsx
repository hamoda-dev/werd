import type { ReactNode } from "react";
import { I18nManager } from "react-native";
import Svg, { Circle, G, Path } from "react-native-svg";
import { semantic } from "@/theme/tokens";

/**
 * The single icon primitive. Every glyph is hand-drawn SVG in the same "Rounded" style
 * as the tab icons (2px rounded strokes on a 24×24 grid) — one cohesive, geometric set,
 * pixel-identical on iOS and Android. No SF Symbols, no Unicode/emoji fallbacks, no
 * third-party icon set (see DESIGN.md §7). Tabs use the richer two-state TabIcon.
 */

const GLYPHS: Record<string, ReactNode> = {
  // Directional — call sites use the semantic .backward/.forward; the component maps
  // them to .left/.right per layout direction (so RTL "back" points right).
  "chevron.left": <Path d="M15 5 L8 12 L15 19" />,
  "chevron.right": <Path d="M9 5 L16 12 L9 19" />,

  plus: <Path d="M12 5 V19 M5 12 H19" />,
  checkmark: <Path d="M5 12.5 L10 17.5 L19 6.5" />,
  xmark: <Path d="M6.5 6.5 L17.5 17.5 M17.5 6.5 L6.5 17.5" />,
  ellipsis: <Path d="M6 12 H6.01 M12 12 H12.01 M18 12 H18.01" />,

  "lock.fill": (
    <>
      <Path d="M8 10 V8 a4 4 0 0 1 8 0 V10" />
      <Path d="M6.5 10 H17.5 a1.5 1.5 0 0 1 1.5 1.5 V18 a1.5 1.5 0 0 1 -1.5 1.5 H6.5 a1.5 1.5 0 0 1 -1.5 -1.5 V11.5 a1.5 1.5 0 0 1 1.5 -1.5 Z" />
      <Path d="M12 14.3 V16.2" />
    </>
  ),

  "gearshape.fill": (
    <>
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      <Circle cx={12} cy={12} r={3} />
    </>
  ),

  "sun.max.fill": (
    <>
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22 M4.9 4.9 L6.3 6.3 M17.7 17.7 L19.1 19.1 M19.1 4.9 L17.7 6.3 M6.3 17.7 L4.9 19.1" />
    </>
  ),

  "moon.fill": <Path d="M20.5 14.5 A8.5 8.5 0 1 1 9.5 3.5 A6.5 6.5 0 0 0 20.5 14.5 Z" />,

  "bell.fill": (
    <>
      <Path d="M18 16 H6 C7.2 14.8 8 13 8 11 a4 4 0 0 1 8 0 C16 13 16.8 14.8 18 16 Z" />
      <Path d="M10.3 19 a1.7 1.7 0 0 0 3.4 0" />
    </>
  ),

  pencil: <Path d="M16.5 4.5 a2.12 2.12 0 0 1 3 3 L7 20 L3 21 L4 17 Z" />,

  trash: (
    <>
      <Path d="M5 7 H19" />
      <Path d="M9.5 7 V5.6 a1.1 1.1 0 0 1 1.1 -1.1 H13.4 a1.1 1.1 0 0 1 1.1 1.1 V7" />
      <Path d="M6.6 7 L7.4 19 a1.6 1.6 0 0 0 1.6 1.5 H15 a1.6 1.6 0 0 0 1.6 -1.5 L18 7" />
      <Path d="M10 10.5 V17 M14 10.5 V17" />
    </>
  ),

  "flame.fill": (
    <>
      <Path d="M12 2.5 C12 2.5 6 7.5 6 13 a6 6 0 0 0 12 0 C18 8.5 12 2.5 12 2.5 Z" />
      <Path d="M12 21 a3.2 3.2 0 0 1 -3.2 -3.2 c0 -2.4 3.2 -4.2 3.2 -4.2 s3.2 1.8 3.2 4.2 A3.2 3.2 0 0 1 12 21 Z" />
    </>
  ),

  "star.fill": (
    <Path d="M12 3 L14.6 8.7 L20.8 9.5 L16.2 13.8 L17.4 20 L12 16.9 L6.6 20 L7.8 13.8 L3.2 9.5 L9.4 8.7 Z" />
  ),

  "checkmark.seal.fill": (
    <>
      <Path d="M3.85 8.62a4 4 0 0 1 4.78 -4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1 -4.77 4.78 4 4 0 0 1 -6.75 0 4 4 0 0 1 -4.78 -4.77 4 4 0 0 1 0 -6.76 Z" />
      <Path d="M9 12 L11 14 L15 10" />
    </>
  ),

  "arrow.counterclockwise": (
    <>
      <Path d="M3 5 V10 H8" />
      <Path d="M5.2 14.6 a8 8 0 1 0 1.8 -8.4 L3 10" />
    </>
  ),
};

interface Props {
  name: string;
  size?: number;
  color?: string;
}

export function Icon({ name, size = 22, color = semantic.textPrimary }: Props) {
  // Resolve directional chevrons for the layout direction (RTL back → right).
  let key = name;
  if (name === "chevron.backward") key = I18nManager.isRTL ? "chevron.right" : "chevron.left";
  else if (name === "chevron.forward") key = I18nManager.isRTL ? "chevron.left" : "chevron.right";

  const glyph = GLYPHS[key];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {glyph ?? <Circle cx={12} cy={12} r={1.6} fill={color} stroke="none" />}
      </G>
    </Svg>
  );
}

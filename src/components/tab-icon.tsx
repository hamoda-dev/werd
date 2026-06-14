import { Svg, Path, Circle, Ellipse, Line, Rect, G } from "react-native-svg";

/**
 * Hand-drawn SVG glyphs for the four tabs — pixel-identical on iOS and Android.
 * Style "Rounded" (approved direction): 2px rounded strokes when inactive,
 * solid fill when active. Color is supplied by the caller (gold active / muted
 * inactive); this primitive only owns geometry + the outline↔fill state.
 *
 * Drawn on a 24×24 grid. Kept in-repo on purpose — the design system forbids
 * third-party icon sets (see DESIGN.md §7).
 */

const SW = 2; // stroke weight for the inactive (outline) state

/** Tab route name → glyph. */
const GLYPH: Record<string, "home" | "tasbih" | "trophy" | "person"> = {
  index: "home",
  tasbih: "tasbih",
  achievements: "trophy",
  profile: "person",
};

interface Props {
  /** The route name (e.g. "index", "tasbih"). */
  name: string;
  /** Focused tab → filled + gold; otherwise outline + muted. */
  active: boolean;
  /** Stroke/fill color, decided by the tab bar. */
  color: string;
  size?: number;
}

export function TabIcon({ name, active, color, size = 24 }: Props) {
  const glyph = GLYPH[name] ?? "home";
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {glyph === "home" && <Home active={active} color={color} />}
      {glyph === "tasbih" && <Tasbih active={active} color={color} />}
      {glyph === "trophy" && <Trophy active={active} color={color} />}
      {glyph === "person" && <Person active={active} color={color} />}
    </Svg>
  );
}

type Part = { active: boolean; color: string };

function Home({ active, color }: Part) {
  if (active) {
    return (
      <Path
        fill={color}
        d="M11.27 3.4 L4.05 9.78 C3.55 10.22 3.3 10.78 3.3 11.4 V18.7 C3.3 20 4.2 20.7 5.3 20.7 H9 V15.2 C9 14.3 9.6 13.9 10.4 13.9 H13.6 C14.4 13.9 15 14.3 15 15.2 V20.7 H18.7 C19.8 20.7 20.7 20 20.7 18.7 V11.4 C20.7 10.78 20.45 10.22 19.95 9.78 L12.73 3.4 C12.3 3 11.7 3 11.27 3.4 Z"
      />
    );
  }
  return (
    <G fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3.5 11.3 L12 4 L20.5 11.3" />
      <Path d="M5.6 9.7 V19.3 C5.6 20 6 20.3 6.7 20.3 H17.3 C18 20.3 18.4 20 18.4 19.3 V9.7" />
      <Path d="M9.8 20.3 V14.9 C9.8 14.2 10.2 13.9 10.9 13.9 H13.1 C13.8 13.9 14.2 14.2 14.2 14.9 V20.3" />
    </G>
  );
}

function Person({ active, color }: Part) {
  if (active) {
    return (
      <G fill={color}>
        <Circle cx={12} cy={7.8} r={3.9} />
        <Path d="M5 20.4 V19.4 C5 16 8.1 13.6 12 13.6 C15.9 13.6 19 16 19 19.4 V20.4 Z" />
      </G>
    );
  }
  return (
    <G fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={3.7} />
      <Path d="M5.5 19.8 C5.5 16.4 8.4 14.2 12 14.2 C15.6 14.2 18.5 16.4 18.5 19.8" />
    </G>
  );
}

function Trophy({ active, color }: Part) {
  if (active) {
    return (
      <G fill={color}>
        <Path d="M6.8 3.8 H17.2 V7.6 A5.2 5.2 0 0 1 6.8 7.6 Z" />
        <Path d="M6.9 5.2 H4.9 A2.4 2.4 0 0 0 7.5 9.5 Q6.9 8 6.9 6.6 Z" />
        <Path d="M17.1 5.2 H19.1 A2.4 2.4 0 0 1 16.5 9.5 Q17.1 8 17.1 6.6 Z" />
        <Rect x={11} y={11.3} width={2} height={4.3} rx={0.7} />
        <Path d="M9 20.2 L10.2 15.8 H13.8 L15 20.2 Z" />
      </G>
    );
  }
  return (
    <G fill="none" stroke={color} strokeWidth={SW} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M7 4.2 H17 V7.6 A5 5 0 0 1 7 7.6 Z" />
      <Path d="M7 5.4 H5 A2.3 2.3 0 0 0 7.3 9.4" />
      <Path d="M17 5.4 H19 A2.3 2.3 0 0 1 16.7 9.4" />
      <Path d="M12 12.4 V15.6" />
      <Path d="M9.3 20 L10.3 16 H13.7 L14.7 20 Z" />
    </G>
  );
}

/** Misbaha — a closed loop of beads with an imame (leader bead) and tassel. */
function Tasbih({ active, color }: Part) {
  const cx = 12;
  const cy = 8.9;
  const r = 5;
  const n = 8;
  const beadR = active ? 1.75 : 1.5;

  const beads = Array.from({ length: n }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return <Circle key={i} cx={cx + r * Math.cos(a)} cy={cy + r * Math.sin(a)} r={beadR} fill={color} />;
  });

  const imameCy = cy + r + 2.3; // 16.2
  const fy = imameCy + 2; // tassel origin, 18.2
  return (
    <G>
      {beads}
      <Ellipse cx={12} cy={imameCy} rx={1.55} ry={2} fill={color} />
      <G stroke={color} strokeWidth={1.7} strokeLinecap="round">
        <Line x1={12} y1={fy - 0.3} x2={10.8} y2={fy + 2} />
        <Line x1={12} y1={fy - 0.3} x2={12} y2={fy + 2.3} />
        <Line x1={12} y1={fy - 0.3} x2={13.2} y2={fy + 2} />
      </G>
    </G>
  );
}

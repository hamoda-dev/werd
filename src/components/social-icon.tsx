import Svg, { Circle, G, Path } from "react-native-svg";

/**
 * Recognizable platform/brand marks for the About page's creator links — a deliberate,
 * scoped exception to the stroke-only icon set (DESIGN.md §7). Still hand-drawn in-repo
 * (filled paths on a 24×24 grid), never an imported icon package. Rendered monochrome in
 * the passed `color` so they sit calmly in the theme. The website uses a stroke globe.
 */
export type SocialName = "website" | "linkedin" | "github" | "x";

const LINKEDIN =
  "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.27V1.73C24 .77 23.2 0 22.22 0z";

const GITHUB =
  "M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.23 0 4.63-2.81 5.65-5.49 5.95.43.37.82 1.1.82 2.22 0 1.61-.02 2.9-.02 3.29 0 .32.22.7.83.58A12 12 0 0 0 24 12.5C24 5.87 18.63.5 12 .5z";

const X_MARK =
  "M18.24 2.25h3.31l-7.23 8.26L23.1 21.75h-6.66l-5.22-6.82-5.97 6.82H1.93l7.73-8.84L.92 2.25h6.83l4.71 6.23 5.78-6.23zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64z";

export function SocialIcon({
  name,
  size = 22,
  color,
}: {
  name: SocialName;
  size?: number;
  color: string;
}) {
  if (name === "website") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <G fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx={12} cy={12} r={9} />
          <Path d="M3 12 H21" />
          <Path d="M12 3 C8.4 6.6 8.4 17.4 12 21 C15.6 17.4 15.6 6.6 12 3 Z" />
        </G>
      </Svg>
    );
  }
  const d = name === "linkedin" ? LINKEDIN : name === "github" ? GITHUB : X_MARK;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={d} fill={color} />
    </Svg>
  );
}

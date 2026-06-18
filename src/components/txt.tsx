import { Text, type TextProps, type TextStyle } from "react-native";
import { fonts, text as textScale } from "@/theme/tokens";
import { useTheme } from "@/theme/context";

type Weight = "regular" | "medium" | "semibold" | "bold";
type Variant = keyof typeof textScale;

const SANS: Record<Weight, string> = {
  regular: fonts.sans,
  medium: fonts.sansMedium,
  semibold: fonts.sansSemiBold,
  bold: fonts.sansBold,
};

interface Props extends TextProps {
  /** Type-scale preset (size + weight + lineHeight). Explicit size/weight still override. */
  variant?: Variant;
  weight?: Weight;
  /** Use the Amiri font (for adhkar/Quran). */
  naskh?: boolean;
  size?: number;
  color?: string;
  align?: TextStyle["textAlign"];
}

/** Unified text: proper Arabic font + alignment that follows layout direction + light default color (dark theme). */
export function Txt({
  variant,
  weight,
  naskh = false,
  size,
  color,
  align = "auto",
  style,
  ...rest
}: Props) {
  const { semantic } = useTheme();
  const resolvedColor = color ?? semantic.textPrimary;
  const preset = variant ? textScale[variant] : undefined;
  const resolvedWeight: Weight = weight ?? preset?.weight ?? "regular";
  const resolvedSize = size ?? preset?.size ?? 15;

  const fontFamily = naskh
    ? resolvedWeight === "bold"
      ? fonts.naskhBold
      : fonts.naskh
    : SANS[resolvedWeight];

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily,
          fontSize: resolvedSize,
          color: resolvedColor,
          textAlign: align,
          ...(preset ? { lineHeight: preset.lineHeight } : null),
        },
        style,
      ]}
    />
  );
}

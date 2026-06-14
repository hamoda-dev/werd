import { Text, type TextProps, type TextStyle } from "react-native";
import { colors, fonts } from "@/theme/tokens";

type Weight = "regular" | "medium" | "semibold" | "bold";

const SANS: Record<Weight, string> = {
  regular: fonts.sans,
  medium: fonts.sansMedium,
  semibold: fonts.sansSemiBold,
  bold: fonts.sansBold,
};

interface Props extends TextProps {
  weight?: Weight;
  /** Use the Amiri font (for adhkar/Quran). */
  naskh?: boolean;
  size?: number;
  color?: string;
  align?: TextStyle["textAlign"];
}

/** Unified text: proper Arabic font + alignment that follows layout direction + light default color (dark theme). */
export function Txt({
  weight = "regular",
  naskh = false,
  size = 15,
  color = colors.creamText,
  align = "auto",
  style,
  ...rest
}: Props) {
  const fontFamily = naskh
    ? weight === "bold"
      ? fonts.naskhBold
      : fonts.naskh
    : SANS[weight];

  return (
    <Text
      {...rest}
      style={[
        {
          fontFamily,
          fontSize: size,
          color,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}

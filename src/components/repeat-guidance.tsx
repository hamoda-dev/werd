import { View } from "react-native";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { toArabicNumerals } from "@/utils/numerals";

/** Human Arabic label for a repetition target (null/≤0 → free tasbih). */
export function repeatLabel(count: number | null): string {
  if (count == null || count <= 0) return "سبّح ما شئت";
  if (count === 1) return "مرّة واحدة";
  if (count === 2) return "مرّتان";
  if (count <= 10) return `${toArabicNumerals(count)} مرّات`;
  return `${toArabicNumerals(count)} مرّة`;
}

/**
 * Non-interactive repetition guidance for the "count on the fingers" mode: shows
 * the target as text (and a small bead row for small targets) plus a Sunnah reminder
 * to count on the fingers. It never counts for the user.
 */
export function RepeatGuidance({ count }: { count: number | null }) {
  const { semantic } = useTheme();
  const free = count == null || count <= 0;
  const showBeads = !free && count >= 2 && count <= 7;

  return (
    <View style={{ alignItems: "center", gap: spacing.sm }}>
      {showBeads ? (
        <View style={{ flexDirection: "row", gap: spacing.xs }}>
          {Array.from({ length: count as number }).map((_, i) => (
            <View
              key={i}
              style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: semantic.accent }}
            />
          ))}
        </View>
      ) : null}
      <Txt size={15} weight="bold" color={semantic.accentLight} align="center">
        {repeatLabel(count)}
      </Txt>
      <Txt size={12} color={semantic.textSecondary} align="center">
        {free ? "على أصابع يدك اليمنى" : "اعقِدها على أصابع يدك اليمنى"}
      </Txt>
    </View>
  );
}

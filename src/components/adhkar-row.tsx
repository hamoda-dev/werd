import { I18nManager, Pressable, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
// Gesture-handler's Pressable coordinates with the swipe pan gesture; a plain RN
// Pressable inside the revealed action panel never receives the tap.
import { Pressable as GHPressable } from "react-native-gesture-handler";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { toArabicNumerals } from "@/utils/numerals";
import { isFree } from "@/data/adhkari";
import type { AdhkariItem } from "@/types";

interface Props {
  item: AdhkariItem;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Gold repetition chip — rendered only for items that have a target. */
function CountChip({ count }: { count: number }) {
  const { semantic, radii } = useTheme();
  return (
    <View
      style={{
        backgroundColor: semantic.goldHairline,
        borderRadius: radii.pill,
        borderCurve: "continuous",
        paddingHorizontal: 11,
        paddingVertical: 3,
        minWidth: 34,
        alignItems: "center",
      }}
    >
      <Txt size={13} weight="semibold" color={semantic.accentLight}>
        {toArabicNumerals(count)}
      </Txt>
    </View>
  );
}

function RowBody({ item }: { item: AdhkariItem }) {
  const { semantic, radii } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing.sm,
        backgroundColor: semantic.surface,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
      }}
    >
      {/* Built-in and user items render identically: the dhikr text in Amiri/naskh. */}
      <Txt naskh size={18} weight="semibold" color={semantic.textPrimary} numberOfLines={1} style={{ flex: 1 }}>
        {item.text}
      </Txt>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        {isFree(item.count) ? null : <CountChip count={item.count as number} />}
        {/* Chevron only on the user's own (swipeable) items — built-ins have no row action. */}
        {item.locked ? null : <Icon name="chevron.forward" size={18} color={semantic.textTertiary} />}
      </View>
    </View>
  );
}

function ActionButton({
  gradient,
  fallback,
  labelColor,
  icon,
  label,
  onPress,
}: {
  gradient: string;
  fallback: string;
  labelColor: string;
  icon: string;
  label: string;
  onPress: () => void;
}) {
  const { radii } = useTheme();
  return (
    <GHPressable
      onPress={onPress}
      style={{
        width: 72,
        marginLeft: spacing.sm,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        backgroundColor: fallback,
        experimental_backgroundImage: gradient,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Icon name={icon} size={20} color={labelColor} />
      <Txt size={12} weight="bold" color={labelColor}>{label}</Txt>
    </GHPressable>
  );
}

/**
 * A row in the أذكاري list. Locked (built-in) items are a plain pressable; the user's
 * own items are wrapped in a swipeable that reveals تعديل / حذف.
 */
export function AdhkarRow({ item, onPress, onEdit, onDelete }: Props) {
  const { gradients, semantic } = useTheme();
  if (item.locked) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress}>
        <RowBody item={item} />
      </Pressable>
    );
  }

  const actions = (methods: { close: () => void }) => (
    <View style={{ flexDirection: "row", alignItems: "stretch" }}>
      <ActionButton
        gradient={gradients.gold}
        fallback={semantic.accent}
        labelColor={semantic.textOnCream}
        icon="pencil"
        label="تعديل"
        onPress={() => {
          methods.close();
          onEdit?.();
        }}
      />
      <ActionButton
        gradient={gradients.terracotta}
        fallback={semantic.warm}
        labelColor={semantic.textOnColor}
        icon="trash"
        label="حذف"
        onPress={() => {
          methods.close();
          onDelete?.();
        }}
      />
    </View>
  );

  const child = (
    <Pressable accessibilityRole="button" onPress={onPress}>
      <RowBody item={item} />
    </Pressable>
  );

  // gesture-handler mirrors the action panel for RTL but does NOT flip the swipe
  // trigger, so reveal on the leading edge explicitly: left actions under RTL.
  return I18nManager.isRTL ? (
    <ReanimatedSwipeable friction={2} leftThreshold={36} renderLeftActions={(_p, _t, m) => actions(m)}>
      {child}
    </ReanimatedSwipeable>
  ) : (
    <ReanimatedSwipeable friction={2} rightThreshold={36} renderRightActions={(_p, _t, m) => actions(m)}>
      {child}
    </ReanimatedSwipeable>
  );
}

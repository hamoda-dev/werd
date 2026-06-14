import { I18nManager, Pressable, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { gradients, radii, semantic, spacing } from "@/theme/tokens";
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
        padding: spacing.lg,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        {item.title ? (
          <>
            <Txt size={16} weight="semibold" color={semantic.textPrimary} numberOfLines={1}>
              {item.title}
            </Txt>
            <Txt naskh size={13} color={semantic.textTertiary} numberOfLines={1}>
              {item.text}
            </Txt>
          </>
        ) : (
          <Txt naskh size={18} weight="semibold" color={semantic.textPrimary} numberOfLines={1}>
            {item.text}
          </Txt>
        )}
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        {isFree(item.count) ? null : <CountChip count={item.count as number} />}
        <Icon name="chevron.forward" size={18} color={semantic.textTertiary} />
      </View>
    </View>
  );
}

function ActionButton({
  gradient,
  fallback,
  labelColor,
  label,
  onPress,
}: {
  gradient: string;
  fallback: string;
  labelColor: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
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
      }}
    >
      <Txt size={14} weight="bold" color={labelColor}>{label}</Txt>
    </Pressable>
  );
}

/**
 * A row in the أذكاري list. Locked (built-in) items are a plain pressable; the user's
 * own items are wrapped in a swipeable that reveals تعديل / حذف.
 */
export function AdhkarRow({ item, onPress, onEdit, onDelete }: Props) {
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

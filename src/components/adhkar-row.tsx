import { Pressable, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { radii, semantic, spacing } from "@/theme/tokens";
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

function CountChip({ count }: { count: number | null }) {
  const free = isFree(count);
  return (
    <View
      style={{
        backgroundColor: free ? semantic.surfaceStrong : semantic.goldHairline,
        borderRadius: radii.pill,
        borderCurve: "continuous",
        paddingHorizontal: 11,
        paddingVertical: 3,
        minWidth: 34,
        alignItems: "center",
      }}
    >
      <Txt size={13} weight="semibold" color={free ? semantic.textSecondary : semantic.accentLight}>
        {free ? "حر" : toArabicNumerals(count as number)}
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
        <CountChip count={item.count} />
        {item.locked ? (
          <Icon name="lock.fill" size={14} color={semantic.textTertiary} />
        ) : (
          <Icon name="chevron.forward" size={18} color={semantic.textTertiary} />
        )}
      </View>
    </View>
  );
}

function ActionButton({
  bg,
  icon,
  label,
  onPress,
}: {
  bg: string;
  icon: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 64,
        marginLeft: spacing.sm,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
      }}
    >
      <Icon name={icon} size={18} color={semantic.textOnColor} />
      <Txt size={11} weight="semibold" color={semantic.textOnColor}>{label}</Txt>
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

  return (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={36}
      renderRightActions={(_progress, _translation, methods) => (
        <View style={{ flexDirection: "row", alignItems: "stretch" }}>
          <ActionButton
            bg={semantic.accentDeep}
            icon="pencil"
            label="تعديل"
            onPress={() => {
              methods.close();
              onEdit?.();
            }}
          />
          <ActionButton
            bg={semantic.warmDeep}
            icon="trash"
            label="حذف"
            onPress={() => {
              methods.close();
              onDelete?.();
            }}
          />
        </View>
      )}
    >
      <Pressable accessibilityRole="button" onPress={onPress}>
        <RowBody item={item} />
      </Pressable>
    </ReanimatedSwipeable>
  );
}

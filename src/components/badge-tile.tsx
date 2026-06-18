import { View } from "react-native";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import type { BadgeDef } from "@/types";

/** Badge tile — unlocked (gradient) or locked (gray + lock). */
export function BadgeTile({ def, unlocked }: { def: BadgeDef; unlocked: boolean }) {
  // `colors` retained for the `lockedTile` cell token (no semantic alias by design).
  const { colors, gradients, radii, semantic } = useTheme();
  return (
    <View
      style={{
        width: "31%",
        aspectRatio: 1,
        borderRadius: radii.tile,
        borderCurve: "continuous",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        padding: 8,
        backgroundColor: unlocked ? semantic.accentDeep : colors.lockedTile,
        experimental_backgroundImage: unlocked ? gradients[def.gradient] : undefined,
      }}
    >
      <Icon name={unlocked ? def.icon : "lock.fill"} size={26} color={unlocked ? semantic.textOnColor : semantic.textTertiary} />
      <Txt
        size={11}
        weight="semibold"
        align="center"
        color={unlocked ? semantic.textOnColor : semantic.textMutedCream}
        numberOfLines={2}
      >
        {def.label}
      </Txt>
    </View>
  );
}

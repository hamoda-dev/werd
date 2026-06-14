import { View } from "react-native";
import { badgeGradientCss, colors, radii } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import type { BadgeDef } from "@/types";

/** Badge tile — unlocked (gradient) or locked (gray + lock). */
export function BadgeTile({ def, unlocked }: { def: BadgeDef; unlocked: boolean }) {
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
        backgroundColor: unlocked ? colors.gold700 : colors.lockedTile,
        experimental_backgroundImage: unlocked ? badgeGradientCss[def.gradient] : undefined,
      }}
    >
      <Icon name={unlocked ? def.icon : "lock.fill"} size={26} color={unlocked ? "#fff" : colors.muted2} />
      <Txt
        size={11}
        weight="semibold"
        align="center"
        color={unlocked ? "#fff" : colors.muted1}
        numberOfLines={2}
      >
        {def.label}
      </Txt>
    </View>
  );
}

import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { colors, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";

const TABS: Record<string, { label: string; icon: string }> = {
  index: { label: "الرئيسية", icon: "house.fill" },
  tasbih: { label: "التسبيح", icon: "circle.fill" },
  achievements: { label: "إنجازاتي", icon: "star.fill" },
  profile: { label: "ملفي", icon: "person.fill" },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "rgba(14,45,34,0.96)",
        borderTopWidth: 1,
        borderTopColor: colors.whiteAlpha08,
        paddingTop: spacing.sm,
        paddingBottom: Math.max(insets.bottom, spacing.sm),
        paddingHorizontal: spacing.sm,
      }}
    >
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const meta = TABS[route.name];
        if (!meta) return null;

        function onPress() {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        }

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center", gap: 4, paddingVertical: 4 }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: focused ? colors.gold500 : "transparent",
              }}
            />
            <Icon
              name={meta.icon}
              size={22}
              color={focused ? colors.gold300 : colors.muted2}
            />
            <Txt
              size={11}
              weight={focused ? "semibold" : "regular"}
              color={focused ? colors.creamText : colors.muted2}
              align="center"
            >
              {meta.label}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

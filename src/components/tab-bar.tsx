import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { TabIcon } from "@/components/tab-icon";

const TABS: Record<string, { label: string }> = {
  index: { label: "الرئيسية" },
  tasbih: { label: "أذكاري" },
  achievements: { label: "إنجازاتي" },
  profile: { label: "ملفي" },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: semantic.tabBar,
        borderTopWidth: 1,
        borderTopColor: semantic.surfaceStrong,
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
            style={{ flex: 1, alignItems: "center", gap: 5, paddingVertical: 6 }}
          >
            <TabIcon
              name={route.name}
              active={focused}
              size={24}
              color={focused ? semantic.accentLight : semantic.textTertiary}
            />
            <Txt
              size={11}
              weight={focused ? "semibold" : "regular"}
              color={focused ? semantic.textPrimary : semantic.textTertiary}
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

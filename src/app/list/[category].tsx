import { Pressable, ScrollView, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { toArabicNumerals } from "@/utils/numerals";
import { getCategory } from "@/data/adhkar";
import { useTodayProgress } from "@/store/store";

export default function ListScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const today = useTodayProgress();

  const cat = category ? getCategory(category) : undefined;

  if (!cat) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Txt size={18} weight="semibold">لم يُعثر على التصنيف</Txt>
      </View>
    );
  }

  const doneCount = cat.adhkar.filter((d) => today.completedIds.includes(d.id)).length;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.green800,
        experimental_backgroundImage: "linear-gradient(180deg, #16352a 0%, #0e2d22 100%)",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingBottom: insets.bottom + 96,
          paddingHorizontal: spacing.xl,
          gap: spacing.md,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* الترويسة */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: spacing.sm,
          }}
        >
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center" }}>
            <Icon name="chevron.backward" size={24} color={colors.creamText} />
          </Pressable>
          <View style={{ alignItems: "center" }}>
            <Txt size={18} weight="bold" align="center">{cat.title}</Txt>
            <Txt size={12} color={colors.muted3} align="center">
              أكملت {toArabicNumerals(doneCount)} من {toArabicNumerals(cat.adhkar.length)} ذِكراً
            </Txt>
          </View>
          <View style={{ width: 38, height: 38 }} />
        </View>

        {cat.adhkar.map((d, i) => {
          const done = today.completedIds.includes(d.id);
          return (
            <View
              key={d.id}
              style={{
                flexDirection: "row",
                gap: spacing.md,
                alignItems: "flex-start",
                backgroundColor: colors.whiteAlpha06,
                borderRadius: radii.tile,
                borderCurve: "continuous",
                padding: spacing.lg,
                opacity: done ? 0.7 : 1,
              }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: done ? colors.sage : "transparent",
                  borderWidth: done ? 0 : 1.5,
                  borderColor: colors.muted3,
                }}
              >
                {done ? (
                  <Icon name="checkmark" size={18} color="#fff" />
                ) : (
                  <Txt size={13} weight="semibold" color={colors.muted3} align="center">
                    {toArabicNumerals(i + 1)}
                  </Txt>
                )}
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <Txt naskh size={18} color={colors.creamText} style={{ lineHeight: 32 }} selectable>
                  {d.text}
                </Txt>
                <Txt size={11} color={colors.muted3}>
                  التكرار: {toArabicNumerals(d.count)}
                </Txt>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* زر بدء المسبحة */}
      <View style={{ position: "absolute", left: 0, right: 0, bottom: insets.bottom + spacing.md, paddingHorizontal: spacing.xl }}>
        <Pressable
          onPress={() => router.push(`/session/${cat.id}`)}
          style={{
            backgroundColor: colors.gold500,
            borderRadius: radii.pill,
            borderCurve: "continuous",
            paddingVertical: 16,
            alignItems: "center",
            boxShadow: "0 12px 28px -12px rgba(0,0,0,0.5)",
          }}
        >
          <Txt weight="bold" size={16} color={colors.green800}>ابدأ المسبحة</Txt>
        </Pressable>
      </View>
    </View>
  );
}

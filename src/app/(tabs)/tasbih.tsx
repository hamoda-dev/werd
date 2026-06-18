import { useState } from "react";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { Screen } from "@/components/screen";
import { AdhkarRow } from "@/components/adhkar-row";
import { groupByCategory } from "@/data/adhkari";
import { useAdhkariCategories, useAdhkariItems, useCustomAwrad } from "@/store/store";
import type { AdhkariItem } from "@/types";

const ALL = "all";

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { semantic, radii } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={{
        paddingHorizontal: spacing.md,
        paddingVertical: 8,
        borderRadius: radii.pill,
        borderCurve: "continuous",
        backgroundColor: active ? semantic.accent : semantic.surfaceStrong,
      }}
    >
      <Txt size={13} weight="semibold" color={active ? semantic.textOnCream : semantic.textSecondary}>
        {label}
      </Txt>
    </Pressable>
  );
}

function SectionLabel({ children }: { children: string }) {
  const { semantic } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs }}>
      <Txt size={14} weight="bold" color={semantic.accentLight}>{children}</Txt>
      <View style={{ flex: 1, height: 1, backgroundColor: semantic.goldHairline }} />
    </View>
  );
}

export default function AdhkariTab() {
  const { semantic, radii } = useTheme();
  const router = useRouter();
  const items = useAdhkariItems();
  const categories = useAdhkariCategories();
  const { remove } = useCustomAwrad();
  const [filter, setFilter] = useState<string>(ALL);

  const groups = groupByCategory(items, categories);
  const presentIds = new Set(groups.map((g) => g.category.id));
  // If the selected category lost all its items, fall back to "الكل".
  const effective = filter === ALL || presentIds.has(filter) ? filter : ALL;
  const visibleGroups = effective === ALL ? groups : groups.filter((g) => g.category.id === effective);

  function openItem(item: AdhkariItem) {
    router.push({ pathname: "/dhikr/[id]", params: { id: item.id } });
  }
  function editItem(item: AdhkariItem) {
    router.push({ pathname: "/awrad/[id]", params: { id: item.id } });
  }
  function deleteItem(item: AdhkariItem) {
    Alert.alert("حذف الذِكر", `هل تريد حذف «${item.title ?? item.text}»؟`, [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => remove(item.id) },
    ]);
  }

  function rows(list: AdhkariItem[]) {
    return list.map((it) => (
      <AdhkarRow
        key={it.id}
        item={it}
        onPress={() => openItem(it)}
        onEdit={() => editItem(it)}
        onDelete={() => deleteItem(it)}
      />
    ));
  }

  return (
    <Screen contentStyle={{ gap: spacing.md }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Txt size={26} weight="bold">أذكاري</Txt>
        <Pressable
          onPress={() => router.push("/awrad/new")}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="إضافة ذِكر"
          style={{ width: 40, height: 40, borderRadius: 20, borderCurve: "continuous", backgroundColor: semantic.accent, alignItems: "center", justifyContent: "center" }}
        >
          <Icon name="plus" size={22} color={semantic.textOnCream} />
        </Pressable>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, paddingVertical: 2 }}
      >
        <Chip label="الكل" active={effective === ALL} onPress={() => setFilter(ALL)} />
        {groups.map((g) => (
          <Chip key={g.category.id} label={g.category.label} active={effective === g.category.id} onPress={() => setFilter(g.category.id)} />
        ))}
      </ScrollView>

      {/* List */}
      {visibleGroups.length === 0 ? (
        <Pressable
          onPress={() => router.push("/awrad/new")}
          style={{ borderWidth: 1, borderColor: semantic.border, borderStyle: "dashed", borderRadius: radii.card, borderCurve: "continuous", padding: spacing.xl, alignItems: "center" }}
        >
          <Txt size={14} color={semantic.textSecondary} align="center">أضِف ذِكرك الخاص لتبدأ تسبيحه</Txt>
        </Pressable>
      ) : effective === ALL ? (
        visibleGroups.map((g) => (
          <View key={g.category.id} style={{ gap: spacing.sm }}>
            <SectionLabel>{g.category.label}</SectionLabel>
            {rows(g.items)}
          </View>
        ))
      ) : (
        <View style={{ gap: spacing.sm }}>{rows(visibleGroups[0].items)}</View>
      )}
    </Screen>
  );
}

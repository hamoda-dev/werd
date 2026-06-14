import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, gradients, radii, semantic, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { useAdhkariCategories, useCustomCategories } from "@/store/store";

const rowStyle = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  justifyContent: "space-between" as const,
  gap: spacing.sm,
  backgroundColor: semantic.surface,
  borderRadius: radii.tile,
  borderCurve: "continuous" as const,
  paddingHorizontal: spacing.lg,
  paddingVertical: 14,
};

const inputStyle = {
  backgroundColor: semantic.surfaceStrong,
  borderRadius: radii.tile,
  borderCurve: "continuous" as const,
  paddingHorizontal: spacing.md,
  paddingVertical: 10,
  fontFamily: fonts.sansMedium,
  fontSize: 15,
  color: semantic.textPrimary,
  textAlign: "auto" as const,
  writingDirection: "auto" as const,
};

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const categories = useAdhkariCategories();
  const { add, rename, remove } = useCustomCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function startEdit(id: string, label: string) {
    setAdding(false);
    setEditingId(id);
    setDraft(label);
  }
  function saveEdit() {
    if (editingId && draft.trim()) rename(editingId, draft.trim());
    setEditingId(null);
    setDraft("");
  }
  function startAdd() {
    setEditingId(null);
    setAdding(true);
    setDraft("");
  }
  function saveAdd() {
    if (draft.trim()) add(draft.trim());
    setAdding(false);
    setDraft("");
  }
  function confirmDelete(id: string, label: string) {
    Alert.alert("حذف التصنيف", `سيُنقل أي ذِكر في «${label}» إلى «عامة». هل تريد المتابعة؟`, [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: () => remove(id) },
    ]);
  }

  return (
    <View style={{ flex: 1, backgroundColor: semantic.screen, experimental_backgroundImage: gradients.darkScreen }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.xl,
          gap: spacing.sm,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xs }}>
          <Txt size={20} weight="bold">التصنيفات</Txt>
          <Pressable onPress={() => router.back()} hitSlop={12} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="xmark" size={20} color={semantic.textTertiary} />
          </Pressable>
        </View>

        {categories.map((c) => (
          <View key={c.id} style={rowStyle}>
            {editingId === c.id ? (
              <>
                <TextInput value={draft} onChangeText={setDraft} autoFocus onSubmitEditing={saveEdit} returnKeyType="done" style={[inputStyle, { flex: 1 }]} />
                <Pressable onPress={saveEdit} hitSlop={10}>
                  <Icon name="checkmark" size={20} color={semantic.accentLight} />
                </Pressable>
              </>
            ) : (
              <>
                <Txt size={15} weight="semibold" color={c.builtin ? semantic.textPrimary : semantic.accentLight}>{c.label}</Txt>
                {c.builtin ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Icon name="lock.fill" size={13} color={semantic.textTertiary} />
                    <Txt size={12} color={semantic.textTertiary}>أساسي</Txt>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
                    <Pressable onPress={() => startEdit(c.id, c.label)} hitSlop={8}>
                      <Icon name="pencil" size={18} color={semantic.textSecondary} />
                    </Pressable>
                    <Pressable onPress={() => confirmDelete(c.id, c.label)} hitSlop={8}>
                      <Icon name="trash" size={18} color={semantic.warm} />
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </View>
        ))}

        {adding ? (
          <View style={rowStyle}>
            <TextInput value={draft} onChangeText={setDraft} autoFocus placeholder="اسم التصنيف الجديد" placeholderTextColor={semantic.textTertiary} onSubmitEditing={saveAdd} returnKeyType="done" style={[inputStyle, { flex: 1 }]} />
            <Pressable onPress={saveAdd} hitSlop={10}>
              <Icon name="checkmark" size={20} color={semantic.accentLight} />
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={startAdd}
            style={{ borderWidth: 1, borderStyle: "dashed", borderColor: semantic.goldHairline, borderRadius: radii.tile, borderCurve: "continuous", paddingVertical: 14, alignItems: "center", marginTop: spacing.xs }}
          >
            <Txt weight="semibold" color={semantic.accentLight}>+ تصنيف جديد</Txt>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

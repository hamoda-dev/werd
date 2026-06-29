import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { toArabicNumerals } from "@/utils/numerals";
import type { AdhkarCategory } from "@/types";

export interface WardValues {
  title: string;
  text: string;
  /** Repetition target, or null for a free (open-ended) tasbih. */
  count: number | null;
  category: string;
}

interface Props {
  heading: string;
  initial?: WardValues;
  submitLabel: string;
  /** All categories (locked defaults + the user's own). */
  categories: AdhkarCategory[];
  /** Create a new category inline; returns it so the form can select it. */
  onCreateCategory: (label: string) => AdhkarCategory;
  onSubmit: (values: WardValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const DEFAULT_TARGET = 33;

export function WardForm({
  heading,
  initial,
  submitLabel,
  categories,
  onCreateCategory,
  onSubmit,
  onCancel,
  onDelete,
}: Props) {
  const { semantic, radii, gradients } = useTheme();
  const fieldStyle = {
    backgroundColor: semantic.surfaceStrong,
    borderRadius: radii.tile,
    borderCurve: "continuous" as const,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    color: semantic.textPrimary,
    textAlign: "auto" as const,
    writingDirection: "auto" as const,
  };
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [free, setFree] = useState(initial ? initial.count == null : false);
  const [count, setCount] = useState(initial?.count ?? DEFAULT_TARGET);
  const [countInput, setCountInput] = useState(toArabicNumerals(initial?.count ?? DEFAULT_TARGET));
  const [category, setCategory] = useState(
    // `||` (not `??`) so a legacy item with an empty-string category falls back too.
    (initial?.category && initial.category.trim()) || categories[0]?.id || "general",
  );
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState("");

  const valid =
    title.trim().length > 0 &&
    text.trim().length > 0 &&
    category.length > 0 &&
    (free || count >= 1);

  // Accept typed input (Eastern or Western digits), keep digits only (no negatives), display Eastern.
  function setCountFromText(t: string) {
    const western = t.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
    const digits = western.replace(/[^0-9]/g, "").slice(0, 5);
    setCountInput(toArabicNumerals(digits));
    setCount(digits ? parseInt(digits, 10) : 0);
  }

  function bumpCount(delta: number) {
    const n = Math.min(99999, Math.max(1, count + delta));
    setCount(n);
    setCountInput(toArabicNumerals(n));
  }

  // Empty/zero field falls back to 1 when the user leaves it.
  function normalizeCount() {
    if (count < 1) {
      setCount(1);
      setCountInput("١");
    }
  }

  function submit() {
    if (!valid) return;
    onSubmit({ title: title.trim(), text: text.trim(), count: free ? null : count, category });
  }

  function createCategory() {
    const label = newCat.trim();
    if (!label) return;
    const cat = onCreateCategory(label);
    setCategory(cat.id);
    setNewCat("");
    setAdding(false);
  }

  function confirmDelete() {
    if (!onDelete) return;
    Alert.alert("حذف الذِكر", "هل تريد حذف هذا الذِكر؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: onDelete },
    ]);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients.darkScreen,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Txt size={20} weight="bold">{heading}</Txt>
          <Pressable onPress={onCancel} hitSlop={12} style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center" }}>
            <Icon name="xmark" size={20} color={semantic.textTertiary} />
          </Pressable>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">عنوان الذِكر</Txt>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="مثال: تسبيح بعد الصلاة"
            placeholderTextColor={semantic.textTertiary}
            style={fieldStyle}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">نص الذكر</Txt>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="اكتب نص الذكر"
            placeholderTextColor={semantic.textTertiary}
            multiline
            style={[fieldStyle, { minHeight: 110, textAlignVertical: "top", fontFamily: fonts.naskh, fontSize: 20, lineHeight: 34 }]}
          />
        </View>

        {/* Category picker */}
        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">التصنيف</Txt>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            {categories.map((c) => {
              const active = category === c.id;
              return (
                <Pressable
                  key={c.id}
                  onPress={() => setCategory(c.id)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: 8,
                    borderRadius: radii.pill,
                    borderCurve: "continuous",
                    backgroundColor: active ? semantic.accent : semantic.surfaceStrong,
                  }}
                >
                  <Txt size={13} weight="semibold" color={active ? semantic.textOnCream : semantic.textPrimary}>
                    {c.label}
                  </Txt>
                </Pressable>
              );
            })}
            <Pressable
              onPress={() => setAdding((a) => !a)}
              style={{
                paddingHorizontal: spacing.md,
                paddingVertical: 8,
                borderRadius: radii.pill,
                borderCurve: "continuous",
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: semantic.goldHairline,
              }}
            >
              <Txt size={13} weight="semibold" color={semantic.accentLight}>+ جديدة</Txt>
            </Pressable>
          </View>

          {adding ? (
            <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center" }}>
              <TextInput
                value={newCat}
                onChangeText={setNewCat}
                placeholder="اسم التصنيف الجديد"
                placeholderTextColor={semantic.textTertiary}
                onSubmitEditing={createCategory}
                returnKeyType="done"
                style={[fieldStyle, { flex: 1 }]}
              />
              <Pressable
                onPress={createCategory}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: semantic.accent, alignItems: "center", justifyContent: "center" }}
              >
                <Icon name="checkmark" size={20} color={semantic.textOnCream} />
              </Pressable>
            </View>
          ) : null}
        </View>

        {/* Count mode: target vs free */}
        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">نوع العدّ</Txt>
          <View style={{ flexDirection: "row", gap: 4, backgroundColor: semantic.surfaceStrong, padding: 4, borderRadius: radii.pill, borderCurve: "continuous" }}>
            <Pressable
              onPress={() => {
                setFree(false);
                if (count < 1) {
                  setCount(DEFAULT_TARGET);
                  setCountInput(toArabicNumerals(DEFAULT_TARGET));
                }
              }}
              style={{ flex: 1, paddingVertical: 10, borderRadius: radii.pill, borderCurve: "continuous", alignItems: "center", backgroundColor: free ? "transparent" : semantic.accent }}
            >
              <Txt size={14} weight="semibold" color={free ? semantic.textSecondary : semantic.textOnCream}>هدف محدد</Txt>
            </Pressable>
            <Pressable
              onPress={() => setFree(true)}
              style={{ flex: 1, paddingVertical: 10, borderRadius: radii.pill, borderCurve: "continuous", alignItems: "center", backgroundColor: free ? semantic.accent : "transparent" }}
            >
              <Txt size={14} weight="semibold" color={free ? semantic.textOnCream : semantic.textSecondary}>تسبيح حر</Txt>
            </Pressable>
          </View>
        </View>

        {/* Target — typeable field (with +/− for small tweaks), only when a target is set */}
        {free ? null : (
          <View style={{ gap: spacing.sm }}>
            <Txt size={14} weight="medium">عدد التكرار</Txt>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.md }}>
              <Pressable
                onPress={() => bumpCount(-1)}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: semantic.surfaceStrong, alignItems: "center", justifyContent: "center" }}
              >
                <Txt size={26} weight="bold" color={semantic.textPrimary}>−</Txt>
              </Pressable>
              <TextInput
                value={countInput}
                onChangeText={setCountFromText}
                onBlur={normalizeCount}
                keyboardType="number-pad"
                maxLength={5}
                selectTextOnFocus
                placeholder="٠"
                placeholderTextColor={semantic.textTertiary}
                style={{
                  minWidth: 110,
                  textAlign: "center",
                  backgroundColor: semantic.surfaceStrong,
                  borderRadius: radii.tile,
                  borderCurve: "continuous",
                  paddingVertical: 10,
                  paddingHorizontal: spacing.md,
                  fontFamily: fonts.sansBold,
                  fontSize: 28,
                  color: semantic.accentLight,
                }}
              />
              <Pressable
                onPress={() => bumpCount(1)}
                style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: semantic.surfaceStrong, alignItems: "center", justifyContent: "center" }}
              >
                <Txt size={26} weight="bold" color={semantic.textPrimary}>+</Txt>
              </Pressable>
            </View>
            <Txt size={12} color={semantic.textSecondary} align="center">اكتب العدد مباشرةً، أو استخدم + و −</Txt>
          </View>
        )}

        <Pressable
          onPress={submit}
          disabled={!valid}
          style={{
            marginTop: spacing.sm,
            backgroundColor: valid ? semantic.accent : semantic.surfaceFaint,
            borderRadius: radii.pill,
            borderCurve: "continuous",
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Txt weight="bold" size={16} color={valid ? semantic.textOnCream : semantic.textTertiary}>{submitLabel}</Txt>
        </Pressable>

        {onDelete ? (
          <Pressable onPress={confirmDelete} style={{ paddingVertical: 14, alignItems: "center" }}>
            <Txt weight="semibold" color={semantic.warm}>حذف الذِكر</Txt>
          </Pressable>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

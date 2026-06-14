import { useState } from "react";
import { Alert, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, radii, spacing } from "@/theme/tokens";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { toArabicNumerals } from "@/utils/numerals";

export interface WardValues {
  title: string;
  text: string;
  count: number;
}

interface Props {
  heading: string;
  initial?: WardValues;
  submitLabel: string;
  onSubmit: (values: WardValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const fieldStyle = {
  backgroundColor: colors.whiteAlpha08,
  borderRadius: radii.tile,
  borderCurve: "continuous" as const,
  paddingHorizontal: spacing.lg,
  paddingVertical: 14,
  fontFamily: fonts.sansMedium,
  fontSize: 16,
  color: colors.creamText,
  textAlign: "auto" as const,
  writingDirection: "auto" as const,
};

export function WardForm({ heading, initial, submitLabel, onSubmit, onCancel, onDelete }: Props) {
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [text, setText] = useState(initial?.text ?? "");
  const [count, setCount] = useState(initial?.count ?? 33);

  const valid = title.trim().length > 0 && text.trim().length > 0 && count >= 1;

  function submit() {
    if (!valid) return;
    onSubmit({ title: title.trim(), text: text.trim(), count });
  }

  function confirmDelete() {
    if (!onDelete) return;
    Alert.alert("حذف الوِرد", "هل تريد حذف هذا الوِرد؟", [
      { text: "إلغاء", style: "cancel" },
      { text: "حذف", style: "destructive", onPress: onDelete },
    ]);
  }

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
            <Icon name="xmark" size={20} color={colors.muted2} />
          </Pressable>
        </View>

        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">عنوان الوِرد</Txt>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="مثال: تسبيح بعد الصلاة"
            placeholderTextColor={colors.muted2}
            style={fieldStyle}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">نص الذكر</Txt>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="اكتب نص الذكر"
            placeholderTextColor={colors.muted2}
            multiline
            style={[fieldStyle, { minHeight: 110, textAlignVertical: "top", fontFamily: fonts.naskh, fontSize: 20, lineHeight: 34 }]}
          />
        </View>

        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium">عدد التكرار</Txt>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.xl }}>
            <Pressable
              onPress={() => setCount((c) => Math.max(1, c - 1))}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.whiteAlpha08, alignItems: "center", justifyContent: "center" }}
            >
              <Txt size={26} weight="bold" color={colors.creamText}>−</Txt>
            </Pressable>
            <Txt size={32} weight="bold" color={colors.gold300} style={{ minWidth: 70, fontVariant: ["tabular-nums"] }} align="center">
              {toArabicNumerals(count)}
            </Txt>
            <Pressable
              onPress={() => setCount((c) => c + 1)}
              style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.whiteAlpha08, alignItems: "center", justifyContent: "center" }}
            >
              <Txt size={26} weight="bold" color={colors.creamText}>+</Txt>
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={submit}
          disabled={!valid}
          style={{
            marginTop: spacing.sm,
            backgroundColor: valid ? colors.gold500 : colors.whiteAlpha14,
            borderRadius: radii.pill,
            borderCurve: "continuous",
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Txt weight="bold" size={16} color={valid ? colors.green800 : colors.muted2}>{submitLabel}</Txt>
        </Pressable>

        {onDelete ? (
          <Pressable onPress={confirmDelete} style={{ paddingVertical: 14, alignItems: "center" }}>
            <Txt weight="semibold" color={colors.terracotta500}>حذف الوِرد</Txt>
          </Pressable>
        ) : null}
      </ScrollView>
    </View>
  );
}

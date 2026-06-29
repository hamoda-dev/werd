import { useState } from "react";
import { Pressable, ScrollView, Switch, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts, spacing } from "@/theme/tokens";
import { useTheme } from "@/theme/context";
import { THEME_LIST } from "@/theme/registry";
import { Txt } from "@/components/txt";
import { Icon } from "@/components/icon";
import { ThemePreview } from "@/components/theme-preview";
import { toArabicNumerals } from "@/utils/numerals";
import { ensureReminders, cancelReminders } from "@/utils/notifications";
import { useSettings } from "@/store/store";

export default function Profile() {
  const theme = useTheme();
  const { semantic, radii, gradients } = theme;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, update } = useSettings();
  const [name, setName] = useState(settings.name);
  const countMode = settings.countMode ?? "fingers";

  function saveName() {
    const t = name.trim();
    if (t && t !== settings.name) update({ name: t });
  }

  async function toggleReminders(value: boolean) {
    if (value) {
      const ok = await ensureReminders(settings.morningTime, settings.eveningTime);
      update({ remindersEnabled: ok });
    } else {
      await cancelReminders();
      update({ remindersEnabled: false });
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: semantic.screen,
        experimental_backgroundImage: gradients.darkScreen,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + spacing.lg,
          paddingBottom: spacing.xxl,
          paddingHorizontal: spacing.xl,
          gap: spacing.lg,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Txt size={22} weight="bold">ملفي</Txt>

        {/* Name */}
        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium" color={semantic.textSecondary}>الاسم</Txt>
          <TextInput
            value={name}
            onChangeText={setName}
            onBlur={saveName}
            onSubmitEditing={saveName}
            returnKeyType="done"
            placeholder="اكتب اسمك"
            placeholderTextColor={semantic.textTertiary}
            style={{
              backgroundColor: semantic.surfaceStrong,
              borderRadius: radii.tile,
              borderCurve: "continuous",
              paddingHorizontal: spacing.lg,
              paddingVertical: 14,
              fontFamily: fonts.sansMedium,
              fontSize: 18,
              color: semantic.textPrimary,
              textAlign: "auto",
              writingDirection: "auto",
            }}
          />
        </View>

        {/* Appearance / theme */}
        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium" color={semantic.textSecondary}>المظهر</Txt>
          <View style={{ flexDirection: "row", gap: spacing.md }}>
            {THEME_LIST.map((t) => {
              const active = t.id === theme.id;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => update({ themeId: t.id })}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: spacing.sm,
                    backgroundColor: semantic.surface,
                    borderWidth: 1.5,
                    borderColor: active ? semantic.accent : semantic.border,
                    borderRadius: radii.card,
                    borderCurve: "continuous",
                    paddingVertical: spacing.lg,
                    paddingHorizontal: spacing.md,
                  }}
                >
                  <ThemePreview theme={t} />
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    {active ? <Icon name="checkmark.seal.fill" size={16} color={semantic.accent} /> : null}
                    <Txt size={14} weight="bold" color={active ? semantic.accentLight : semantic.textPrimary}>
                      {t.label}
                    </Txt>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reminders */}
        <View
          style={{
            backgroundColor: semantic.surface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: spacing.lg }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Icon name="bell.fill" size={20} color={semantic.accentLight} />
              <Txt size={15} weight="medium">تذكير الصباح والمساء</Txt>
            </View>
            <Switch
              value={settings.remindersEnabled}
              onValueChange={toggleReminders}
              trackColor={{ true: semantic.accent, false: semantic.surfaceFaint }}
              thumbColor={semantic.textOnColor}
            />
          </View>
          <Pressable
            onPress={() => router.push("/settings/reminders")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: spacing.lg,
              borderTopWidth: 1,
              borderTopColor: semantic.surfaceStrong,
            }}
          >
            <Txt size={15} weight="medium">أوقات التذكير</Txt>
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
              <Txt size={13} color={semantic.textSecondary}>
                {toArabicNumerals(settings.morningTime)} · {toArabicNumerals(settings.eveningTime)}
              </Txt>
              <Icon name="chevron.forward" size={16} color={semantic.textTertiary} />
            </View>
          </Pressable>
        </View>

        {/* Adhkari management */}
        <Pressable
          onPress={() => router.push("/settings/categories")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: semantic.surface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Icon name="gearshape.fill" size={20} color={semantic.accentLight} />
            <Txt size={15} weight="medium">إدارة تصنيفات الأذكار</Txt>
          </View>
          <Icon name="chevron.forward" size={16} color={semantic.textTertiary} />
        </Pressable>

        {/* Counting method */}
        <View style={{ gap: spacing.sm }}>
          <Txt size={14} weight="medium" color={semantic.textSecondary}>طريقة العدّ في الأذكار</Txt>
          <View
            style={{
              flexDirection: "row",
              gap: spacing.xs,
              backgroundColor: semantic.surface,
              borderRadius: radii.card,
              borderCurve: "continuous",
              padding: spacing.xs,
            }}
          >
            {(
              [
                { id: "fingers", label: "العدّ على الأصابع", sub: "سحب · موافق للسنّة" },
                { id: "beads", label: "المسبحة", sub: "عدّاد بالنقر" },
              ] as const
            ).map((opt) => {
              const active = countMode === opt.id;
              return (
                <Pressable
                  key={opt.id}
                  onPress={() => update({ countMode: opt.id })}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    paddingVertical: spacing.md,
                    paddingHorizontal: spacing.sm,
                    borderRadius: radii.tile,
                    borderCurve: "continuous",
                    backgroundColor: active ? semantic.accent : "transparent",
                  }}
                >
                  <Txt
                    size={14}
                    weight="bold"
                    color={active ? semantic.textOnCream : semantic.textPrimary}
                    align="center"
                  >
                    {opt.label}
                  </Txt>
                  <Txt
                    size={11}
                    color={active ? semantic.textOnCream : semantic.textSecondary}
                    align="center"
                    style={{ marginTop: 2 }}
                  >
                    {opt.sub}
                  </Txt>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Tap sound — only relevant for the المسبحة (beads) counter */}
        {countMode === "beads" ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: semantic.surface,
              borderRadius: radii.card,
              borderCurve: "continuous",
              padding: spacing.lg,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <Icon name="speaker.wave.fill" size={20} color={semantic.accentLight} />
              <Txt size={15} weight="medium">صوت النقر عند التسبيح</Txt>
            </View>
            <Switch
              value={settings.soundEnabled !== false}
              onValueChange={(v) => update({ soundEnabled: v })}
              trackColor={{ true: semantic.accent, false: semantic.surfaceFaint }}
              thumbColor={semantic.textOnColor}
            />
          </View>
        ) : null}

        {/* About — full page with app info + creator */}
        <Pressable
          onPress={() => router.push("/about")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: semantic.surface,
            borderRadius: radii.card,
            borderCurve: "continuous",
            padding: spacing.lg,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Icon name="info.circle" size={20} color={semantic.accentLight} />
            <Txt size={15} weight="medium">عن وِرْد والمطوِّر</Txt>
          </View>
          <Icon name="chevron.forward" size={16} color={semantic.textTertiary} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

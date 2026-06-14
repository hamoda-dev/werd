import { Redirect, Tabs } from "expo-router";
import { TabBar } from "@/components/tab-bar";
import { useSettings } from "@/store/store";

export default function TabsLayout() {
  const { settings } = useSettings();

  // Onboarding gate: if the name hasn't been entered yet, redirect to the welcome screen.
  if (!settings.name) return <Redirect href="/onboarding" />;

  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "الرئيسية" }} />
      <Tabs.Screen name="tasbih" options={{ title: "أذكاري" }} />
      <Tabs.Screen name="achievements" options={{ title: "إنجازاتي" }} />
      <Tabs.Screen name="profile" options={{ title: "ملفي" }} />
    </Tabs>
  );
}

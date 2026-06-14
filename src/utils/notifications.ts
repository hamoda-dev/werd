/**
 * Scheduled local notifications (no server/push). A daily reminder for morning and evening.
 */
import * as Notifications from "expo-notifications";

// Show the notification even if the app is open.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const CHANNEL_ID = "reminders";

function parseTime(t: string): { hour: number; minute: number } {
  const [hour, minute] = t.split(":").map(Number);
  return { hour: hour || 0, minute: minute || 0 };
}

async function ensureAndroidChannel(): Promise<void> {
  if (process.env.EXPO_OS === "android") {
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "تذكير الأذكار",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

/** Requests permission if needed, then schedules both reminders. Returns true if permission is granted. */
export async function ensureReminders(
  morningTime: string,
  eveningTime: string,
): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted) {
    const req = await Notifications.requestPermissionsAsync();
    granted = req.granted;
  }
  if (!granted) return false;
  await scheduleReminders(morningTime, eveningTime);
  return true;
}

/** Cancels the old schedule and schedules the daily morning and evening reminders. */
export async function scheduleReminders(
  morningTime: string,
  eveningTime: string,
): Promise<void> {
  await ensureAndroidChannel();
  await Notifications.cancelAllScheduledNotificationsAsync();

  const m = parseTime(morningTime);
  const e = parseTime(eveningTime);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "وِرْد 🌤",
      body: "صباح النور — لا تنسَ أذكار الصباح.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: m.hour,
      minute: m.minute,
      channelId: CHANNEL_ID,
    },
  });

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "وِرْد 🔥",
      body: "حافِظ على سلسلتك — حان وقت أذكار المساء.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: e.hour,
      minute: e.minute,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/** مفاتيح ودوال التاريخ المحلي (YYYY-MM-DD) لتتبّع التقدّم اليومي والسلسلة. */

function pad(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function previousDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
}

/** آخر ٧ أيام (الأقدم أولاً) كمصفوفة مفاتيح تواريخ. */
export function last7DayKeys(): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(dateKey(d));
  }
  return keys;
}

/** حروف أيام الأسبوع العربية (الأحد=0). */
export function weekdayLetter(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return ["ح", "ن", "ث", "ر", "خ", "ج", "س"][day];
}

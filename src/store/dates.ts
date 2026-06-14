/** Local date keys and functions (YYYY-MM-DD) for tracking daily progress and the streak. */

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

/** The last 7 days (oldest first) as an array of date keys. */
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

/** Arabic weekday letters (Sunday=0). */
export function weekdayLetter(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return ["ح", "ن", "ث", "ر", "خ", "ج", "س"][day];
}

/** Shift a date key by a number of days (negative for the past). */
export function shiftDayKey(key: string, delta: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return dateKey(date);
}

/** Start of the week (Saturday) the key falls in — the app's week starts on Saturday. */
export function startOfWeekKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const day = new Date(y, m - 1, d).getDay(); // Sunday=0 … Saturday=6
  const sinceSaturday = (day + 1) % 7;
  return shiftDayKey(key, -sinceSaturday);
}

/** Seven consecutive keys starting from startKey. */
export function weekKeys(startKey: string): string[] {
  return Array.from({ length: 7 }, (_, i) => shiftDayKey(startKey, i));
}

/** All day keys for the month (month1 is 1-based) from oldest to newest. */
export function monthDayKeys(year: number, month1: number): string[] {
  const days = new Date(year, month1, 0).getDate(); // last day of the month
  return Array.from({ length: days }, (_, i) =>
    `${year}-${pad(month1)}-${pad(i + 1)}`,
  );
}

/** Weekday number of the first day of the month (Sunday=0) — for computing empty cells. */
export function firstWeekdayOfMonth(year: number, month1: number): number {
  return new Date(year, month1 - 1, 1).getDay();
}

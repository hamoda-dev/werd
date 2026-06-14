/** Convert Latin digits (0-9) to Eastern Arabic numerals (٠-٩). */
const EASTERN = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

export function toArabicNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => EASTERN[Number(d)]);
}

/** A percentage in Arabic numerals, e.g. ٦٥٪ */
export function toArabicPercent(value: number): string {
  return `${toArabicNumerals(Math.round(value))}٪`;
}

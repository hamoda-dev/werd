/** تحويل الأرقام اللاتينية (0-9) إلى الأرقام العربية الشرقية (٠-٩). */
const EASTERN = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"] as const;

export function toArabicNumerals(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => EASTERN[Number(d)]);
}

/** نسبة مئوية بالأرقام العربية، مثل: ٦٥٪ */
export function toArabicPercent(value: number): string {
  return `${toArabicNumerals(Math.round(value))}٪`;
}

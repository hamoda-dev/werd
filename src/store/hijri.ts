/**
 * Hijri month labels for the calendar — via umm al-qura (hijri-converter). The grid
 * stays Gregorian; this is for labeling only. Falls back to a Gregorian label outside the supported range.
 */
import { toHijri } from "hijri-converter";
import { toArabicNumerals } from "@/utils/numerals";

const HIJRI_MONTHS = [
  "محرّم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوّال",
  "ذو القعدة",
  "ذو الحجة",
];

const GREGORIAN_MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function hijriMonthLabel(hy: number, hm: number): string {
  return `${HIJRI_MONTHS[hm - 1]} ${toArabicNumerals(hy)}`;
}

export function gregorianMonthLabel(year: number, month1: number): string {
  return `${GREGORIAN_MONTHS_AR[month1 - 1]} ${toArabicNumerals(year)}`;
}

/**
 * The Hijri month label corresponding to a Gregorian month (represented by day 15). The label is
 * approximate (one Gregorian grid ≈ two Hijri months). Falls back to Gregorian outside the supported range.
 */
export function monthLabel(year: number, month1: number): string {
  try {
    const { hy, hm, hd } = toHijri(year, month1, 15);
    // Note: below the table's range (≈ before 1937 CE) the library returns a bogus value
    // {hy:1355, hm:12, hd:null} without throwing; we require a valid hd to detect this and fall back to Gregorian.
    if (hy && hm && hd && hm >= 1 && hm <= 12) return hijriMonthLabel(hy, hm);
  } catch {
    // Out of range — fall back to Gregorian
  }
  return gregorianMonthLabel(year, month1);
}

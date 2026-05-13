/**
 * Display: always dd/mm/yyyy (day first, then month — never mm/dd).
 * Form state / API: yyyy-mm-dd calendar day via {@link toDateInputValue} / {@link fromDateInputValue}.
 */

function toCalendarDate(value) {
  if (value instanceof Date) return value;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    const [y, m, d] = value.trim().split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(value);
}

export function formatDateDdMmYyyy(value, options = {}) {
  const empty = options.empty ?? "—";
  if (value == null || value === "") return empty;
  const d = toCalendarDate(value);
  if (Number.isNaN(d.getTime())) return empty;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

/** Value for HTML input type="date" (yyyy-mm-dd, local calendar day). */
export function toDateInputValue(value) {
  if ((value === undefined || value === null || value === "") && value !== 0) return "";
  const d = toCalendarDate(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse yyyy-mm-dd (or ISO date prefix) to local Date; null if empty/invalid. */
export function fromDateInputValue(value) {
  if (value == null || value === "") return null;
  let t = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}T/.test(t)) t = t.slice(0, 10);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  const d = new Date(y, mo, day);
  if (Number.isNaN(d.getTime())) return null;
  if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== day) return null;
  return d;
}

/** Tuổi đủ năm (local) từ ngày sinh đến refDate. */
export function getFullAgeYears(birthDate, refDate = new Date()) {
  if (!birthDate || Number.isNaN(birthDate.getTime())) return null;
  let age = refDate.getFullYear() - birthDate.getFullYear();
  const md = refDate.getMonth() - birthDate.getMonth();
  if (md < 0 || (md === 0 && refDate.getDate() < birthDate.getDate())) age -= 1;
  return age;
}

/** Giảng viên: tối thiểu 22 tuổi (theo chuỗi yyyy-mm-dd). */
export const MIN_TEACHER_AGE_YEARS = 22;

/** @param {string} ngaysinhYyyyMmDd */
export function teacherMeetsMinimumAge(ngaysinhYyyyMmDd) {
  if (ngaysinhYyyyMmDd == null || String(ngaysinhYyyyMmDd).trim() === "") return false;
  const d = fromDateInputValue(ngaysinhYyyyMmDd);
  if (!d) return false;
  const age = getFullAgeYears(d);
  return age != null && age >= MIN_TEACHER_AGE_YEARS;
}

/** Date and time: dd/mm/yyyy, HH:mm (24h). */
export function formatDateTimeDdMmYyyy(value, options = {}) {
  const empty = options.empty ?? "—";
  if (value == null || value === "") return empty;
  const d = toCalendarDate(value);
  if (Number.isNaN(d.getTime())) return empty;
  const datePart = formatDateDdMmYyyy(d, { empty: "" });
  if (datePart === "") return empty;
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${datePart}, ${hh}:${min}`;
}

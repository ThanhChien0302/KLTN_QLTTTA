/** Giảng viên: tối thiểu 22 tuổi (đủ năm theo ngày sinh, mốc so với “hôm nay” phía server). */
const MIN_TEACHER_AGE = 22;

function parseBirthLocal(ngaysinh) {
  if (ngaysinh == null || ngaysinh === "") return null;
  if (ngaysinh instanceof Date) {
    if (Number.isNaN(ngaysinh.getTime())) return null;
    return new Date(ngaysinh.getFullYear(), ngaysinh.getMonth(), ngaysinh.getDate());
  }
  if (typeof ngaysinh === "string") {
    let t = ngaysinh.trim();
    if (!t) return null;
    if (/^\d{4}-\d{2}-\d{2}T/.test(t)) t = t.slice(0, 10);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t);
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d);
    if (Number.isNaN(dt.getTime())) return null;
    if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) return null;
    return dt;
  }
  return null;
}

function fullYearsSinceBirth(birth, ref = new Date()) {
  let age = ref.getFullYear() - birth.getFullYear();
  const md = ref.getMonth() - birth.getMonth();
  if (md < 0 || (md === 0 && ref.getDate() < birth.getDate())) age -= 1;
  return age;
}

/**
 * @param {*} ngaysinh — Chuỗi yyyy-mm-dd, ISO, hoặc Date
 * @param {{ requirePresent?: boolean }} opts — Tạo mới: requirePresent = true
 * @returns {{ ok: boolean, message?: string }}
 */
function validateTeacherNgaysinh(ngaysinh, opts = {}) {
  const { requirePresent = false } = opts;
  const birth = parseBirthLocal(ngaysinh);
  if (!birth) {
    if (requirePresent) {
      return {
        ok: false,
        message: `Ngày sinh là bắt buộc. Giảng viên phải từ ${MIN_TEACHER_AGE} tuổi trở lên.`,
      };
    }
    return { ok: true };
  }
  const age = fullYearsSinceBirth(birth);
  if (age < MIN_TEACHER_AGE) {
    return {
      ok: false,
      message: `Giảng viên phải từ ${MIN_TEACHER_AGE} tuổi trở lên. Tuổi hiện tại theo ngày sinh: ${age} tuổi.`,
    };
  }
  if (age > 100) {
    return { ok: false, message: "Ngày sinh không hợp lệ." };
  }
  return { ok: true };
}

module.exports = {
  MIN_TEACHER_AGE,
  validateTeacherNgaysinh,
  parseBirthLocal,
  fullYearsSinceBirth,
};

"use client";

import { useMemo } from "react";

const CheckIcon = ({ ok }) => (
  <span
    className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold border ${
      ok ? "bg-green-600 border-green-600 text-white" : "bg-gray-100 border-gray-300 text-gray-500"
    }`}
    aria-hidden="true"
  >
    {ok ? "✓" : "•"}
  </span>
);

function scoreToLabel(score) {
  if (score <= 1) return { label: "Rất yếu", bar: "bg-red-500" };
  if (score === 2) return { label: "Yếu", bar: "bg-orange-500" };
  if (score === 3) return { label: "Trung bình", bar: "bg-yellow-500" };
  if (score === 4) return { label: "Mạnh", bar: "bg-lime-600" };
  return { label: "Rất mạnh", bar: "bg-green-600" };
}

export default function PasswordStrength({ password, showWhenEmpty = false }) {
  const value = password || "";

  const checks = useMemo(() => {
    return [
      { key: "len", label: "Hơn 6 ký tự (≥ 7)", ok: value.length >= 7 },
      { key: "lower", label: "Có chữ thường (a-z)", ok: /[a-z]/.test(value) },
      { key: "upper", label: "Có chữ hoa (A-Z)", ok: /[A-Z]/.test(value) },
      { key: "digit", label: "Có số (0-9)", ok: /\d/.test(value) },
      { key: "special", label: "Có ký tự đặc biệt (!@#...)", ok: /[^A-Za-z0-9]/.test(value) },
    ];
  }, [value]);

  const score = useMemo(() => checks.filter((c) => c.ok).length, [checks]);
  const percent = useMemo(() => Math.round((score / 5) * 100), [score]);
  const meta = useMemo(() => scoreToLabel(score), [score]);

  if (!showWhenEmpty && value.length === 0) return null;

  return (
    <div className="mt-2 rounded-lg border border-gray-200 dark:border-gray-700 p-3 bg-white/60 dark:bg-gray-900/30">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-gray-600 dark:text-gray-300">
          Độ mạnh mật khẩu: <span className="font-semibold">{meta.label}</span>
        </p>
        <p className="text-xs text-gray-500">{percent}%</p>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full ${meta.bar} transition-all duration-300`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-3 grid grid-cols-1 gap-1.5 text-xs">
        {checks.map((c) => (
          <li key={c.key} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <CheckIcon ok={c.ok} />
            <span className={c.ok ? "text-green-700 dark:text-green-300" : "text-gray-500 dark:text-gray-400"}>
              {c.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}


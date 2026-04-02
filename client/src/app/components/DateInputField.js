"use client";

import { useRef } from "react";

function CalendarIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25"
      />
    </svg>
  );
}

// format yyyy-mm-dd -> dd/mm/yyyy
function formatDate(value) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y}`;
}

export default function DateInputField({
  value,
  onChange,
  disabled = false,
  required = false,
  name,
  id,
}) {
  const ref = useRef(null);

  const openPicker = () => {
    if (disabled) return;
    ref.current?.showPicker?.() || ref.current?.click();
  };

  return (
    <div className="flex items-center border rounded-md overflow-hidden">
      {/* input hiển thị */}
      <input
        type="text"
        value={formatDate(value)}
        placeholder="dd/mm/yyyy"
        readOnly
        onClick={openPicker}
        className="flex-1 px-3 py-2 outline-none cursor-pointer"
      />

      {/* button icon */}
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className="px-3 border-l"
      >
        <CalendarIcon className="w-5 h-5" />
      </button>

      {/* input date thật */}
      <input
        ref={ref}
        type="date"
        value={value}
        name={name}
        onChange={(e) => onChange?.(e)}
        required={required}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
}

"use client";
import { useRef } from "react";
export default function DateInputField({
  id,
  name,
  value,
  onChange,
  disabled = false,
  required = false,
  className,
  inputClassName,
  placeholder,
}) {
  const inputRef = useRef(null);
  const openPicker = () => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;
    // showPicker() is not supported in all browsers; fallback to focus.
    if (typeof el.showPicker === "function") {
      el.showPicker();
      return;
    }
    el.focus();
  };
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="date"
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className={
          inputClassName ||
          "date-input-field input-date-icon min-w-0 flex-1 px-0 py-0 text-sm outline-none border-0 bg-transparent disabled:opacity-70 dark:bg-transparent dark:text-gray-100 placeholder:text-gray-400"
        }
      />
      <button
        type="button"
        onClick={openPicker}
        disabled={disabled}
        className="inline-flex items-center justify-center bg-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Chọn ngày"
      >
        <i className="fa-solid fa-calendar-days" />
      </button>
    </div>
  );
}

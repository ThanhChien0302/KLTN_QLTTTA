"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { vi } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.min.css";
import { fromDateInputValue, toDateInputValue } from "../../lib/dateFormat";

registerLocale("vi", vi);

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
  const selected = fromDateInputValue(value);

  const handleChange = (date) => {
    if (!onChange) return;
    const next =
      date && !Number.isNaN(date.getTime()) ? toDateInputValue(date) : "";
    onChange({ target: { name, value: next } });
  };

  const defaultInputClass =
    "date-input-field min-w-0 flex-1 px-0 py-0 text-sm outline-none border-0 bg-transparent disabled:opacity-70 dark:bg-transparent dark:text-gray-100 placeholder:text-gray-400";

  return (
    <div className={`flex min-w-0 flex-1 items-center gap-2 ${className || ""}`}>
      <DatePicker
        id={id}
        name={name}
        selected={selected}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder || "dd/mm/yyyy"}
        disabled={disabled}
        required={required}
        locale="vi"
        autoComplete="off"
        isClearable={!required}
        showIcon
        toggleCalendarOnIconClick
        icon={<i className="fa-solid fa-calendar-days" aria-hidden />}
        calendarIconClassName="!m-0 !p-0 text-base leading-none text-gray-500 dark:text-gray-300 !inline-flex !items-center !justify-center"
        wrapperClassName="date-input-rdp min-w-0 flex-1 w-full"
        className={inputClassName || defaultInputClass}
        popperClassName="react-datepicker-admin-z"
      />
    </div>
  );
}

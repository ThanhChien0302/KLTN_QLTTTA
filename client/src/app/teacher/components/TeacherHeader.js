"use client";

import Link from "next/link";
import { FiBell, FiMenu, FiX } from "react-icons/fi";
import { IconMoon, IconSun } from "./teacherIcons";
import NotificationDropdown from "../../components/NotificationDropdown";

export default function TeacherHeader({
  darkMode,
  toggleTheme,
  user,
  menuCollapsed,
  setMenuCollapsed,
  onOpenMobileMenu,
}) {
  const initial = (user?.hovaten || user?.FullName || user?.name || "?").charAt(0).toUpperCase();

  return (
    <header className="teacher-shell-header z-40 relative flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="teacher-shell-icon-btn lg:hidden"
          onClick={onOpenMobileMenu}
          aria-label="Mở menu"
        >
          <FiMenu size={24} />
        </button>

        <button
          type="button"
          className="teacher-shell-icon-btn hidden lg:inline-flex"
          onClick={() => setMenuCollapsed((v) => !v)}
          aria-label="Thu/gọn menu"
        >
          {menuCollapsed ? <FiMenu size={22} /> : <FiX size={22} />}
        </button>

        <h2 className="teacher-shell-header-title hidden truncate text-xl sm:block">Hệ Thống Quản Lý Giảng Dạy</h2>
        <h2 className="teacher-shell-header-title truncate text-lg sm:hidden">Teacher</h2>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          className="teacher-shell-icon-btn rounded-full p-2"
          title="Đổi giao diện"
        >
          {darkMode ? <IconSun /> : <IconMoon />}
        </button>

        <NotificationDropdown />

        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-[var(--teacher-sidebar-fg)]">{user?.hovaten || user?.FullName || user?.name}</p>
          <p className="text-xs text-[var(--teacher-sidebar-fg-muted)]">{user?.email}</p>
        </div>
        <div className="teacher-shell-avatar flex h-10 w-10 items-center justify-center rounded-full text-lg">{initial}</div>
      </div>
    </header>
  );
}

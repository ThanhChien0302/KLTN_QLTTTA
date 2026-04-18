"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import ConfirmModal from "../components/ConfirmModal";
import { ThemeProvider } from "../contexts/ThemeContext";
import { useTeacherHotkeys } from "./useTeacherHotkeys";
import { teacherSans, teacherDisplay } from "./fonts";
import TeacherSidebar from "./components/TeacherSidebar";
import TeacherHeader from "./components/TeacherHeader";
import "./teacher-shell.css";

export default function TeacherLayout({ children }) {
  const { user, loading, isAuthenticated, isTeacher, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useTeacherHotkeys(router);

  const [darkMode, setDarkMode] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuCollapsed, setMenuCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !isTeacher) router.push("/");
  }, [loading, isAuthenticated, isTeacher, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className={`${teacherSans.variable} ${teacherDisplay.variable} teacher-shell-root teacher-shell-loading`}>
        <div className="teacher-shell-loading-bars" aria-hidden>
          <span />
          <span />
          <span />
        </div>
        <p className="teacher-shell-logo text-lg font-semibold text-[var(--teacher-accent)]">EMC Teacher</p>
        <p className="text-sm text-[var(--teacher-sidebar-fg-muted)]">Đang tải phiên làm việc…</p>
      </div>
    );
  }

  if (!isAuthenticated || !isTeacher) return null;

  const fontVars = `${teacherSans.variable} ${teacherDisplay.variable}`;

  return (
    <div className={`${fontVars} teacher-shell-root flex h-screen transition-colors duration-300`}>
      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} role="presentation" />
          <aside className="teacher-sidebar-panel relative flex h-full w-64 shrink-0 flex-col overflow-hidden border-r shadow-xl">
            <TeacherSidebar
              collapsed={false}
              onNavigate={() => setMobileMenuOpen(false)}
              onLogout={() => setShowLogoutModal(true)}
            />
          </aside>
        </div>
      ) : null}

      <aside
        className={`group teacher-sidebar-panel relative z-10 hidden h-full shrink-0 overflow-hidden border-r border-[var(--teacher-sidebar-border)] shadow-lg transition-[width] duration-300 ease-out lg:flex lg:flex-col ${
          menuCollapsed ? "w-20 hover:w-64" : "w-64"
        }`}
      >
        <TeacherSidebar
          collapsed={menuCollapsed}
          onLogout={() => setShowLogoutModal(true)}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ThemeProvider value={{ darkMode }}>
          <TeacherHeader
            darkMode={darkMode}
            toggleTheme={toggleTheme}
            user={user}
            menuCollapsed={menuCollapsed}
            setMenuCollapsed={setMenuCollapsed}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />

          <main className="teacher-shell-main flex-1 overflow-y-auto custom-scrollbar">
            <div className="teacher-shell-main-noise" aria-hidden />
            <div key={pathname} className="teacher-main-inner relative z-[1] p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>

          <ConfirmModal
            isOpen={showLogoutModal}
            title="Xác nhận đăng xuất"
            message="Bạn có chắc muốn đăng xuất không?"
            onCancel={() => setShowLogoutModal(false)}
            onConfirm={() => {
              setShowLogoutModal(false);
              logout();
            }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
}

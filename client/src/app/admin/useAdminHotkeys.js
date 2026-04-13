"use client";

import { useEffect } from "react";

const ROUTES = {
  o: "/admin",
  f: "/admin/facilities",
  h: "/admin/users/student",
  g: "/admin/users/teacher",
  u: "/admin/users/admin",
  c: "/admin/courses",
  t: "/admin/course-types",
  a: "/admin/attendance",
  n: "/admin/announcements",
  k: "/admin/kiosk-keys",
  s: "/admin/sample-tests",
  p: "/admin/practice-exercises",
};

function isTypingContext(target) {
  if (!target || typeof target !== "object") return false;
  const el = target;
  const tag = el.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (el.isContentEditable) return true;
  return Boolean(el.closest?.("input, textarea, select, [contenteditable='true']"));
}

/**
 * Phím tắt Alt+Shift+chữ (tránh xung đột khi đang gõ trong form).
 */
export function useAdminHotkeys(router) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (!e.altKey || !e.shiftKey) return;
      if (isTypingContext(e.target)) return;
      const key = typeof e.key === "string" ? e.key.toLowerCase() : "";
      const path = ROUTES[key];
      if (!path) return;
      e.preventDefault();
      router.push(path);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);
}

export const ADMIN_HOTKEY_ROUTES = ROUTES;

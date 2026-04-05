"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AdminAttendanceLivePage() {
  const { token } = useAuth();
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!token) return undefined;

    const socket = io(API_BASE, {
      path: "/socket.io/",
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));

    socket.on("attendance:update", (payload) => {
      setEvents((prev) => [{ ...payload, _ts: Date.now() }, ...prev].slice(0, 80));
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const fmt = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString("vi-VN");
    } catch {
      return String(d);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Điểm danh (real-time)</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Luồng sự kiện từ kiosk qua Socket.IO — cập nhật khi học viên xác nhận điểm danh.
        </p>
      </div>

      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
          connected
            ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
            : "bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-amber-500"}`}
        />
        {connected ? "Đã kết nối Socket.IO" : "Đang kết nối hoặc mất kết nối..."}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b dark:border-gray-700 font-medium text-gray-900 dark:text-white">
          Sự kiện gần đây
        </div>
        <ul className="divide-y dark:divide-gray-700 max-h-[70vh] overflow-y-auto">
          {events.length === 0 ? (
            <li className="px-4 py-8 text-center text-gray-500 text-sm">
              Chưa có sự kiện. Mở trang kiosk và điểm danh để thấy dữ liệu tại đây.
            </li>
          ) : (
            events.map((ev, i) => (
              <li key={`${ev._ts}-${i}`} className="px-4 py-3 text-sm">
                <div className="font-medium text-gray-900 dark:text-white">{ev.hovaten}</div>
                <div className="text-gray-600 dark:text-gray-400">
                  {ev.tenkhoahoc} — {fmt(ev.thoigian_checkin)}
                  {ev.late ? (
                    <span className="ml-2 text-amber-600 dark:text-amber-400">(trễ)</span>
                  ) : null}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

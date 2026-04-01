"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

const TYPE_STYLES = {
  success: "border-green-200 bg-green-50 text-green-800",
  error: "border-red-200 bg-red-50 text-red-800",
  warning: "border-yellow-200 bg-yellow-50 text-yellow-800",
};

export function NotificationProvider({ children }) {
  const [items, setItems] = useState([]);

  const remove = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback((type, message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setItems((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 3500);
  }, [remove]);

  const value = useMemo(() => ({
    success: (message) => notify("success", message),
    error: (message) => notify("error", message),
    warning: (message) => notify("warning", message),
  }), [notify]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-2 w-[min(90vw,360px)]">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg px-4 py-3 shadow-md text-sm ${TYPE_STYLES[item.type]}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span>{item.message}</span>
              <button
                onClick={() => remove(item.id)}
                className="text-xs opacity-70 hover:opacity-100"
                aria-label="Đóng thông báo"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

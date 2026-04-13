"use client";

import Link from "next/link";
import { FiArrowLeft, FiHome } from "react-icons/fi";

export default function AdminReportsPlaceholderPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Báo cáo thống kê</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
          Trang báo cáo chi tiết đang được mở rộng. Hiện tại bạn có thể xem số liệu tổng quan và biểu đồ nhanh trên trang{" "}
          <strong className="text-gray-900 dark:text-white">Tổng quan</strong>.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
          >
            <FiHome className="w-4 h-4" aria-hidden />
            Về tổng quan
          </Link>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <FiArrowLeft className="w-4 h-4" aria-hidden />
            Khóa học
          </Link>
        </div>
      </div>
    </div>
  );
}

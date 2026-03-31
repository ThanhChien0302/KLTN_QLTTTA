"use client";


import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tổng quan</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Chào mừng quay trở lại, <span className="font-semibold text-blue-600">{user?.FullName || "Quản trị viên"}</span>.
          <br />
          Đây là bảng điều khiển trung tâm hệ thống.
        </p>
      </div>

      {/* Có thể thêm các Widget thống kê nhanh ở đây */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200">Học viên mới</h3>
           <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200">Khóa học đang mở</h3>
           <p className="text-3xl font-bold text-green-600 mt-2">0</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
           <h3 className="font-semibold text-gray-700 dark:text-gray-200">Doanh thu tháng</h3>
           <p className="text-3xl font-bold text-purple-600 mt-2">0 ₫</p>
        </div>
      </div>
    </div>
  );
}
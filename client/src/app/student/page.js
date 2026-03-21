"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function StudentDashboard() {
  const { user, loading, isAuthenticated, isStudent } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !isStudent) {
      router.push('/'); // Redirect to login if not authenticated or not student
    }
  }, [loading, isAuthenticated, isStudent, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isStudent) {
    return null; // Không hiển thị gì nếu không có quyền
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Chào mừng đến với hệ thống học tập</h1>
        <p className="text-gray-600 mb-6">Xin chào, {user?.FullName || user?.name}! Chúc bạn có một ngày học tập hiệu quả.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Thẻ Khóa Học Của Tôi */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Khóa Học Của Tôi</h3>
          </div>
          <p className="text-gray-600 mb-4">Xem tổng quan, bài tập, buổi học và yêu cầu nghỉ phép</p>
          <button
            onClick={() => router.push('/student/courses/overview')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Xem chi tiết
          </button>
        </div>

        {/* Thẻ Lịch Học */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Lịch Học</h3>
          </div>
          <p className="text-gray-600 mb-4">Xem lịch học và các buổi học sắp tới</p>
          <button
            onClick={() => router.push('/student/schedule')}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Xem lịch
          </button>
        </div>

        {/* Thẻ Luyện Đề */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Luyện Đề</h3>
          </div>
          <p className="text-gray-600 mb-4">Thực hiện các bài luyện đề để ôn tập</p>
          <button
            onClick={() => router.push('/student/practice-tests')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Bắt đầu luyện
          </button>
        </div>

        {/* Thẻ Luyện Tập */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Luyện Tập</h3>
          </div>
          <p className="text-gray-600 mb-4">Các bài tập và hoạt động luyện tập hàng ngày</p>
          <button
            onClick={() => router.push('/student/practice')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Luyện tập ngay
          </button>
        </div>

        {/* Thẻ Thông Báo */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Thông Báo</h3>
          </div>
          <p className="text-gray-600 mb-4">Xem các thông báo và tin tức từ trung tâm</p>
          <button
            onClick={() => router.push('/student/announcements')}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Xem thông báo
          </button>
        </div>

        {/* Thẻ Thông Tin Cá Nhân */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Thông Tin Cá Nhân</h3>
          </div>
          <p className="text-gray-600 mb-4">Chỉnh sửa thông tin cá nhân và cài đặt tài khoản</p>
          <button
            onClick={() => router.push('/student/profile')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}
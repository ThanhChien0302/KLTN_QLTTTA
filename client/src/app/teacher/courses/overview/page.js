"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function CourseOverview() {
  const { token, isAuthenticated, isTeacher } = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    gradedSubmissions: 0,
    approvedLeaveRequests: 0,
  });
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isTeacher) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [dashboardRes, coursesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/teacher/dashboard`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/teacher/courses`, { headers })
        ]);

        const dashboardData = await dashboardRes.json();
        const coursesData = await coursesRes.json();

        if (dashboardData.success) {
          setStats(dashboardData.stats);
          setUpcomingClasses(dashboardData.upcomingClasses);
        }

        if (coursesData.success) {
          setCourses(coursesData.data);
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu overview:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated, isTeacher]);

  const getDayOfWeek = (dateString) => {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const d = new Date(dateString);
    return days[d.getDay()];
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="ml-3 text-emerald-600 font-medium">Đang tải tổng quan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Tổng Quan Khóa Học</h1>
        <p className="text-gray-500 text-lg">Quản lý và theo dõi thông tin các khóa học đang giảng dạy của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center pb-3 border-b border-gray-100">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              Danh Sách Khóa Học Đang Dạy ({courses.length})
            </h3>

            <div className="space-y-4">
              {courses.length > 0 ? courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white hover:bg-emerald-50 hover:-translate-y-1 hover:shadow-md rounded-xl border border-gray-200 transition-all duration-300 group shadow-sm"
                >
                  <div className="mb-4 sm:mb-0">
                    <p className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{course.name}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                      <p className="text-sm font-medium flex items-center text-gray-500 bg-gray-50 px-2 py-1 rounded-md group-hover:bg-white transition-colors">
                        <svg className="w-4 h-4 mr-1.5 text-gray-400 group-hover:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        {course.studentsText}
                      </p>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${course.status === 'Đang mở' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                      {course.status}
                    </span>
                    <p className="text-xs font-medium text-gray-400 mt-0 sm:mt-2">Khai giảng: <span className="text-gray-600">{course.startDate}</span></p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                  <p className="text-gray-500 font-medium font-lg">Không có khóa học nào đang dạy.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center pb-3 border-b border-gray-100">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              Thống Kê
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <span className="text-gray-600 font-medium group-hover:text-emerald-700 transition-colors">Tổng khóa học</span>
                <span className="font-bold text-lg text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-100">{stats.totalCourses}</span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group">
                <span className="text-gray-600 font-medium group-hover:text-emerald-700 transition-colors">Tổng học viên</span>
                <span className="font-bold text-lg text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-100">{stats.totalStudents}</span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-blue-50 border border-blue-100 hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group" onClick={() => router.push('/teacher')}>
                <span className="text-blue-700 font-medium">Bài tập đã chấm</span>
                <span className="font-bold text-lg text-blue-600 bg-white px-3 py-0.5 rounded-lg border border-blue-200 shadow-sm group-hover:scale-105 transition-transform">{stats.gradedSubmissions}</span>
              </div>
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-purple-50 border border-purple-100 hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group" onClick={() => router.push('/teacher/courses/leave-requests')}>
                <span className="text-purple-700 font-medium">Số lần duyệt đơn</span>
                <span className="font-bold text-lg text-purple-600 bg-white px-3 py-0.5 rounded-lg border border-purple-200 shadow-sm group-hover:scale-105 transition-transform">{stats.approvedLeaveRequests}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center pb-3 border-b border-gray-100">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Lịch Dạy Sắp Tới
            </h3>
            <div className="space-y-4">
              {upcomingClasses.length > 0 ? upcomingClasses.slice(0, 3).map(cls => (
                <div key={cls._id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:border-emerald-300 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs tracking-wide uppercase">{getDayOfWeek(cls.ngayhoc)}</span>
                    <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-700">
                      {formatTime(cls.giobatdau)} - {formatTime(cls.gioketthuc)}
                    </span>
                  </div>
                  <p className="text-base font-bold text-gray-800 truncate leading-tight mt-2">{cls.KhoaHocID?.tenkhoahoc || "N/A"}</p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">
                      Phòng: <span className="text-emerald-700 font-bold">{cls.phonghoc?.TenPhong || "N/A"}</span>
                    </p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Không có lịch học nào tuần này.</p>
                </div>
              )}
              {upcomingClasses.length > 3 && (
                <div className="text-center pt-2">
                  <button onClick={() => router.push('/teacher/schedule')} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline">
                    Xem tất cả lịch học &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
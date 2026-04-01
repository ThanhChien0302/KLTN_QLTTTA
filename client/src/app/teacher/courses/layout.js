"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function CoursesLayout({ children }) {
  const [courseName, setCourseName] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkCourseSelection = () => {
      // Bỏ qua trang quản lý nghỉ phép
      if (pathname.includes('/leave-requests')) {
        setIsChecking(false);
        return;
      }

      const storedCourseId = localStorage.getItem("selectedCourseId");
      const storedCourseName = localStorage.getItem("selectedCourseName");

      if (!storedCourseId) {
        // Chưa chọn khóa học -> bắt buộc chọn
        router.replace(`/teacher/selectkhoahoc?redirect=${pathname}`);
      } else {
        setCourseName(storedCourseName || "Khóa học đã chọn");
        setIsChecking(false);
      }
    };

    checkCourseSelection();
  }, [pathname, router]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu là trang nghỉ phép thì trả về children luôn
  if (pathname.includes('/leave-requests')) {
    return <>{children}</>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex justify-between items-center shadow-sm">
        <div>
          <span className="text-gray-600 text-sm">Đang làm việc tại khóa học:</span>
          <h2 className="text-xl font-bold text-blue-800">{courseName}</h2>
        </div>
        <Link 
          href={`/teacher/selectkhoahoc?redirect=${pathname}`}
          className="px-4 py-2 bg-white border border-blue-300 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Đổi khóa học
        </Link>
      </div>
      
      {/* Nội dung trang quản lý học viên/bài học... */}
      <div>{children}</div>
    </div>
  );
}

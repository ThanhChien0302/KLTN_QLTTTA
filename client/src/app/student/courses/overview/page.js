"use client";

export default function CourseOverview() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tổng Quan Khóa Học</h1>
        <p className="text-gray-600">Xem tổng quan về các khóa học của bạn</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Khóa Học Đang Học</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Tiếng Anh Cơ Bản</p>
                <p className="text-sm text-gray-600">Tiến độ: 75%</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Tiếng Anh Giao Tiếp</p>
                <p className="text-sm text-gray-600">Tiến độ: 45%</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-7 h-2 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống Kê</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng số khóa học:</span>
              <span className="font-semibold">2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bài tập đã hoàn thành:</span>
              <span className="font-semibold">15/20</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm trung bình:</span>
              <span className="font-semibold">8.5/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
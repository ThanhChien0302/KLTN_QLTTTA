"use client";

export default function CourseOverview() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Tổng Quan Khóa Học</h1>
        <p className="text-gray-600">Quản lý và theo dõi các khóa học đang giảng dạy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Khóa Học Đang Dạy</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Tiếng Anh Cơ Bản</p>
                <p className="text-sm text-gray-600">Lớp: A101 - 25 học viên</p>
                <p className="text-sm text-gray-600">Tiến độ: 75%</p>
              </div>
              <div className="w-16 h-2 bg-gray-200 rounded-full">
                <div className="w-12 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Tiếng Anh Giao Tiếp</p>
                <p className="text-sm text-gray-600">Lớp: B202 - 20 học viên</p>
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
              <span className="text-gray-600">Tổng số học viên:</span>
              <span className="font-semibold">45</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bài tập đã chấm:</span>
              <span className="font-semibold">32/40</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Đánh giá trung bình:</span>
              <span className="font-semibold">4.2/5</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch Học Tuần Này</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-600">Thứ 3</span>
              <span className="text-sm text-gray-500">14:00-15:30</span>
            </div>
            <p className="text-sm text-gray-600">Tiếng Anh Cơ Bản - Lớp A101</p>
            <p className="text-sm text-gray-600">Phòng 201</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-green-600">Thứ 5</span>
              <span className="text-sm text-gray-500">16:00-17:30</span>
            </div>
            <p className="text-sm text-gray-600">Tiếng Anh Giao Tiếp - Lớp B202</p>
            <p className="text-sm text-gray-600">Phòng 305</p>
          </div>
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-purple-600">Thứ 7</span>
              <span className="text-sm text-gray-500">09:00-10:30</span>
            </div>
            <p className="text-sm text-gray-600">Tiếng Anh Cơ Bản - Lớp A101</p>
            <p className="text-sm text-gray-600">Phòng 201</p>
          </div>
        </div>
      </div>
    </div>
  );
}
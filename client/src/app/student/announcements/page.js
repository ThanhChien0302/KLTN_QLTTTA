"use client";

export default function Announcements() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Thông Báo</h1>
        <p className="text-gray-600">Xem các thông báo và tin tức từ trung tâm</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium mr-3">
                  Quan trọng
                </span>
                <span className="text-sm text-gray-500">15/12/2024</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Thông báo nghỉ lễ Giáng sinh và Năm mới 2025
              </h3>
              <p className="text-gray-600 mb-4">
                Trung tâm sẽ nghỉ lễ từ ngày 24/12/2024 đến 02/01/2025. Các lớp học sẽ được bù vào tuần sau.
                Vui lòng theo dõi lịch học được cập nhật trên hệ thống.
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Chưa đọc
              </span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Đọc thêm
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mr-3">
                  Thông báo
                </span>
                <span className="text-sm text-gray-500">10/12/2024</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Kết quả bài kiểm tra giữa kỳ Unit 1-5
              </h3>
              <p className="text-gray-600 mb-4">
                Kết quả bài kiểm tra giữa kỳ đã được cập nhật. Học viên có thể xem điểm số và nhận xét
                chi tiết trong mục "Bài tập" của từng khóa học.
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã đọc
              </span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Đọc thêm
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium mr-3">
                  Sự kiện
                </span>
                <span className="text-sm text-gray-500">05/12/2024</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Workshop: Kỹ năng giao tiếp tiếng Anh trong công việc
              </h3>
              <p className="text-gray-600 mb-4">
                Trung tâm tổ chức workshop miễn phí về kỹ năng giao tiếp tiếng Anh trong môi trường làm việc.
                Thời gian: 20/12/2024, 14:00-16:00. Đăng ký trước ngày 15/12/2024.
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã đọc
              </span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Đọc thêm
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mr-3">
                  Cập nhật
                </span>
                <span className="text-sm text-gray-500">01/12/2024</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Cập nhật tính năng mới: Luyện tập trực tuyến
              </h3>
              <p className="text-gray-600 mb-4">
                Hệ thống đã được cập nhật với tính năng luyện tập trực tuyến mới. Học viên có thể thực hiện
                các bài tập tương tác ngay trên nền tảng mà không cần tải xuống.
              </p>
            </div>
            <div className="ml-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Đã đọc
              </span>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Đọc thêm
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê thông báo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-600">Tổng số thông báo</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">3</div>
            <div className="text-sm text-gray-600">Chưa đọc</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">9</div>
            <div className="text-sm text-gray-600">Đã đọc</div>
          </div>
        </div>
      </div>
    </div>
  );
}
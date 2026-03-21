"use client";

export default function Lessons() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Buổi Học</h1>
        <p className="text-gray-600">Xem các buổi học và tài liệu học tập</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Unit 5: Thì hiện tại hoàn thành</h3>
              <p className="text-gray-600">Khóa học: Tiếng Anh Cơ Bản</p>
              <p className="text-sm text-gray-500">Ngày học: 15/12/2024</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Đã học
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
              Xem tài liệu
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
              Xem video
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Unit 6: Thì quá khứ đơn</h3>
              <p className="text-gray-600">Khóa học: Tiếng Anh Cơ Bản</p>
              <p className="text-sm text-gray-500">Ngày học: 22/12/2024</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Sắp học
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
              Xem trước
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Bài học giao tiếp: Mô tả người</h3>
              <p className="text-gray-600">Khóa học: Tiếng Anh Giao Tiếp</p>
              <p className="text-sm text-gray-500">Ngày học: 18/12/2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Đã học
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
              Xem tài liệu
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
              Xem video
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors text-sm">
              Luyện tập
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
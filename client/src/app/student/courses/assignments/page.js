"use client";

export default function Assignments() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Bài Tập</h1>
        <p className="text-gray-600">Xem và hoàn thành các bài tập của bạn</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Bài tập ngữ pháp Unit 5</h3>
              <p className="text-gray-600">Khóa học: Tiếng Anh Cơ Bản</p>
              <p className="text-sm text-gray-500">Hạn nộp: 25/12/2024</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
              Chưa hoàn thành
            </span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Làm bài
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Bài tập nghe Unit 3</h3>
              <p className="text-gray-600">Khóa học: Tiếng Anh Giao Tiếp</p>
              <p className="text-sm text-gray-500">Hạn nộp: 20/12/2024</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Đã hoàn thành
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Điểm: 9/10</span>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Xem lại
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Bài tập từ vựng Unit 7</h3>
              <p className="text-gray-600">Khóa học: Tiếng Anh Cơ Bản</p>
              <p className="text-sm text-gray-500">Hạn nộp: 30/12/2024</p>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
              Quá hạn
            </span>
          </div>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors">
            Nộp muộn
          </button>
        </div>
      </div>
    </div>
  );
}
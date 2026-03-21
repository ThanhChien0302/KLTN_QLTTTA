"use client";

export default function Practice() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Luyện Tập</h1>
        <p className="text-gray-600">Các bài tập và hoạt động luyện tập hàng ngày</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bài Tập Hàng Ngày</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Luyện phát âm</p>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Mới</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Luyện phát âm các từ vựng Unit 6</p>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Bắt đầu luyện
              </button>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Bài tập ngữ pháp</p>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Tiếp tục</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Hoàn thành: 15/20 câu</p>
              <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                Tiếp tục
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Luyện nghe</p>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Đã hoàn thành</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Điểm: 8.5/10</p>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                Luyện lại
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống Kê Luyện Tập</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày luyện tập liên tiếp:</span>
              <span className="font-semibold text-green-600">7 ngày</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng thời gian luyện tập:</span>
              <span className="font-semibold">24 giờ 30 phút</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Bài tập đã hoàn thành:</span>
              <span className="font-semibold">45 bài</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Điểm trung bình:</span>
              <span className="font-semibold">8.7/10</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Chủ Đề Luyện Tập</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">📝</div>
            <p className="font-medium text-gray-800">Ngữ Pháp</p>
            <p className="text-sm text-gray-600">15 bài tập</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">🎧</div>
            <p className="font-medium text-gray-800">Luyện Nghe</p>
            <p className="text-sm text-gray-600">8 bài tập</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">🗣️</div>
            <p className="font-medium text-gray-800">Giao Tiếp</p>
            <p className="text-sm text-gray-600">12 bài tập</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg text-center hover:bg-orange-100 transition-colors cursor-pointer">
            <div className="text-2xl mb-2">📚</div>
            <p className="font-medium text-gray-800">Từ Vựng</p>
            <p className="text-sm text-gray-600">20 bài tập</p>
          </div>
        </div>
      </div>
    </div>
  );
}
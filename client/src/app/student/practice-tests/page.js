"use client";

export default function PracticeTests() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Luyện Đề</h1>
        <p className="text-gray-600">Thực hiện các bài luyện đề để ôn tập và kiểm tra kiến thức</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Đề Thi Giữa Kỳ</h3>
          </div>
          <p className="text-gray-600 mb-4">Bài thi giữa kỳ môn Tiếng Anh Cơ Bản</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Thời gian: 60 phút</span>
            <span className="text-sm text-gray-600">Câu hỏi: 50</span>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
            Bắt Đầu Thi
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Đề Ôn Tập Unit 1-5</h3>
          </div>
          <p className="text-gray-600 mb-4">Ôn tập kiến thức từ Unit 1 đến Unit 5</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Thời gian: 45 phút</span>
            <span className="text-sm text-gray-600">Câu hỏi: 30</span>
          </div>
          <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
            Bắt Đầu Luyện
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 ml-4">Bài Kiểm Tra Nghe</h3>
          </div>
          <p className="text-gray-600 mb-4">Luyện kỹ năng nghe hiểu</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">Thời gian: 30 phút</span>
            <span className="text-sm text-gray-600">Câu hỏi: 20</span>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors">
            Bắt Đầu
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết Quả Gần Đây</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Đề Ôn Tập Unit 1-3</p>
              <p className="text-sm text-gray-600">Hoàn thành: 15/12/2024</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">8.5/10</p>
              <p className="text-sm text-gray-600">85%</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Bài Kiểm Tra Từ Vựng</p>
              <p className="text-sm text-gray-600">Hoàn thành: 10/12/2024</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-blue-600">9.2/10</p>
              <p className="text-sm text-gray-600">92%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

export default function Schedule() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lịch Học</h1>
        <p className="text-gray-600">Xem lịch học và các buổi học sắp tới</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch Học Hôm Nay</h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Tiếng Anh Cơ Bản - Unit 6</p>
                  <p className="text-sm text-gray-600">Thời gian: 14:00 - 15:30</p>
                  <p className="text-sm text-gray-600">Phòng: A101</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                  Sắp học
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch Học Tuần Này</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="font-medium">Thứ 3: Tiếng Anh Cơ Bản</p>
                <p className="text-sm text-gray-600">14:00 - 15:30</p>
              </div>
              <span className="text-sm text-green-600">✓</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="font-medium">Thứ 5: Tiếng Anh Giao Tiếp</p>
                <p className="text-sm text-gray-600">16:00 - 17:30</p>
              </div>
              <span className="text-sm text-yellow-600">Chưa học</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="font-medium">Thứ 7: Tiếng Anh Cơ Bản</p>
                <p className="text-sm text-gray-600">09:00 - 10:30</p>
              </div>
              <span className="text-sm text-gray-400">-</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch Học Tháng 12</h3>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-600 text-sm">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const hasClass = [5, 12, 19, 26].includes(day); // Ví dụ các ngày có lớp
            return (
              <div
                key={day}
                className={`p-2 text-center text-sm rounded-lg ${
                  hasClass
                    ? 'bg-blue-100 text-blue-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
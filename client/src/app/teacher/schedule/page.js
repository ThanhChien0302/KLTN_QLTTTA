"use client";

export default function Schedule() {
  const scheduleData = [
    {
      day: "Thứ 2",
      date: "22/01/2024",
      classes: [
        {
          time: "09:00 - 10:30",
          course: "Tiếng Anh Cơ Bản",
          classroom: "Phòng 101",
          students: 25,
          status: "upcoming"
        },
        {
          time: "14:00 - 15:30",
          course: "Tiếng Anh Trung Cấp",
          classroom: "Phòng 203",
          students: 20,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Thứ 3",
      date: "23/01/2024",
      classes: [
        {
          time: "10:00 - 11:30",
          course: "Tiếng Anh Cơ Bản",
          classroom: "Phòng 101",
          students: 25,
          status: "upcoming"
        },
        {
          time: "16:00 - 17:30",
          course: "Tiếng Anh Giao Tiếp",
          classroom: "Phòng 305",
          students: 18,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Thứ 4",
      date: "24/01/2024",
      classes: [
        {
          time: "09:00 - 10:30",
          course: "Tiếng Anh Trung Cấp",
          classroom: "Phòng 203",
          students: 20,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Thứ 5",
      date: "25/01/2024",
      classes: [
        {
          time: "14:00 - 15:30",
          course: "Tiếng Anh Cơ Bản",
          classroom: "Phòng 101",
          students: 25,
          status: "upcoming"
        },
        {
          time: "16:00 - 17:30",
          course: "Tiếng Anh Giao Tiếp",
          classroom: "Phòng 305",
          students: 18,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Thứ 6",
      date: "26/01/2024",
      classes: [
        {
          time: "10:00 - 11:30",
          course: "Tiếng Anh Trung Cấp",
          classroom: "Phòng 203",
          students: 20,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Thứ 7",
      date: "27/01/2024",
      classes: [
        {
          time: "09:00 - 10:30",
          course: "Ôn Tập Cuối Kỳ",
          classroom: "Phòng 101",
          students: 22,
          status: "upcoming"
        }
      ]
    },
    {
      day: "Chủ Nhật",
      date: "28/01/2024",
      classes: []
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp tới';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Lịch Dạy Học</h1>
            <p className="text-gray-600">Xem và quản lý lịch giảng dạy hàng tuần</p>
          </div>
          <div className="flex space-x-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + Thêm lịch học
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Xuất lịch
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Lịch học tuần này</h3>
            </div>

            <div className="divide-y divide-gray-200">
              {scheduleData.map((daySchedule, index) => (
                <div key={index} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {daySchedule.day} - {daySchedule.date}
                    </h4>
                    <span className="text-sm text-gray-600">
                      {daySchedule.classes.length} lớp học
                    </span>
                  </div>

                  {daySchedule.classes.length > 0 ? (
                    <div className="space-y-3">
                      {daySchedule.classes.map((classItem, classIndex) => (
                        <div key={classIndex} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h5 className="text-lg font-semibold text-gray-900 mb-1">
                                {classItem.course}
                              </h5>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {classItem.time}
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  {classItem.classroom}
                                </span>
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                  </svg>
                                  {classItem.students} học viên
                                </span>
                              </div>
                            </div>
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(classItem.status)}`}>
                              {getStatusText(classItem.status)}
                            </span>
                          </div>

                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                              Xem chi tiết
                            </button>
                            <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                              Điểm danh
                            </button>
                            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                              Chỉnh sửa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Không có lớp học nào trong ngày này</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê tuần này</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số lớp:</span>
                <span className="font-semibold">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số giờ:</span>
                <span className="font-semibold">12 giờ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng học viên:</span>
                <span className="font-semibold">148</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số khóa học:</span>
                <span className="font-semibold">4</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch học hôm nay</h3>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Tiếng Anh Cơ Bản</h4>
                <p className="text-sm text-gray-600">09:00 - 10:30 • Phòng 101</p>
                <p className="text-sm text-gray-600">25 học viên</p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Tiếng Anh Trung Cấp</h4>
                <p className="text-sm text-gray-600">14:00 - 15:30 • Phòng 203</p>
                <p className="text-sm text-gray-600">20 học viên</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lịch học sắp tới</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Tiếng Anh Giao Tiếp</div>
                  <div className="text-xs text-gray-500">Hôm nay • 16:00</div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Sắp tới
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Tiếng Anh Cơ Bản</div>
                  <div className="text-xs text-gray-500">23/01 • 10:00</div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Sắp tới
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">Ôn Tập Cuối Kỳ</div>
                  <div className="text-xs text-gray-500">27/01 • 09:00</div>
                </div>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  Sắp tới
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phòng học thường dùng</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Phòng 101</span>
                <span className="font-semibold">3 lớp</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phòng 203</span>
                <span className="font-semibold">2 lớp</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phòng 305</span>
                <span className="font-semibold">2 lớp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
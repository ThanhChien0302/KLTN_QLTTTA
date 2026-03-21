"use client";

export default function Announcements() {
  const announcements = [
    {
      id: 1,
      title: "Thông báo nghỉ lễ Tết Nguyên Đán",
      content: "Trung tâm sẽ nghỉ từ ngày 08/02/2024 đến 14/02/2024 nhân dịp Tết Nguyên Đán. Các lớp học sẽ được bù vào tuần sau.",
      type: "general",
      priority: "high",
      targetAudience: "all",
      publishedDate: "2024-01-15",
      publishedBy: "Admin",
      status: "published",
      views: 245,
      likes: 12
    },
    {
      id: 2,
      title: "Bài kiểm tra giữa kỳ - Tiếng Anh Cơ Bản",
      content: "Bài kiểm tra giữa kỳ sẽ diễn ra vào ngày 25/01/2024. Học viên vui lòng ôn tập từ Unit 1 đến Unit 3.",
      type: "academic",
      priority: "medium",
      targetAudience: "Tiếng Anh Cơ Bản",
      publishedDate: "2024-01-18",
      publishedBy: "Nguyễn Văn Tèo",
      status: "published",
      views: 89,
      likes: 5
    },
    {
      id: 3,
      title: "Thay đổi lịch học tuần này",
      content: "Lớp Tiếng Anh Trung Cấp ngày 24/01 sẽ chuyển từ 14:00 sang 16:00 do trùng lịch với sự kiện của trường.",
      type: "schedule",
      priority: "high",
      targetAudience: "Tiếng Anh Trung Cấp",
      publishedDate: "2024-01-20",
      publishedBy: "Trần Thị Lan",
      status: "published",
      views: 67,
      likes: 3
    },
    {
      id: 4,
      title: "Khảo sát chất lượng giảng dạy",
      content: "Vui lòng tham gia khảo sát chất lượng giảng dạy để chúng tôi cải thiện dịch vụ tốt hơn.",
      type: "survey",
      priority: "low",
      targetAudience: "all",
      publishedDate: "2024-01-22",
      publishedBy: "Admin",
      status: "draft",
      views: 0,
      likes: 0
    }
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'academic':
        return 'bg-green-100 text-green-800';
      case 'schedule':
        return 'bg-purple-100 text-purple-800';
      case 'survey':
        return 'bg-orange-100 text-orange-800';
      case 'event':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'general':
        return 'Thông báo chung';
      case 'academic':
        return 'Học thuật';
      case 'schedule':
        return 'Lịch học';
      case 'survey':
        return 'Khảo sát';
      case 'event':
        return 'Sự kiện';
      default:
        return type;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case 'high':
        return 'Cao';
      case 'medium':
        return 'Trung bình';
      case 'low':
        return 'Thấp';
      default:
        return priority;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Đã đăng';
      case 'draft':
        return 'Bản nháp';
      case 'scheduled':
        return 'Đã lên lịch';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Thông Báo</h1>
            <p className="text-gray-600">Tạo và quản lý các thông báo cho học viên</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            + Tạo thông báo mới
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">3</div>
            <div className="text-sm text-gray-600">Đã đăng</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600 mb-2">1</div>
            <div className="text-sm text-gray-600">Bản nháp</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">401</div>
            <div className="text-sm text-gray-600">Lượt xem</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">20</div>
            <div className="text-sm text-gray-600">Lượt thích</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Danh sách thông báo</h3>
            <div className="flex space-x-2">
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Tất cả loại</option>
                <option>Thông báo chung</option>
                <option>Học thuật</option>
                <option>Lịch học</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                <option>Tất cả trạng thái</option>
                <option>Đã đăng</option>
                <option>Bản nháp</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(announcement.type)}`}>
                      {getTypeText(announcement.type)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(announcement.priority)}`}>
                      {getPriorityText(announcement.priority)}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3 line-clamp-2">{announcement.content}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Đối tượng:</span> {announcement.targetAudience}
                    </div>
                    <div>
                      <span className="font-medium">Người đăng:</span> {announcement.publishedBy}
                    </div>
                    <div>
                      <span className="font-medium">Ngày đăng:</span> {announcement.publishedDate}
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col items-end space-y-2">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(announcement.status)}`}>
                    {getStatusText(announcement.status)}
                  </span>

                  {announcement.status === 'published' && (
                    <div className="text-xs text-gray-500 text-right">
                      <div>{announcement.views} lượt xem</div>
                      <div>{announcement.likes} lượt thích</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                    Xem chi tiết
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                    Chỉnh sửa
                  </button>
                  {announcement.status === 'draft' && (
                    <button className="text-green-600 hover:text-green-900 text-sm font-medium">
                      Đăng ngay
                    </button>
                  )}
                  <button className="text-red-600 hover:text-red-900 text-sm font-medium">
                    Xóa
                  </button>
                </div>

                <div className="flex space-x-2">
                  <button className="text-gray-600 hover:text-gray-900 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </button>
                  <button className="text-gray-600 hover:text-gray-900 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M5 12h.01M5 12h.01M12 12h.01M12 12h.01M12 12h.01M19 12h.01M19 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thống kê theo loại</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Thông báo chung:</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Học thuật:</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lịch học:</span>
              <span className="font-semibold">1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Khảo sát:</span>
              <span className="font-semibold">1</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông báo gần đây</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Thay đổi lịch học tuần này</div>
                <div className="text-xs text-gray-500">20/01/2024 • Trần Thị Lan</div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Đã đăng
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Bài kiểm tra giữa kỳ</div>
                <div className="text-xs text-gray-500">18/01/2024 • Nguyễn Văn Tèo</div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Đã đăng
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">Thông báo nghỉ lễ</div>
                <div className="text-xs text-gray-500">15/01/2024 • Admin</div>
              </div>
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Đã đăng
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
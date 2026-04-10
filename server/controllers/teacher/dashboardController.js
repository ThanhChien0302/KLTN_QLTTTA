const GiangVien = require("../../models/GiangVien");
const KhoaHoc = require("../../models/KhoaHoc");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc");
const ThamGiaBuoiHoc = require("../../models/ThamGiaBuoiHoc");
const NopBai = require("../../models/NopBai");
const BuoiHoc = require("../../models/BuoiHoc");
const BaiTap = require("../../models/BaiTap");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Tìm thông tin giảng viên theo user._id
    let teacher = await GiangVien.findOne({ userId });
    if (!teacher) {
      teacher = new GiangVien({ userId });
      await teacher.save();
    }

    // 2. Lấy danh sách khóa học đang dạy
    const courses = await KhoaHoc.find({ giangvien: teacher._id }).select("_id tenkhoahoc");
    const courseIds = courses.map((c) => c._id);

    // Tính tổng số khóa học
    const totalCourses = courses.length;

    // Tính tổng số học viên (theo đăng ký)
    const totalStudents = await DangKyKhoaHoc.countDocuments({ KhoaHocID: { $in: courseIds } });

    // 3. Số bài tập chờ chấm và chi tiết
    const baiTaps = await BaiTap.find({ khoahocID: { $in: courseIds } }).select("_id tieude khoahocID");
    const baiTapIds = baiTaps.map((bt) => bt._id);
    
    const pendingDetailsAgg = await NopBai.aggregate([
      { 
        $match: { 
          baitapID: { $in: baiTapIds },
          trangthai: "chờ chấm"
        }
      },
      {
        $group: {
          _id: "$baitapID",
          count: { $sum: 1 }
        }
      }
    ]);

    const pendingAssignmentsDetail = [];
    let pendingSubmissions = 0;

    for (const item of pendingDetailsAgg) {
      pendingSubmissions += item.count;
      const bt = await BaiTap.findById(item._id).populate('khoahocID', 'tenkhoahoc');
      if (bt) {
        pendingAssignmentsDetail.push({
          assignmentId: item._id,
          assignmentTitle: bt.tieude,
          courseName: bt.khoahocID ? bt.khoahocID.tenkhoahoc : "Không xác định",
          pendingCount: item.count
        });
      }
    }

    // 4. Số đơn xin nghỉ pending
    const dangkys = await DangKyKhoaHoc.find({ KhoaHocID: { $in: courseIds } }).select("_id");
    const dangkyIds = dangkys.map(dk => dk._id);
    const pendingLeaveRequests = await ThamGiaBuoiHoc.countDocuments({
      dangkykhoahocID: { $in: dangkyIds },
      trangthai_duyet: "pending",
      loai_don: { $exists: true }
    });

    // 5. Lịch dạy sắp tới (5 buổi tiếp theo)
    const today = new Date();
    // Reset phần time để query lấy nguyên ngày hôm nay trở đi
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));

    const upcomingClasses = await BuoiHoc.find({
      KhoaHocID: { $in: courseIds },
      ngayhoc: { $gte: startOfToday }
    })
      .populate('KhoaHocID', 'tenkhoahoc')
      .populate('phonghoc', 'TenPhong') // Assuming PhongHoc has TenPhong
      .sort({ ngayhoc: 1, giobatdau: 1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalCourses,
        totalStudents,
        pendingSubmissions,
        pendingLeaveRequests,
        pendingAssignmentsDetail
      },
      upcomingClasses
    });
  } catch (error) {
    console.error("Lỗi get dashboard stats:", error);
    res.status(500).json({ success: false, message: "Lỗi Server" });
  }
};

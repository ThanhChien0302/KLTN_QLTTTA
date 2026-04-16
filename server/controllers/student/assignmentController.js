const mongoose = require("mongoose");
const NopBai = require("../../models/NopBai");
const BaiTap = require("../../models/BaiTap");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc");
const HocVien = require("../../models/HocVien");
const FileModel = require("../../models/File");

exports.getAssignmentsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Course ID không hợp lệ." });
    }

    const student = await HocVien.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Không tìm thấy học viên." });
    }

    const enrollment = await DangKyKhoaHoc.findOne({ KhoaHocID: courseId, hocvienId: student._id });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Học viên chưa đăng ký khóa học này." });
    }

    const assignments = await BaiTap.find({ khoahocID: courseId }).sort({ hannop: 1 }).populate('file');
    
    // Check submissions for this student in this course
    const submissions = await NopBai.find({ dangkykhoahocID: enrollment._id });
    const submissionMap = {};
    submissions.forEach(sub => {
      submissionMap[sub.baitapID.toString()] = sub;
    });

    const result = assignments.map(hw => {
      const sub = submissionMap[hw._id.toString()];
      return {
        _id: hw._id,
        tieude: hw.tieude,
        mota: hw.mota,
        hannop: hw.hannop,
        diemToiDa: hw.diem,
        loai: hw.loai,
        trangthai: sub ? sub.trangthai : "chưa nộp", 
        diemDatDuoc: sub ? sub.diem : null,
        nopBaiId: sub ? sub._id : null
      };
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Lỗi lấy danh sách bài tập by course:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

exports.getAssignmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Assignment ID không hợp lệ." });
    }

    const assignment = await BaiTap.findById(id).populate("file").populate("khoahocID", "tenkhoahoc");
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài tập." });
    }

    const student = await HocVien.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Không tìm thấy học viên." });
    }

    const enrollment = await DangKyKhoaHoc.findOne({ KhoaHocID: assignment.khoahocID._id, hocvienId: student._id });
    if (!enrollment) {
       return res.status(403).json({ success: false, message: "Bạn không thuộc khóa học của bài tập này." });
    }

    const submission = await NopBai.findOne({
      baitapID: id,
      dangkykhoahocID: enrollment._id
    }).populate("filenop").populate("filedapan");

    res.status(200).json({
      success: true,
      data: {
        assignment,
        submission
      }
    });
  } catch (error) {
    console.error("Lỗi chi tiết bài tập:", error);
    res.status(500).json({ success: false, message: "Lỗi server." });
  }
};

exports.submitAssignment = async (req, res) => {
  try {
    const { baitapID } = req.body;

    if (!mongoose.Types.ObjectId.isValid(baitapID)) {
      return res.status(400).json({ success: false, message: "Bài tập ID không hợp lệ" });
    }

    const assignment = await BaiTap.findById(baitapID);
    if (!assignment) {
      return res.status(404).json({ success: false, message: "Không tìm thấy bài tập." });
    }

    const student = await HocVien.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Không tìm thấy học viên." });
    }

    const enrollment = await DangKyKhoaHoc.findOne({ KhoaHocID: assignment.khoahocID, hocvienId: student._id });
    if (!enrollment) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền nộp bài cho khóa học này." });
    }

    let fileId = null;
    if (req.file) {
      const originalName = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
      const newFile = await FileModel.create({
        url: "/uploads/" + req.file.filename,
        originalName: originalName,
        type: req.file.mimetype,
        size: req.file.size
      });
      fileId = newFile._id;
    }

    let submission = await NopBai.findOne({
      baitapID,
      dangkykhoahocID: enrollment._id
    });

    if (submission) {
      // Đã có thì cập nhật lại file
      // Xóa file cũ nếu cần (optional)
      if (submission.filenop && fileId) {
        await FileModel.findByIdAndDelete(submission.filenop);
      }
      if (fileId) submission.filenop = fileId;
      submission.thoigian = new Date();
      submission.trangthai = "chờ chấm";
      await submission.save();

      // ==========================================
      // GỬI THÔNG BÁO CHO GIẢNG VIÊN (KHI CẬP NHẬT)
      // ==========================================
      try {
        const course = await mongoose.model("KhoaHoc").findById(assignment.khoahocID);
        if (course && course.giangvien) {
          const teacher = await mongoose.model("GiangVien").findById(course.giangvien);
          if (teacher && teacher.userId) {
            const ThongBao = mongoose.model("ThongBao");
            const timeString = submission.thoigian.toLocaleString('vi-VN', { 
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' 
            });
            await ThongBao.create({
              tieuDe: 'Học viên cập nhật bài nộp',
              noidung: `Học viên ${student.userId?.hovaten || 'Một học viên'} vừa cập nhật bài tập "${assignment.tieude}" thuộc khóa học ${course.tenkhoahoc} vào lúc ${timeString}.`,
              targetType: 'assignment_submit',
              khoaHocId: course._id,
              userID: [teacher.userId],
              createdBy: req.user._id,
              link: `/teacher/courses/grade-ass?id=${assignment._id}&submissionId=${submission._id}`
            });
          }
        }
      } catch (err) {
        console.error("Lỗi gửi thông báo cập nhật nộp bài:", err);
      }
    } else {
      submission = await NopBai.create({
        baitapID,
        dangkykhoahocID: enrollment._id,
        filenop: fileId,
        thoigian: new Date(),
        trangthai: "chờ chấm"
      });
    }

    // Populate the newly uploaded file to return
    submission = await NopBai.findById(submission._id).populate("filenop");

    res.status(200).json({
      success: true,
      message: "Nộp bài thành công!",
      data: submission
    });
  } catch (error) {
    console.error("Lỗi khi nộp bài:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

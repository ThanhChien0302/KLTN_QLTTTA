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
      await submission.save(); // save sẽ trigger hook notify (trong NopBai có xử lý notify cho cả update k? => Hook của Mongoose NopBai hiện chỉ trigger notify cho wasNew. Để update notify thì cần chỉnh hook hoặc tự gửi ở đây. Tạm thời Mongoose hook được viết hỗ trợ wasNew)
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

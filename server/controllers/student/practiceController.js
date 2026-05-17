const LuyenTap = require('../../models/LuyenTap');
const LuyenTapItem = require('../../models/LuyenTapItem');
const DangKyKhoaHoc = require('../../models/DangKyKhoaHoc');
const HocVien = require('../../models/HocVien');
const KetQuaLuyenTap = require('../../models/KetQuaLuyenTap');

// Lấy danh sách các bài luyện tập, chỉ thuộc các khóa học mà học viên đã đăng ký
exports.getPracticeList = async (req, res) => {
  try {
    const student = await HocVien.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ success: false, message: "Không tìm thấy học viên" });
    }
    const hocvienId = student._id;

    // Lấy danh sách khóa học mà học viên tham gia
    const dangKyKhoaHocs = await DangKyKhoaHoc.find({ hocvienId }).select('KhoaHocID');
    const khoaHocIds = dangKyKhoaHocs.map((dk) => dk.KhoaHocID);

    // Lấy bài luyện tập thuộc các khóa học này
    const practiceList = await LuyenTap.find({ $or: [{ khoaHocID: { $in: khoaHocIds } }, { khoaHocID: null }] })
      .populate('khoaHocID', 'tenKhoaHoc')
      .sort({ createdAt: -1 })
      .lean();

    // Lấy kết quả luyện tập của học viên
    const ketQuaList = await KetQuaLuyenTap.find({ userId: req.user._id }).lean();
    const ketQuaMap = {};
    ketQuaList.forEach(kq => {
      ketQuaMap[kq.luyenTapID.toString()] = kq;
    });

    // Gắn kết quả vào danh sách
    const practiceListWithResults = practiceList.map(practice => {
      return {
        ...practice,
        ketQua: ketQuaMap[practice._id.toString()] || null
      };
    });

    res.status(200).json(practiceListWithResults);
  } catch (error) {
    console.error('Error in getPracticeList:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy danh sách luyện tập' });
  }
};

// Lấy chi tiết 1 bài luyện tập và các câu hỏi bên trong
exports.getPracticeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const luyenTap = await LuyenTap.findById(id).populate('khoaHocID', 'tenKhoaHoc');

    if (!luyenTap) {
      return res.status(404).json({ message: 'Không tìm thấy bài luyện tập' });
    }

    const items = await LuyenTapItem.find({ luyenTapID: id }).sort({ thuTu: 1 });

    res.status(200).json({ luyenTap, items });
  } catch (error) {
    console.error('Error in getPracticeDetail:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy chi tiết luyện tập' });
  }
};

// Nộp bài luyện tập và lưu kết quả
exports.submitPracticeResult = async (req, res) => {
  try {
    const { id } = req.params; // luyenTapID
    const { soCauDung, tongSoCau } = req.body;

    // Tìm xem đã có kết quả chưa
    let ketQua = await KetQuaLuyenTap.findOne({ userId: req.user._id, luyenTapID: id });

    if (ketQua) {
      // Nếu đã có, kiểm tra nếu điểm mới cao hơn thì cập nhật (hoặc bạn có thể lưu đè)
      // Ở đây sẽ lưu đè kết quả mới nhất
      ketQua.soCauDung = soCauDung;
      ketQua.tongSoCau = tongSoCau;
      await ketQua.save();
    } else {
      // Nếu chưa có thì tạo mới
      ketQua = new KetQuaLuyenTap({
        userId: req.user._id,
        luyenTapID: id,
        soCauDung,
        tongSoCau
      });
      await ketQua.save();
    }

    res.status(200).json({ success: true, ketQua });
  } catch (error) {
    console.error('Error in submitPracticeResult:', error);
    res.status(500).json({ message: 'Lỗi server khi lưu kết quả luyện tập' });
  }
};

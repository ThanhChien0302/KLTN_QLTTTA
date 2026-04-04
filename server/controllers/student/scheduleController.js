const DangKyKhoaHoc = require('../../models/DangKyKhoaHoc');
const BuoiHoc = require('../../models/BuoiHoc');
const ThamGiaBuoiHoc = require('../../models/ThamGiaBuoiHoc');
const HocVien = require('../../models/HocVien');
const moment = require('moment');

exports.getStudentSchedule = async (req, res) => {
  try {
    const userId = req.user._id;
    const student = await HocVien.findOne({ userId });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin học viên' });
    }

    // Lấy danh sách khóa học mà học viên đã đăng ký
    const dangKys = await DangKyKhoaHoc.find({ hocvienId: student._id });
    const courseIds = dangKys.map(dk => dk.KhoaHocID);

    // Lấy tất cả các buổi học của các khóa học này
    const buoiHocs = await BuoiHoc.find({ KhoaHocID: { $in: courseIds } })
      .populate('KhoaHocID', 'tenkhoahoc')
      .populate('BaiHocID', 'tenbai')
      .populate({
        path: 'phonghoc',
        populate: {
          path: 'CoSoId',
          model: 'Coso',
          select: 'Tencoso'
        }
      })
      .sort({ ngayhoc: 1, giobatdau: 1 });

    // Lấy thông tin điểm danh để biết trạng thái (tuỳ chọn)
    const thamGias = await ThamGiaBuoiHoc.find({
      dangkykhoahocID: { $in: dangKys.map(dk => dk._id) }
    });
    
    const thamGiaMap = {};
    thamGias.forEach(tg => {
      thamGiaMap[tg.buoihocID.toString()] = tg;
    });

    // Gom dữ liệu theo ngày
    const scheduleMap = {};
    
    buoiHocs.forEach(bh => {
      // Format ngày thành dd/mm/yyyy
      const dateStr = moment(bh.ngayhoc).format('DD/MM/YYYY');
      
      if (!scheduleMap[dateStr]) {
        // Lấy thứ
        const dayOfWeekIndex = moment(bh.ngayhoc).day();
        const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        
        scheduleMap[dateStr] = {
          day: days[dayOfWeekIndex],
          date: dateStr,
          rawDate: bh.ngayhoc,
          classes: []
        };
      }

      const now = new Date();
      let status = 'upcoming';
      if (bh.gioketthuc < now) {
        status = 'completed';
      } else if (bh.giobatdau <= now && bh.gioketthuc >= now) {
        status = 'ongoing';
      }

      // Có thể thêm trạng thái điểm danh
      const tg = thamGiaMap[bh._id.toString()];
      const attendance = tg ? tg.trangthai : null;

      scheduleMap[dateStr].classes.push({
        _id: bh._id,
        time: `${moment(bh.giobatdau).format('HH:mm')} - ${moment(bh.gioketthuc).format('HH:mm')}`,
        course: bh.KhoaHocID ? bh.KhoaHocID.tenkhoahoc : 'Không rõ khóa học',
        lesson: bh.BaiHocID ? bh.BaiHocID.tenbai : '',
        classroom: bh.phonghoc ? bh.phonghoc.TenPhong : 'Chưa xếp phòng',
        branch: bh.phonghoc && bh.phonghoc.CoSoId ? bh.phonghoc.CoSoId.Tencoso : '',
        status: status,
        attendance: attendance
      });
    });

    // Chuyển object thành mảng và sắp xếp
    const scheduleArray = Object.values(scheduleMap).sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));

    // Bỏ rawDate trước khi gửi về client
    scheduleArray.forEach(item => delete item.rawDate);

    res.status(200).json({
      success: true,
      data: scheduleArray
    });

  } catch (error) {
    console.error('Lỗi khi lấy lịch học:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

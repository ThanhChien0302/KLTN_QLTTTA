const HocVien = require('../../models/HocVien');
const DangKyKhoaHoc = require('../../models/DangKyKhoaHoc');
const BuoiHoc = require('../../models/BuoiHoc');
const ThamGiaBuoiHoc = require('../../models/ThamGiaBuoiHoc');

// GET /student/courses
exports.getMyCourses = async (req, res) => {
    try {
        const student = await HocVien.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: "Không tìm thấy học viên" });
        }

        const enrolled = await DangKyKhoaHoc.find({ hocvienId: student._id })
            .populate('KhoaHocID', 'tenkhoahoc ngaykhaigiang')
            .sort({ createdAt: -1 });

        const formatted = enrolled.map(enroll => ({
            id: enroll.KhoaHocID?._id,
            tenkhoahoc: enroll.KhoaHocID?.tenkhoahoc,
            dangKyKhoaHocId: enroll._id
        })).filter(c => c.id);

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error("Lỗi getMyCourses:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// GET /student/courses/:courseId/sessions
exports.getUpcomingSessions = async (req, res) => {
    try {
        const { courseId } = req.params;
        // Fetch up coming sessions for this course
        // Optional: filter only sessions >= today so they can't ask for a leave in the past
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sessions = await BuoiHoc.find({
            KhoaHocID: courseId,
            ngayhoc: { $gte: today }
        })
            .populate("BaiHocID", "tenbai thutu")
            .sort({ ngayhoc: 1 });

        const formatted = sessions.map(s => ({
            id: s._id,
            tenbai: s.BaiHocID?.tenbai || `Buổi học`,
            thutu: s.BaiHocID?.thutu,
            ngayhoc: s.ngayhoc,
            giobatdau: s.giobatdau,
            gioketthuc: s.gioketthuc
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error("Lỗi getUpcomingSessions:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// POST /student/leave-requests
exports.createLeaveRequest = async (req, res) => {
    try {
        const { dangKyKhoaHocId, buoihocID, loai_don, lydo_nghi } = req.body;

        if (!dangKyKhoaHocId || !buoihocID || !loai_don) {
            return res.status(400).json({ success: false, message: "Vui lòng cung cấp đủ thông tin khóa học, buổi học và lý do" });
        }

        const student = await HocVien.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: "Không tìm thấy học viên" });
        }

        // Check if registration valid
        const enroll = await DangKyKhoaHoc.findById(dangKyKhoaHocId);
        if (!enroll || String(enroll.hocvienId) !== String(student._id)) {
            return res.status(403).json({ success: false, message: "Bạn chưa đăng ký khóa học này" });
        }

        // Check session details to get ngay_bat_dau, ngay_ket_thuc
        const buoihoc = await BuoiHoc.findById(buoihocID);
        if (!buoihoc) {
            return res.status(404).json({ success: false, message: "Buổi học không tồn tại" });
        }

        // Check if there is already a record
        let record = await ThamGiaBuoiHoc.findOne({
            dangkykhoahocID: dangKyKhoaHocId,
            buoihocID: buoihocID
        });

        if (record) {
            if (record.trangthai === 'excused') {
                return res.status(400).json({ success: false, message: "Bạn đã xin nghỉ phép cho buổi học này rồi" });
            }
            // Update existing record
            record.trangthai = 'excused';
            record.loai_don = loai_don;
            record.lydo_nghi = lydo_nghi;
            record.trangthai_duyet = 'pending';
            record.thoigian_nop = new Date();
            record.ngay_bat_dau = buoihoc.giobatdau;
            record.ngay_ket_thuc = buoihoc.gioketthuc;
            await record.save();
        } else {
            // Create new
            record = new ThamGiaBuoiHoc({
                dangkykhoahocID: dangKyKhoaHocId,
                buoihocID: buoihocID,
                trangthai: 'excused',
                thoigian_nop: new Date(),
                loai_don,
                lydo_nghi,
                trangthai_duyet: 'pending',
                ngay_bat_dau: buoihoc.giobatdau,
                ngay_ket_thuc: buoihoc.gioketthuc
            });
            await record.save();
        }

        res.status(201).json({ success: true, message: "Đã gửi yêu cầu nghỉ phép" });
    } catch (err) {
        console.error("Lỗi createLeaveRequest:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// GET /student/leave-requests
exports.getLeaveRequests = async (req, res) => {
    try {
        const student = await HocVien.findOne({ userId: req.user._id });
        if (!student) {
            return res.status(404).json({ success: false, message: "Không tìm thấy học viên" });
        }

        // find all enrolled courses
        const enrolled = await DangKyKhoaHoc.find({ hocvienId: student._id }).select('_id');
        const enrolledIds = enrolled.map(e => e._id);

        const requests = await ThamGiaBuoiHoc.find({
            dangkykhoahocID: { $in: enrolledIds },
            trangthai: 'excused'
        })
            .populate({
                path: 'dangkykhoahocID',
                populate: {
                    path: 'KhoaHocID',
                    select: 'tenkhoahoc'
                }
            })
            .populate('buoihocID', 'ngayhoc giobatdau gioketthuc')
            .sort({ createdAt: -1 });

        const formatted = requests.map(req => ({
            id: req._id,
            tenkhoahoc: req.dangkykhoahocID?.KhoaHocID?.tenkhoahoc,
            lydo_nghi: req.loai_don,
            chi_tiet: req.lydo_nghi,
            ngay_bat_dau: req.ngay_bat_dau,
            ngay_ket_thuc: req.ngay_ket_thuc,
            trangthai_duyet: req.trangthai_duyet,
            thoigian_nop: req.thoigian_nop || req.createdAt
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error("Lỗi getLeaveRequests:", err);
        res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
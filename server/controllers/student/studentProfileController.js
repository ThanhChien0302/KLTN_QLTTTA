// controllers/studentController.js
const HocVien = require('../../models/HocVien');
const NguoiDung = require('../../models/NguoiDung');
const bcrypt = require('bcryptjs');
const { enrollImageBuffer } = require('../../services/attendancePythonClient');
const { syncFaceIndexFromDatabase } = require('../../services/faceIndexSyncService');
const { sanitizeHocVienPublic } = require('../../utils/sanitizeHocVien');

exports.getStudentProfile = async (req, res) => {
    try {
        const studentData = await HocVien.findOne({ userId: req.user._id })
            .populate('userId', 'email hovaten soDienThoai ngaysinh diachi');

        if (!studentData) {
            return res.status(404).json({ message: "Không tìm thấy thông tin học viên" });
        }

        res.json(studentData);
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống", error: error.message });
    }
};

exports.enrollMyFace = async (req, res) => {
    try {
        if (!req.file?.buffer) {
            return res.status(400).json({ success: false, message: 'Thiếu ảnh khuôn mặt (field: image)' });
        }

        const user = await NguoiDung.findById(req.user._id);
        if (!user || user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Chỉ học viên mới có thể đăng ký khuôn mặt' });
        }

        const existingHocVien = await HocVien.findOne({ userId: user._id }).lean();
        if (existingHocVien?.faceEmbedding?.length) {
            return res.status(409).json({
                success: false,
                message: 'Học viên đã có dữ liệu khuôn mặt, chỉ được đăng ký khi trống',
            });
        }

        let embedding;
        try {
            embedding = await enrollImageBuffer(req.file.buffer);
        } catch (e) {
            return res.status(400).json({
                success: false,
                message: e.message || 'Không trích được đặc trưng khuôn mặt',
            });
        }

        const hocVienInfo = await HocVien.findOneAndUpdate(
            { userId: user._id },
            { faceEmbedding: embedding },
            { new: true, upsert: true }
        ).lean();

        await syncFaceIndexFromDatabase();

        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.maOTP;
        delete userObj.hanSuDungOTP;

        return res.status(200).json({
            success: true,
            message: 'Đã lưu khuôn mặt cho học viên',
            data: { ...userObj, hocVienInfo: sanitizeHocVienPublic(hocVienInfo) },
        });
    } catch (error) {
        console.error('enrollMyFace:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Lỗi server',
        });
    }
};

exports.deleteMyFace = async (req, res) => {
    try {
        const user = await NguoiDung.findById(req.user._id);
        if (!user || user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Chỉ học viên mới có thể thao tác khuôn mặt' });
        }

        const hocVienInfo = await HocVien.findOne({ userId: user._id });
        if (!hocVienInfo || !hocVienInfo.faceEmbedding?.length) {
            return res.status(404).json({ success: false, message: 'Không có dữ liệu khuôn mặt để xóa' });
        }

        hocVienInfo.faceEmbedding = [];
        await hocVienInfo.save();
        await syncFaceIndexFromDatabase();

        return res.status(200).json({ success: true, message: 'Đã xóa dữ liệu khuôn mặt' });
    } catch (error) {
        console.error('deleteMyFace:', error);
        return res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { FullName, email, Numberphone, dateOfBirth, address } = req.body;
        
        const phoneRegex = /^\d{10}$/;
        if (Numberphone && !phoneRegex.test(Numberphone)) {
            return res.status(400).json({
                success: false,
                message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số!"
            });
        }

        // Cập nhật bảng NguoiDung
        await NguoiDung.findByIdAndUpdate(req.user._id, {
            hovaten: FullName,
            soDienThoai: Numberphone,
            diachi: address,
            ngaysinh: dateOfBirth ? dateOfBirth : null,
        });

        res.json({ success: true, message: "Cập nhật thành công" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Cập nhật thất bại" });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin" });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu mới phải có ít nhất 6 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt"
            });
        }

        const user = await NguoiDung.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ success: false, message: "Người dùng không tồn tại" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Mật khẩu hiện tại không chính xác" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (err) {
        console.error("Lỗi đổi mật khẩu:", err);
        res.status(500).json({ success: false, message: "Lỗi server khi đổi mật khẩu" });
    }
};
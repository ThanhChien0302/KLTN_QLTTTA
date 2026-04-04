// controllers/studentController.js
const HocVien = require('../../models/HocVien');
const NguoiDung = require('../../models/NguoiDung');
const bcrypt = require('bcryptjs');

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
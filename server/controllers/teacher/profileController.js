const GiangVien = require("../../models/GiangVien");
const NguoiDung = require("../../models/NguoiDung");
const bcrypt = require("bcryptjs");
// GET PROFILE
exports.getProfile = async (req, res) => {
    try {
        const gv = await GiangVien.findOne({ userId: req.user._id })
            .populate("userId")
            .lean();

        if (!gv) {
            return res.status(404).json({ message: "Không tìm thấy giảng viên" });
        }

        res.json(gv);
        console.log("USER:", req.user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            dateOfBirth,
            address,
            gender,
            qualification,
            experience,
            specialization,
        } = req.body;
        const phoneRegex = /^\d{10}$/;
        if (phone && !phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số!"
            });
        }

        // UPDATE USER
        await NguoiDung.findByIdAndUpdate(req.user._id, {
            hovaten: fullName,
            email: email,
            soDienThoai: phone,
            diachi: address,
            gioitinh: gender === "male",
            ngaysinh: dateOfBirth ? dateOfBirth : null,
        });

        // UPDATE GIANG VIEN
        const gv = await GiangVien.findOneAndUpdate(
            { userId: req.user._id },
            {
                TrinhDoHocVan: qualification,
                kinhnghiem: experience,
                chuyenmon: specialization,
            },
            { new: true }
        ).populate("userId");

        res.json({
            message: "Cập nhật thành công",
            data: gv,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Cập nhật thất bại" });
    }
};
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // 1. Kiểm tra đầu vào đầy đủ
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin" });
        }

        // 2. Kiểm tra định dạng mật khẩu mới (Regex)
        // Ít nhất 6 ký tự, 1 chữ in hoa, 1 ký tự đặc biệt
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: "Mật khẩu mới phải có ít nhất 6 ký tự, 1 chữ in hoa và 1 ký tự đặc biệt"
            });
        }

        // 3. Kiểm tra khớp mật khẩu mới
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Xác nhận mật khẩu mới không khớp" });
        }

        // 4. Tìm người dùng và lấy mật khẩu ẩn
        const user = await NguoiDung.findById(req.user._id).select("+password");
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // 5. Kiểm tra mật khẩu hiện tại có đúng không
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Mật khẩu hiện tại không chính xác" });
        }

        // 6. Gán mật khẩu mới
        // Lưu ý: Chỉ gán chuỗi thuần, Model NguoiDung sẽ tự hash qua middleware pre('save')
        user.password = newPassword;

        // 7. Lưu vào database (Chỉ gọi save 1 lần duy nhất)
        await user.save();

        res.json({ message: "Đổi mật khẩu thành công!" });
    } catch (err) {
        console.error("Lỗi đổi mật khẩu:", err);
        res.status(500).json({ message: "Lỗi server khi đổi mật khẩu" });
    }
};
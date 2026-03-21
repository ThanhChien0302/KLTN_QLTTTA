var express = require('express');
var router = express.Router();
const User = require('../models/User');

const { protect, admin } = require('../middlewares/authMiddleware');

// GET /users - Lấy danh sách users (có thể filter theo role)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select('-hashpassword');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// GET /users/:id - Lấy chi tiết user
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashpassword');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// POST /users - Tạo user mới (chỉ admin)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, email, password, FullName, Numberphone, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tên, email và mật khẩu là bắt buộc'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      hashpassword: password, // Sẽ được hash tự động bởi middleware
      FullName,
      Numberphone,
      role: role || 'student' // Default role
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// PUT /users/:id - Cập nhật user
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, FullName, Numberphone, role, isActive } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (FullName) updateData.FullName = FullName;
    if (Numberphone) updateData.Numberphone = Numberphone;
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-hashpassword');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật user thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// DELETE /users/:id - Xóa user
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Xóa user thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// PUT /users/profile - Cập nhật thông tin cá nhân (user tự cập nhật)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, FullName, Numberphone, dateOfBirth, address } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (FullName) updateData.FullName = FullName;
    if (Numberphone) updateData.Numberphone = Numberphone;
    if (dateOfBirth) updateData.dateOfBirth = dateOfBirth;
    if (address) updateData.address = address;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select('-hashpassword');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// PUT /users/change-password - Đổi mật khẩu
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không đúng'
      });
    }

    // Cập nhật mật khẩu mới
    user.hashpassword = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

module.exports = router;

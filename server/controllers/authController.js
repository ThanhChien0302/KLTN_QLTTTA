const User = require('../models/NguoiDung');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // So sánh mật khẩu
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra tài khoản có active không
    if (!user.trangThaiHoatDong) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Nếu là student hoặc teacher và chưa verify, gửi OTP và redirect
    if ((user.role === 'student' || user.role === 'teacher') && !user.daXacThuc) {
      // Generate and send OTP
      const otp = await user.generateOTP();
      await sendOTP(email, otp);

      return res.status(403).json({
        success: false,
        message: 'Tài khoản chưa được xác thực. OTP đã được gửi đến email của bạn.',
        redirectToVerify: true
      });
    }

    // Tạo token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d' // Token hết hạn sau 1 ngày
    });

    // Đăng nhập thành công
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        hovaten: user.hovaten,
        soDienThoai: user.soDienThoai
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, hovaten, soDienThoai } = req.body;
    console.log(`Register attempt for: ${email}`);

    // Validate input
    const resolvedFullName = (hovaten || "").trim();
    const resolvedPhone = (soDienThoai || "").trim();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
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
      email,
      password: password, // Sẽ được hash tự động bởi middleware
      hovaten: resolvedFullName || undefined,
      soDienThoai: resolvedPhone || undefined,
      role: 'student', // Đăng ký mặc định là học viên
      daXacThuc: false,
      trangThaiHoatDong: true
    });

    await newUser.save();
    console.log('User registered successfully');

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        hovaten: newUser.hovaten,
        soDienThoai: newUser.soDienThoai
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Xác thực tài khoản - Mã OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Xác thực tài khoản</h2>
        <p>Chào bạn,</p>
        <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
        <p>Mã này sẽ hết hạn sau 10 phút.</p>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        <br>
        <p>Trân trọng,</p>
        <p>Đội ngũ Trung tâm Tiếng Anh</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('OTP sent to:', email);
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Không thể gửi email OTP');
  }
};

const sendPasswordResetOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Đặt lại mật khẩu - Mã OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Đặt lại mật khẩu</h2>
        <p>Chào bạn,</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
        <p>Mã OTP của bạn là: <strong>${otp}</strong></p>
        <p>Mã này sẽ hết hạn sau 10 phút.</p>
        <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
        <br>
        <p>Trân trọng,</p>
        <p>Đội ngũ Trung tâm Tiếng Anh</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset OTP sent to:', email);
  } catch (error) {
    console.error('Error sending password reset OTP:', error);
    throw new Error('Không thể gửi email OTP');
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email và OTP là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    if (user.daXacThuc) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã được xác thực'
      });
    }

    const isValidOTP = await user.verifyOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP không hợp lệ hoặc đã hết hạn'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xác thực tài khoản thành công'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    if (user.daXacThuc) {
      return res.status(400).json({
        success: false,
        message: 'Tài khoản đã được xác thực'
      });
    }

    // Generate and send new OTP
    const otp = await user.generateOTP();
    await sendOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP mới đã được gửi đến email của bạn'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Kiểm tra tài khoản có active không
    if (!user.trangThaiHoatDong) {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa'
      });
    }

    // Generate and send OTP for password reset
    const otp = await user.generateOTP();
    await sendPasswordResetOTP(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP đã được gửi đến email của bạn'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const verifyPasswordResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email và OTP là bắt buộc'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    const isValidOTP = await user.verifyOTP(otp);
    if (!isValidOTP) {
      return res.status(400).json({
        success: false,
        message: 'OTP không hợp lệ hoặc đã hết hạn'
      });
    }

    // Tạo token tạm thời cho việc reset password
    const resetToken = jwt.sign(
      { id: user._id, email: user.email, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // Token hết hạn sau 15 phút
    );

    res.status(200).json({
      success: true,
      message: 'OTP hợp lệ',
      resetToken
    });

  } catch (error) {
    console.error('Verify password reset OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmPassword } = req.body;

    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Tất cả các trường là bắt buộc'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu xác nhận không khớp'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    // Verify reset token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ'
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Tài khoản không tồn tại'
      });
    }

    // Update password
    user.password = newPassword; // Sẽ được hash bởi middleware
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
};

module.exports = {
  login,
  register,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyPasswordResetOTP,
  resetPassword
};

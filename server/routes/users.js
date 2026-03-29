var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');

const { protect, admin } = require('../middlewares/authMiddleware');

const normalizeGender = (value) => {
  if (!value) return undefined;
  const v = String(value).trim().toLowerCase();
  if (["male", "nam", "m"].includes(v)) return "male";
  if (["female", "nữ", "nu", "f"].includes(v)) return "female";
  if (["other", "khác", "khac", "o"].includes(v)) return "other";
  return undefined;
};

const denormalizeGenderVi = (value) => {
  if (!value) return value;
  if (value === "male") return "Nam";
  if (value === "female") return "Nữ";
  if (value === "other") return "Khác";
  return value;
};

const parseSpecialties = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(s => String(s).trim()).filter(Boolean);
  return String(value)
    .split(/[,;\n]/g)
    .map(s => s.trim())
    .filter(Boolean);
};

const mergeTeacherView = (user, teacher) => {
  const phone = teacher?.phone ?? user.phone ?? undefined;
  const fullName = teacher?.fullName ?? user.fullName ?? undefined;

  const firstCert = Array.isArray(teacher?.certificates) ? teacher.certificates[0] : undefined;

  return {
    ...user,
    fullName,
    phone,
    Numberphone: phone,
    gender: denormalizeGenderVi(teacher?.gender ?? user.gender),
    dateOfBirth: teacher?.dateOfBirth ?? user.dateOfBirth,
    address: teacher?.address ?? user.address,

    experience: teacher?.experienceYears ?? undefined,
    educationLevel: teacher?.education?.degree ?? undefined,
    major: teacher?.education?.major ?? undefined,

    certificateType: firstCert?.name ?? undefined,
    certificateScore: firstCert?.score ?? undefined,

    teachingStrengths: Array.isArray(teacher?.specialties) ? teacher.specialties.join(", ") : undefined,
    bio: teacher?.bio ?? undefined
  };
};

const mergeStudentView = (user, student) => {
  const phone = student?.phone ?? user.phone ?? undefined;
  const fullName = student?.fullName ?? user.fullName ?? undefined;

  return {
    ...user,
    fullName,
    phone,
    Numberphone: phone,
    gender: denormalizeGenderVi(student?.gender ?? user.gender),
    dateOfBirth: student?.dateOfBirth ?? user.dateOfBirth,
    address: student?.address ?? user.address,

    parentPhone: student?.parentPhone ?? undefined,
    level: student?.level ?? undefined,
    enrollmentDate: student?.enrollmentDate ?? undefined
  };
};

// GET /users - Lấy danh sách users (có thể filter theo role)
router.get('/', protect, admin, async (req, res) => {
  try {
    const { role } = req.query;
    let filter = {};

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select('-hashpassword -otp -otpExpires').lean();

    if (role === 'teacher' && users.length) {
      const teacherProfiles = await Teacher.find({ user: { $in: users.map(u => u._id) } }).lean();
      const teacherByUserId = new Map(teacherProfiles.map(t => [String(t.user), t]));
      const merged = users.map(u => mergeTeacherView(u, teacherByUserId.get(String(u._id))));
      return res.json({ success: true, data: merged });
    }

    if (role === 'student' && users.length) {
      const studentProfiles = await Student.find({ user: { $in: users.map(u => u._id) } }).lean();
      const studentByUserId = new Map(studentProfiles.map(s => [String(s.user), s]));
      const merged = users.map(u => mergeStudentView(u, studentByUserId.get(String(u._id))));
      return res.json({ success: true, data: merged });
    }

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

// PUT /users/profile - Cập nhật thông tin cá nhân (user tự cập nhật)
// NOTE: must be declared before `/:id` PUT route to avoid being treated as an id.
router.put('/profile', protect, async (req, res) => {
  try {
    const { username, name, fullName, FullName, phone, Numberphone, dateOfBirth, gender, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    const resolvedUsername = (username || name || "").trim().toLowerCase();
    if (resolvedUsername && resolvedUsername !== user.username) {
      const existingUsername = await User.findOne({ username: resolvedUsername });
      if (existingUsername && String(existingUsername._id) !== String(user._id)) {
        return res.status(400).json({
          success: false,
          message: 'Username đã tồn tại'
        });
      }
      user.username = resolvedUsername;
    }

    const resolvedFullName = (fullName || FullName || "").trim();
    if (resolvedFullName) user.fullName = resolvedFullName;

    const resolvedPhone = (phone || Numberphone || "").trim();
    if (resolvedPhone) user.phone = resolvedPhone;

    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = normalizeGender(gender) || user.gender;
    if (address) user.address = address;

    await user.save();

    // Keep teacher/student profile in sync for shared fields
    if (user.role === 'teacher') {
      await Teacher.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    } else if (user.role === 'student') {
      await Student.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address
        },
        { upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.json({
      success: true,
      message: 'Cập nhật thông tin cá nhân thành công',
      data: (await User.findById(user._id).select('-hashpassword -otp -otpExpires').lean())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
});

// PUT /users/change-password - Đổi mật khẩu
// NOTE: must be declared before `/:id` PUT route to avoid being treated as an id.
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

// GET /users/:id - Lấy chi tiết user
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-hashpassword -otp -otpExpires').lean();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    if (user.role === 'teacher') {
      const teacher = await Teacher.findOne({ user: user._id }).lean();
      return res.json({ success: true, data: mergeTeacherView(user, teacher) });
    }

    if (user.role === 'student') {
      const student = await Student.findOne({ user: user._id }).lean();
      return res.json({ success: true, data: mergeStudentView(user, student) });
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
    const {
      username,
      name,
      email,
      password,
      fullName,
      FullName,
      phone,
      Numberphone,
      role,
      isActive,
      dateOfBirth,
      gender,
      address,

      // Teacher extra fields (from UI)
      certificateType,
      certificateScore,
      educationLevel,
      major,
      experience,
      teachingStrengths,
      bio
    } = req.body;

    const resolvedUsername = (username || name || "").trim().toLowerCase();
    const resolvedFullName = (fullName || FullName || "").trim();
    const resolvedPhone = (phone || Numberphone || "").trim();

    // Validate required fields
    if (!resolvedUsername || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email và mật khẩu là bắt buộc'
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

    const existingUsername = await User.findOne({ username: resolvedUsername });
    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'Username đã tồn tại'
      });
    }

    // Create new user
    const newUser = new User({
      username: resolvedUsername,
      email,
      hashpassword: password, // Sẽ được hash tự động bởi middleware
      fullName: resolvedFullName || undefined,
      phone: resolvedPhone || undefined,
      role: role || 'student', // Default role
      isActive: typeof isActive === 'boolean' ? isActive : undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: normalizeGender(gender),
      address: address || undefined
    });

    await newUser.save();

    // Create / upsert role profiles when needed
    if (newUser.role === 'teacher') {
      const teacherDoc = {
        user: newUser._id,
        fullName: resolvedFullName || undefined,
        phone: resolvedPhone || undefined,
        avatar: newUser.avatar || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: normalizeGender(gender),
        address: address || undefined,
        experienceYears: typeof experience === 'number' ? experience : (experience ? Number(experience) : undefined),
        education: {
          degree: educationLevel || undefined,
          major: major || undefined
        },
        specialties: parseSpecialties(teachingStrengths),
        certificates: certificateType
          ? [
              {
                name: certificateType,
                score: certificateScore !== undefined && certificateScore !== "" ? Number(certificateScore) : undefined
              }
            ]
          : [],
        bio: bio || undefined
      };

      const teacher = await Teacher.findOneAndUpdate(
        { user: newUser._id },
        teacherDoc,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();

      return res.status(201).json({
        success: true,
        message: 'Tạo user thành công',
        data: mergeTeacherView(
          { ...(await User.findById(newUser._id).select('-hashpassword -otp -otpExpires').lean()) },
          teacher
        )
      });
    }

    if (newUser.role === 'student') {
      await Student.findOneAndUpdate(
        { user: newUser._id },
        {
          user: newUser._id,
          fullName: resolvedFullName || undefined,
          phone: resolvedPhone || undefined,
          avatar: newUser.avatar || undefined,
          dateOfBirth: dateOfBirth || undefined,
          gender: normalizeGender(gender),
          address: address || undefined
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: {
        ...(await User.findById(newUser._id).select('-hashpassword -otp -otpExpires').lean()),
        Numberphone: newUser.phone,
        gender: denormalizeGenderVi(newUser.gender)
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
    const {
      username,
      name,
      email,
      password,
      fullName,
      FullName,
      phone,
      Numberphone,
      role,
      isActive,
      dateOfBirth,
      gender,
      address,

      // Teacher extra fields (from UI)
      certificateType,
      certificateScore,
      educationLevel,
      major,
      experience,
      teachingStrengths,
      bio
    } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User không tồn tại'
      });
    }

    const resolvedUsername = (username || name || "").trim().toLowerCase();
    if (resolvedUsername && resolvedUsername !== user.username) {
      const existingUsername = await User.findOne({ username: resolvedUsername });
      if (existingUsername && String(existingUsername._id) !== String(user._id)) {
        return res.status(400).json({
          success: false,
          message: 'Username đã tồn tại'
        });
      }
      user.username = resolvedUsername;
    }

    if (email) user.email = email;

    const resolvedFullName = (fullName || FullName || "").trim();
    if (resolvedFullName) user.fullName = resolvedFullName;

    const resolvedPhone = (phone || Numberphone || "").trim();
    if (resolvedPhone) user.phone = resolvedPhone;

    if (role) user.role = role;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (gender) user.gender = normalizeGender(gender) || user.gender;
    if (address) user.address = address;

    if (password) {
      user.hashpassword = password; // will be hashed by pre-save
    }

    await user.save();

    // Upsert role profile for teacher/student
    if (user.role === 'teacher') {
      const teacherDoc = {
        user: user._id,
        fullName: user.fullName,
        phone: user.phone,
        avatar: user.avatar,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        address: user.address,
        experienceYears: typeof experience === 'number' ? experience : (experience ? Number(experience) : undefined),
        education: {
          degree: educationLevel || undefined,
          major: major || undefined
        },
        specialties: parseSpecialties(teachingStrengths),
        certificates: certificateType
          ? [
              {
                name: certificateType,
                score: certificateScore !== undefined && certificateScore !== "" ? Number(certificateScore) : undefined
              }
            ]
          : [],
        bio: bio || undefined
      };

      const teacher = await Teacher.findOneAndUpdate(
        { user: user._id },
        teacherDoc,
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();

      const merged = mergeTeacherView(
        { ...(await User.findById(user._id).select('-hashpassword -otp -otpExpires').lean()) },
        teacher
      );

      return res.json({
        success: true,
        message: 'Cập nhật user thành công',
        data: merged
      });
    }

    if (user.role === 'student') {
      const student = await Student.findOneAndUpdate(
        { user: user._id },
        {
          user: user._id,
          fullName: user.fullName,
          phone: user.phone,
          avatar: user.avatar,
          dateOfBirth: user.dateOfBirth,
          gender: user.gender,
          address: user.address
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      ).lean();

      const merged = mergeStudentView(
        { ...(await User.findById(user._id).select('-hashpassword -otp -otpExpires').lean()) },
        student
      );

      return res.json({
        success: true,
        message: 'Cập nhật user thành công',
        data: merged
      });
    }

    res.json({
      success: true,
      message: 'Cập nhật user thành công',
      data: (await User.findById(user._id).select('-hashpassword -otp -otpExpires').lean())
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

    await Promise.all([
      Teacher.deleteOne({ user: req.params.id }),
      Student.deleteOne({ user: req.params.id })
    ]);

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

module.exports = router;

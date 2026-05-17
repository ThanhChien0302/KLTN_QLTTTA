"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import DateInputField from "../../components/DateInputField";
import { formatDateDdMmYyyy, toDateInputValue } from "../../../lib/dateFormat";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);

  // State thông tin cá nhân
  const [formData, setFormData] = useState({
    email: '',
    Numberphone: '',
    FullName: '',
    dateOfBirth: '',
    address: '',
  });

  const [originalData, setOriginalData] = useState({
    email: '',
    Numberphone: '',
    FullName: '',
    dateOfBirth: '',
    address: '',
  });

  // State mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State đăng ký khuôn mặt
  const [faceData, setFaceData] = useState({
    image: null,
    preview: '',
  });
  const [faceStatus, setFaceStatus] = useState({ hasFace: false, loading: false });
  const [scanError, setScanError] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const faceStatusMessage = faceStatus.hasFace
    ? 'Khuôn mặt đã được đăng ký, liên hệ admin để xin đăng ký lại'
    : 'Chưa có dữ liệu khuôn mặt';
  const videoRef = useRef(null);

  // State quản lý ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({
    phone: "",
    dateOfBirth: ""
  });

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Regex kiểm tra mật khẩu: >= 6 ký tự, 1 chữ HOA, 1 ký tự đặc biệt
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const res = await fetch(`${apiUrl}/student/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Không thể lấy dữ liệu profile");

        const data = await res.json();
        const userData = data.userId;

        const fetchedData = {
          email: userData?.email || '',
          Numberphone: userData?.soDienThoai || '',
          FullName: userData?.hovaten || '',
          dateOfBirth: userData?.ngaysinh ? toDateInputValue(userData.ngaysinh) : '',
          address: userData?.diachi || '',
        };
        setFormData(fetchedData);
        setOriginalData(fetchedData);

      } catch (err) {
        console.error("Lỗi load profile:", err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (user && !formData.email) {
      const initialData = {
        email: user.email || '',
        FullName: user.FullName || user.name || '',
        Numberphone: user.Numberphone || '',
        dateOfBirth: user.dateOfBirth ? toDateInputValue(user.dateOfBirth) : "",
        address: user.address || ''
      };
      setFormData(initialData);
      setOriginalData(initialData);
    }
  }, [user]);

  const handlePersonalInfoChange = (field, value) => {
    let newValue = value;
    if (field === 'FullName') {
      newValue = value.replace(/[0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [field]: newValue
    }));

    // Validate phone realtime
    if (field === "Numberphone") {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, phone: "Số điện thoại phải đúng 10 chữ số" }));
      } else {
        setErrors(prev => ({ ...prev, phone: "" }));
      }
    }

    // Validate dateOfBirth
    if (field === "dateOfBirth") {
      let dobError = "";
      if (value) {
        const selectedDate = new Date(value);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate > currentDate) {
          dobError = "Ngày sinh không được lớn hơn hiện tại";
        }
      }
      setErrors(prev => ({ ...prev, dateOfBirth: dobError }));
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadFaceState = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        const embedding = data?.faceEmbedding || data?.hocVienInfo?.faceEmbedding || [];
        setFaceStatus({ hasFace: Array.isArray(embedding) && embedding.length > 0, loading: false });
      } catch {
        setFaceStatus({ hasFace: false, loading: false });
      }
    };

    loadFaceState();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      showToast('Không mở được camera. Hãy cấp quyền trình duyệt.', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'face') {
      startCamera();
    }
    return () => {
      const stream = videoRef.current?.srcObject;
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [activeTab]);

  const togglePassword = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePersonalInfoSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/student/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          FullName: formData.FullName,
          Numberphone: formData.Numberphone,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address
        })
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Cập nhật thất bại");
      }

      setOriginalData(formData);
      setIsEditing(false);
      showToast('Cập nhật thông tin thành công!');
    } catch (error) {
      showToast('Có lỗi xảy ra: ' + error.message, 'error');
    } finally {
      setIsCapturing(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordRegex.test(passwordData.newPassword)) {
      showToast("Mật khẩu mới phải từ 6 ký tự trở lên, có ít nhất 1 chữ IN HOA và 1 ký tự đặc biệt!", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Xác nhận mật khẩu mới không khớp!", "error");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(`${apiUrl}/student/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Không thể đổi mật khẩu");
      }

      showToast('Đổi mật khẩu thành công!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast('Có lỗi xảy ra: ' + error.message, 'error');
    }
  };

  const handleCaptureAndSave = async () => {
    if (isCapturing) return;
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      showToast('Camera chưa sẵn sàng.', 'error');
      return;
    }

    if (faceStatus.hasFace) {
      showToast('Khuôn mặt đã được đăng ký, liên hệ admin để xin đăng ký lại.', 'error');
      return;
    }

    setIsCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
      if (!blob) {
        throw new Error('Không tạo được ảnh chụp.');
      }

      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const formData = new FormData();
      formData.append('image', blob, 'face.jpg');

      const response = await fetch(`${apiUrl}/student/face-enrollment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Không thể đăng ký khuôn mặt');
      }

      setFaceData({ image: blob, preview: canvas.toDataURL('image/jpeg') });
      setFaceStatus({ hasFace: true, loading: false });
      showToast('Đăng ký khuôn mặt thành công!');
    } catch (error) {
      showToast('Có lỗi xảy ra: ' + error.message, 'error');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFaceSubmit = async () => {
    return handleCaptureAndSave();
  };

  const handleDeleteFace = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/student/face-enrollment`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || 'Không thể xóa khuôn mặt');
      setFaceStatus({ hasFace: false, loading: false });
      setFaceData({ image: null, preview: '' });
      showToast('Đã xóa dữ liệu khuôn mặt.');
    } catch (error) {
      showToast('Có lỗi xảy ra: ' + error.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 md:p-8 animate-slide-in-up">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg ring-4 ring-blue-50">
            {formData.FullName ? formData.FullName.charAt(0).toUpperCase() : 'HV'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">Hồ Sơ Học Viên</h1>
            <p className="text-gray-500">Quản lý thông tin cá nhân và bảo mật tài khoản</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-blue-100 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
        <div className="p-4 border-b border-gray-100">
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === 'personal'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === 'password'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              Đổi mật khẩu
            </button>
            <button
              onClick={() => setActiveTab('face')}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 ${activeTab === 'face'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                : 'bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a5 5 0 00-5 5v2a5 5 0 1010 0V7a5 5 0 00-5-5zm-7 9a7 7 0 0114 0c0 3.866-3.134 7-7 7s-7-3.134-7-7zm7 9c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"></path></svg>
              Đăng ký khuôn mặt
            </button>
          </nav>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'personal' && (
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Chi tiết hồ sơ</h3>
                  <p className="text-sm text-gray-500 mt-1">Các thông tin cơ bản liên hệ và lý lịch</p>
                </div>
                <button
                  onClick={() => {
                    if (isEditing) {
                      setFormData(originalData);
                      setErrors({ phone: "", dateOfBirth: "" });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className={`mt-4 sm:mt-0 px-5 py-2 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${isEditing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200'
                    }`}
                >
                  {isEditing ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      Hủy chỉnh sửa
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      Chỉnh sửa hồ sơ
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Họ và tên */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.FullName}
                      onChange={(e) => handlePersonalInfoChange('FullName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                      <div className="p-2 bg-white rounded-md text-gray-400 group-hover:text-blue-500 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                      <p className="text-gray-800 font-medium">{formData.FullName || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none text-gray-500 cursor-not-allowed"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                      <div className="p-2 bg-white rounded-md text-gray-400 group-hover:text-blue-500 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                      </div>
                      <p className="text-gray-800 font-medium">{formData.email || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                    </div>
                  )}
                </div>

                {/* Số điện thoại */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Số điện thoại</label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="tel"
                        value={formData.Numberphone}
                        onChange={(e) => {
                          const onlyNumber = e.target.value.replace(/\D/g, "");
                          handlePersonalInfoChange("Numberphone", onlyNumber);
                        }}
                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all text-gray-800
                          ${errors.phone ? "border-red-400 focus:ring-red-400" : "border-gray-200 focus:ring-blue-500"}`}
                        placeholder="Nhập 10 chữ số"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.phone}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                      <div className="p-2 bg-white rounded-md text-gray-400 group-hover:text-blue-500 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                      </div>
                      <p className="text-gray-800 font-medium">{formData.Numberphone || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                    </div>
                  )}
                </div>

                {/* Ngày sinh */}
                <div className="group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ngày sinh</label>
                  {isEditing ? (
                    <div className="relative">
                      <DateInputField
                        value={formData.dateOfBirth}
                        onChange={(e) => handlePersonalInfoChange("dateOfBirth", e.target.value)}
                        className={`w-full rounded-lg border bg-gray-50 focus-within:ring-2 focus-within:bg-white transition-all
                          ${errors.dateOfBirth ? "border-red-400 focus-within:ring-red-400" : "border-gray-200 focus-within:ring-blue-500"}`}
                        inputClassName="date-input-field flex-1 px-4 py-2.5 text-gray-800 outline-none border-0 bg-transparent"
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 absolute -bottom-5 left-0">{errors.dateOfBirth}</p>}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                      <div className="p-2 bg-white rounded-md text-gray-400 group-hover:text-blue-500 shadow-sm border border-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <p className="text-gray-800 font-medium">{formatDateDdMmYyyy(formData.dateOfBirth, { empty: <span className="text-gray-400 italic">Chưa cập nhật</span> })}</p>
                    </div>
                  )}
                </div>

                {/* Địa chỉ */}
                <div className="md:col-span-2 group">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Địa chỉ</label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-800 resize-none"
                      placeholder="Nhập địa chỉ của bạn"
                    />
                  ) : (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-transparent group-hover:border-blue-100 group-hover:bg-blue-50/30 transition-all">
                      <div className="p-2 bg-white rounded-md text-gray-400 group-hover:text-blue-500 shadow-sm border border-gray-100 mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      </div>
                      <p className="text-gray-800 font-medium leading-relaxed">{formData.address || <span className="text-gray-400 italic">Chưa cập nhật</span>}</p>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 animate-slide-in-up" style={{ animationDelay: '100ms' }}>
                  <button
                    onClick={() => {
                      setFormData(originalData);
                      setErrors({ phone: "", dateOfBirth: "" });
                      setIsEditing(false);
                    }}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handlePersonalInfoSubmit}
                    disabled={!!errors.phone || !!errors.dateOfBirth}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2 ${(errors.phone || errors.dateOfBirth)
                      ? 'bg-blue-300 cursor-not-allowed shadow-none'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Lưu thông tin
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div className="animate-fade-in max-w-xl mx-auto space-y-8 bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-white shadow-sm border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Bảo mật tài khoản</h3>
                <p className="text-sm text-gray-500 mt-1">Sử dụng mật khẩu mạnh để bảo vệ tài khoản của bạn</p>
              </div>

              <div className="space-y-5">
                {/* Mật khẩu hiện tại */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu hiện tại</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    </div>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 shadow-sm"
                      placeholder="Nhập mật khẩu đang dùng"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      {showPassword.current ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="h-px bg-gray-200"></div>
                </div>

                {/* Mật khẩu mới */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Mật khẩu mới</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    </div>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 shadow-sm"
                      placeholder="Mật khẩu từ 6 ký tự, có in hoa & ký tự đặc biệt"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      {showPassword.new ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Xác nhận mật khẩu mới */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 shadow-sm"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => togglePassword('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
                    >
                      {showPassword.confirm ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePasswordSubmit}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-bold shadow-md hover:shadow-lg hover:shadow-blue-200 transition-all flex justify-center items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                    Cập nhật mật khẩu
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'face' && (
            <div className="animate-fade-in w-full">
              <div className="rounded-3xl overflow-hidden border border-blue-100 bg-black shadow-2xl min-h-[78vh] relative">
                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/55" />

                <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-center">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg border ${faceStatus.hasFace ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white/95 text-emerald-700 border-emerald-200'}`}>
                    {faceStatusMessage}
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[70vw] max-w-[560px] aspect-[3/4] rounded-[2rem] border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.06)]" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <div className="mx-auto max-w-3xl">
                    <div className="rounded-3xl bg-white/92 backdrop-blur-md border border-white/60 shadow-xl p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                        <div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">Đăng ký khuôn mặt</h3>
                          <p className="text-sm text-gray-600 mt-1">Đặt mặt vào khung và bấm lưu hình ảnh để gửi lên hệ thống.</p>
                        </div>
                        <button
                          onClick={handleCaptureAndSave}
                          disabled={faceStatus.hasFace || isCapturing}
                          className="min-w-[220px] px-6 py-4 rounded-2xl bg-blue-600 text-white font-bold text-base hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isCapturing ? 'Đang xử lý...' : 'Lưu hình ảnh'}
                        </button>
                      </div>
                      {scanError && <p className="text-sm text-red-500 mt-3">{scanError}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-20 right-8 z-[9999] px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-fade-in transition-all ${toast.type === 'success'
          ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-blue-200/50'
          : 'bg-red-50 text-red-700 border border-red-200 shadow-red-200/50'
          }`}>
          {toast.type === 'success' ? (
            <div className="p-1 bg-blue-100 rounded-full text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
          ) : (
            <div className="p-1 bg-red-100 rounded-full text-red-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
          )}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

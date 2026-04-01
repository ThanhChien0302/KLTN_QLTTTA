"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function EditAssignmentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const assignmentId = searchParams.get("id");
    
    const [courseName, setCourseName] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        tieude: "",
        hannop: "",
        loai: "homework",
        diem: 100,
        mota: ""
    });
    
    const [file, setFile] = useState(null);
    const [existingFile, setExistingFile] = useState(null);
    const [removeFile, setRemoveFile] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const name = localStorage.getItem("selectedCourseName");
        if (name) setCourseName(name);

        if (assignmentId) {
            fetchAssignmentDetails();
        } else {
            setError("Không tìm thấy ID bài tập.");
            setFetching(false);
        }
    }, [assignmentId]);

    const fetchAssignmentDetails = async () => {
        try {
            const token = localStorage.getItem("token");
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            
            const response = await fetch(`${apiUrl}/teacher/assignments/${assignmentId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                const ass = data.data;
                
                // Format datetime-local string (YYYY-MM-DDTHH:mm)
                let dateStr = "";
                if (ass.hannop) {
                    const d = new Date(ass.hannop);
                    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                    dateStr = d.toISOString().slice(0, 16);
                }

                setFormData({
                    tieude: ass.tieude || "",
                    hannop: dateStr,
                    loai: ass.loai || "homework",
                    diem: ass.diem || 100,
                    mota: ass.mota || ""
                });

                if (ass.file) {
                    setExistingFile(ass.file);
                }
            } else {
                setError(data.message || "Không thể tải thông tin bài tập.");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối máy chủ.");
        } finally {
            setFetching(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
            setRemoveFile(false); // If they pick a new file, don't just "remove"
        }
    };

    const handleRemoveExistingFile = () => {
        setRemoveFile(true);
        setExistingFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!formData.tieude || !formData.hannop) {
            setError("Vui lòng nhập đầy đủ tiêu đề và hạn nộp.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const submissionData = new FormData();
            submissionData.append("tieude", formData.tieude);
            submissionData.append("hannop", formData.hannop);
            submissionData.append("loai", formData.loai);
            submissionData.append("diem", formData.diem);
            submissionData.append("mota", formData.mota);
            submissionData.append("removeFile", removeFile);
            
            if (file) {
                submissionData.append("file", file);
            }

            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
            const response = await fetch(`${apiUrl}/teacher/assignments/${assignmentId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: submissionData
            });

            const data = await response.json();

            if (data.success) {
                alert("Cập nhật bài tập thành công!");
                router.push("/teacher/courses/assignments");
            } else {
                setError(data.message || "Có lỗi xảy ra.");
            }
        } catch (err) {
            console.error(err);
            setError(err.message || "Lỗi kết nối máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
                <Link href="/teacher/courses/assignments">
                    <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay Lại
                    </button>
                </Link>

                <h1 className="text-2xl font-bold text-gray-800">
                    Chỉnh Sửa Bài Tập {courseName && `- Khóa: ${courseName}`}
                </h1>
                <div className="w-[100px]"></div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold flex items-center gap-3">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Cập Nhật Thông Tin Bài Tập
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">Tiêu Đề <span className="text-red-500">*</span></label>
                            <input 
                                type="text" 
                                name="tieude"
                                value={formData.tieude}
                                onChange={handleChange}
                                placeholder="Nhập tiêu đề..." 
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                required
                            />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">Hạn Nộp <span className="text-red-500">*</span></label>
                            <input 
                                type="datetime-local" 
                                name="hannop"
                                value={formData.hannop}
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">Loại Bài Tập</label>
                            <select 
                                name="loai"
                                value={formData.loai}
                                onChange={handleChange}
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                            >
                                <option value="homework">Bài tập về nhà</option>
                                <option value="test">Bài kiểm tra</option>
                                <option value="listening">Bài tập nghe</option>
                                <option value="presentation">Bài thuyết trình</option>
                            </select>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">Điểm số tối đa</label>
                            <input 
                                type="number" 
                                name="diem"
                                value={formData.diem}
                                onChange={handleChange}
                                min="1"
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">Nội Dung Mô Tả</label>
                            <textarea 
                                rows="4" 
                                name="mota"
                                value={formData.mota}
                                onChange={handleChange}
                                placeholder="Mô tả chi tiết yêu cầu bài tập..." 
                                className="p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            ></textarea>
                        </div>
                        
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="font-semibold text-gray-700 text-sm">File Đính Kèm Hiện Tại</label>
                            {existingFile ? (
                                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-md">
                                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                    </svg>
                                    <span className="text-blue-600 text-sm flex-1">
                                        Đã có file đính kèm ({(existingFile.size / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                    <button 
                                        type="button" 
                                        onClick={handleRemoveExistingFile}
                                        className="text-red-500 text-sm font-semibold hover:underline"
                                    >
                                        Xóa file
                                    </button>
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 italic">Không có file đính kèm.</div>
                            )}

                            <label className="mt-4 font-semibold text-gray-700 text-sm">Thay Đổi/Thêm File Mới (Nếu có)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <input 
                                    type="file" 
                                    id="file-upload" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-600 w-full h-full">
                                    <svg width="30" height="30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    <span>{file ? file.name : "Nhấn để chọn tệp tin từ máy tính"}</span>
                                    {file && <span className="text-xs text-blue-600 font-medium">Đã chọn 1 file mới ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>}
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-4">
                        <Link href="/teacher/courses/assignments">
                            <button
                                type="button"
                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
                            >
                                Hủy Bỏ
                            </button>
                        </Link>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EditAssignment() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <EditAssignmentContent />
        </Suspense>
    );
}
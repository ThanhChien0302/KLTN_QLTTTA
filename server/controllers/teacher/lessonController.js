// controllers/lessonController.js
const BaiHoc = require("../../models/BaiHoc");
const File = require("../../models/File");
const KhoaHoc = require("../../models/KhoaHoc");
const BuoiHoc = require("../../models/BuoiHoc");
const ThamGiaBuoiHoc = require("../../models/ThamGiaBuoiHoc");
const DangKyKhoaHoc = require("../../models/DangKyKhoaHoc");

// Lấy danh sách bài học
exports.getLessons = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await KhoaHoc.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học"
            });
        }

        const lessons = await BaiHoc.find({ LoaiKhoaHoc: course.LoaiKhoaHocID })
            .populate("LoaiKhoaHoc", "Tenloai mota")
            .populate("file files")
            .sort({ thutu: 1 });

        const totalStudents = await DangKyKhoaHoc.countDocuments({ KhoaHocID: courseId });

        const data = await Promise.all(lessons.map(async (l) => {
            const buoiHoc = await BuoiHoc.findOne({ KhoaHocID: courseId, BaiHocID: l._id });
            
            let attendedStudents = 0;
            let status = "Sắp tới";
            let ngayhoc = null;
            let giobatdau = null;
            let gioketthuc = null;

            if (buoiHoc) {
                ngayhoc = buoiHoc.ngayhoc;
                giobatdau = buoiHoc.giobatdau;
                gioketthuc = buoiHoc.gioketthuc;
                
                attendedStudents = await ThamGiaBuoiHoc.countDocuments({ 
                   buoihocID: buoiHoc._id, 
                   trangthai: { $in: ["present", "lated"] } 
                });
                
                const now = new Date();
                const realEndDate = new Date(buoiHoc.ngayhoc);
                const endObj = new Date(buoiHoc.gioketthuc);
                realEndDate.setHours(endObj.getHours(), endObj.getMinutes(), 0);
                
                const realStartDate = new Date(buoiHoc.ngayhoc);
                const startObj = new Date(buoiHoc.giobatdau);
                realStartDate.setHours(startObj.getHours(), startObj.getMinutes(), 0);

                if (now > realEndDate) {
                    status = "Đã hoàn thành";
                } else if (now >= realStartDate && now <= realEndDate) {
                    status = "Đang diễn ra";
                }
            }

            return {
                id: l._id,
                title: l.tenbai,
                description: l.mota,
                order: l.thutu,
                file: l.file,
                files: l.files,
                courseName: l.LoaiKhoaHoc?.Tenloai || "",
                courseDescription: l.LoaiKhoaHoc?.mota || "",
                createdAt: l.createdAt,
                updatedAt: l.updatedAt,
                ngayhoc,
                giobatdau,
                gioketthuc,
                attendedStudents,
                totalStudents,
                status
            };
        }));

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// Lấy chi tiết bài học
exports.getLessonById = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseId } = req.query;

        const lesson = await BaiHoc.findById(id)
            .populate("LoaiKhoaHoc", "Tenloai mota")
            .populate("file")
            .populate("files");

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài học"
            });
        }

        let ngayhoc = null;
        let giobatdau = null;
        let gioketthuc = null;
        let rollcallMap = {};

        if (courseId) {
            const buoiHoc = await BuoiHoc.findOne({ KhoaHocID: courseId, BaiHocID: id });
            if (buoiHoc) {
                ngayhoc = buoiHoc.ngayhoc;
                giobatdau = buoiHoc.giobatdau;
                gioketthuc = buoiHoc.gioketthuc;
                
                const rollcalls = await ThamGiaBuoiHoc.find({ buoihocID: buoiHoc._id });
                rollcalls.forEach(r => {
                    // Map by dangkykhoahocID
                    rollcallMap[r.dangkykhoahocID.toString()] = r.trangthai;
                });
            }
        }

        const data = {
            id: lesson._id,
            title: lesson.tenbai,
            description: lesson.mota,
            order: lesson.thutu,
            file: lesson.file,
            files: lesson.files,
            courseName: lesson.LoaiKhoaHoc?.Tenloai || "",
            courseDescription: lesson.LoaiKhoaHoc?.mota || "",
            createdAt: lesson.createdAt,
            updatedAt: lesson.updatedAt,
            ngayhoc,
            giobatdau,
            gioketthuc,
            rollcallMap
        };

        res.status(200).json({
            success: true,
            data
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// Tạo bài học
exports.createLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, order } = req.body;

        if (!title || !order) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng điền đầy đủ thông tin"
            });
        }

        const course = await KhoaHoc.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khóa học"
            });
        }

        const lesson = new BaiHoc({
            tenbai: title,
            mota: description || "",
            thutu: order,
            LoaiKhoaHoc: course.LoaiKhoaHocID,
            file: req.body.fileId || null
        });

        await lesson.save();
        await lesson.populate("LoaiKhoaHoc", "Tenloai mota");
        await lesson.populate("file");

        res.status(201).json({
            success: true,
            message: "Tạo bài học thành công",
            data: {
                id: lesson._id,
                title: lesson.tenbai,
                description: lesson.mota,
                order: lesson.thutu,
                file: lesson.file,
                courseName: lesson.LoaiKhoaHoc?.Tenloai || ""
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// Cập nhật bài học
exports.updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, order } = req.body;

        const lesson = await BaiHoc.findByIdAndUpdate(
            id,
            {
                tenbai: title,
                mota: description,
                thutu: order,
                ...(req.body.fileId && { file: req.body.fileId })
            },
            { new: true }
        ).populate("LoaiKhoaHoc", "Tenloai mota").populate("file");

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài học"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật bài học thành công",
            data: {
                id: lesson._id,
                title: lesson.tenbai,
                description: lesson.mota,
                order: lesson.thutu,
                file: lesson.file,
                courseName: lesson.LoaiKhoaHoc?.Tenloai || ""
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// Xóa bài học
exports.deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        const lesson = await BaiHoc.findByIdAndDelete(id);

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài học"
            });
        }

        res.status(200).json({
            success: true,
            message: "Xóa bài học thành công"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};
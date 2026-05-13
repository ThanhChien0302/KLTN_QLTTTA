**BỘ GIÁO DỤC VÀ ĐÀO TẠO**

**TRƯỜNG ĐẠI HỌC DUY TÂN**

![logodtu_100](data:image/png;base64...)

**Tên đề tài:**

**THIẾT KẾ VÀ PHÁT TRIỂN HỆ THỐNG QUẢN LÝ TRUNG TÂM TIẾNG ANH TÍCH HỢP ĐIỂM DANH NHẬN DIỆN KHUÔN MẶT BẰNG AI**

**∙•🙞🟏🙜•∙**

**TÀI LIỆU DATABASE**

GVHD: Phan Long

Nhóm SVTH:

Phan Thanh Chiến 28211151053

Trịnh Quang Công 28211101087

Lê Trần Bình An 28211150401

Bùi Nguyễn Ngọc Thạch 28211104344

Nguyễn Hoàng Thông 28210201094

**Đà Nẵng, tháng 09 năm 2024**

**THÔNG TIN DỰ ÁN**

|  |  |  |  |
| --- | --- | --- | --- |
| **Dự án viết tắt** | EMC | | |
| **Tên dự án** | Thiết kế và phát triển Hệ thống quản lý trung tâm tiếng anh tích hợp điểm danh nhận diện khuôn mặt bằng AI | | |
| **Ngày bắt đầu** | 12/03/2026 | **Ngày bắt đầu** | 12/03/2026 |
| **Nơi thực hiện** | Khoa Công nghệ thông tin – Đại học Duy Tân | | |
| **Mentor** | ThS.Phan Long  Email: phanlong92@gmail.com  Phone: 0903333080 | | |
| **Chủ sở hữu**  **(Product Owner)** | Trịnh Quang Công  Email: trinhcong1120@gmail.com  Tel: 0342613349 | | |
| **Quản lý dự án (Scrum Master)** | Phan Thanh Chiến | chiendtr0@gmail.com | 0705294925 |
| **Thành viên trong đội** | Trịnh Quang Công | trinhcong1120@gmail.com | 0342613349 |
| Lê Trần Bình An | lean5076@gmail.com | 0918355753 |
| Bùi Nguyễn Ngọc Thạch | thachbui283@gmail.com | 0906479546 |
| Nguyễn Hoàng Thông | thong2882004@gmail.com | 0856102428 |

**THÔNG TIN TÀI LIỆU**

|  |  |
| --- | --- |
| **Tên dự án** | Thiết kế và phát triển Hệ thống quản lý trung tâm tiếng anh tích hợp điểm danh nhận diện khuôn mặt bằng AI |
| **Tiêu đề tài liệu** | Database Document |
| **Người thực hiện** | Trịnh Quang Công |

**LỊCH SỬ CHỈNH SỬA TÀI LIỆU**

|  |  |  |  |
| --- | --- | --- | --- |
| **Phiên bản** | **Người chỉnh sửa** | **Ngày** | **Ghi chú** |
| 1.0 | Trịnh Quang Công | 01/04/2024 | Tạo tài liệu |
| 1.1 | Trịnh Quang Công | 01/04/2024 | Chỉnh sửa tài liệu |
| 1.2 | Trịnh Quang Công | 12/05/2026 | Đồng bộ collection/field với `server/models` (Mongoose). |

**PHÊ DUYỆT TÀI LIỆU**

|  |  |  |  |
| --- | --- | --- | --- |
| **Người hướng dẫn** | Phan Long | **Chữ ký** |  |
| **Ngày** | …./…./2026 |
| **Chủ sở hữu** | Trịnh Quang Công | **Chữ ký** |  |
| **Ngày** | …./…./2026 |
| **Quản lý dự án** | Phan Thanh Chiến | **Chữ ký** |  |
| **Ngày** | …./…./2026 |
| **Thành viên** | Trịnh Quang Công | **Chữ ký** |  |
| **Ngày** | …./…./2026 |
| Lê Trần Bình An | **Chữ ký** |  |
| **Ngày** | …./…./2026 |
| Bùi Nguyễn Ngọc Thạch | **Chữ ký** |  |
| **Ngày** | …./…./2026 |
| Nguyễn Hoàng Thông | **Chữ ký** |  |
| **Ngày** | …./…./2026 |

**MỤC LỤC**

[1. LỰA CHỌN CƠ SỞ DỮ LIỆU 5](#_Toc184648199)

[2. THIẾT KẾ CƠ SỞ DỮ LIỆU 5](#_Toc184648200)

[2.1. Lược đồ cơ sở dữ liệu 5](#_Toc184648201)

[2.2. Thiết kế kiến trúc bảng 6](#_Toc184648202)

[2.3. Sơ đồ thực tế liên kết 11](#_Toc184648203)

# **LỰA CHỌN CƠ SỞ DỮ LIỆU**

* Hệ thống của chúng tôi sử dụng Hệ quản trị cơ sở dữ liệu MongoDB.
* MongoDB là một hệ thống quản trị cơ sở dữ liệu NoSQL mã nguồn mở, lưu trữ dữ liệu dưới dạng các document JSON linh hoạt, phù hợp với ứng dụng có cấu trúc dữ liệu phức tạp và thay đổi thường xuyên.
* MongoDB có những đặc điểm nổi bật như sau:
* Lưu trữ dữ liệu dạng document BSON (Binary JSON) linh hoạt, không yêu cầu schema cố định.
* Hỗ trợ khả năng mở rộng ngang (horizontal scaling) và phân tán dữ liệu trên nhiều node.
* MongoDB là miễn phí (Community Edition), có thể tải trực tiếp tại trang chủ: https://www.mongodb.com
* Tốc độ truy vấn cao, phù hợp cho các ứng dụng có lượng dữ liệu lớn và yêu cầu hiệu năng cao như hệ thống quản lý điểm danh bằng AI nhận diện khuôn mặt.
* Ứng dụng của chúng tôi được thiết kế và xây dựng trên cơ sở dữ liệu MongoDB.

# **THIẾT KẾ CƠ SỞ DỮ LIỆU**

## **Lược đồ cơ sở dữ liệu**

* NguoiDung (\_id, email, password, hovaten, soDienThoai, diachi, gioitinh, ngaysinh, role, trangThaiHoatDong, daXacThuc, maOTP, hanSuDungOTP, createdAt, updatedAt): Tài khoản người dùng
* HocVien (\_id, userId, faceEmbedding, createdAt, updatedAt): Học viên, liên kết 1–1 NguoiDung; faceEmbedding mảng số (embedding khuôn mặt)
* GiangVien (\_id, userId, TrinhDoHocVan, kinhnghiem, chuyenmon, createdAt, updatedAt): Giảng viên, liên kết 1–1 NguoiDung
* Coso (\_id, Tencoso, diachi, mota, trangThaiHoatDong, createdAt, updatedAt): Cơ sở / chi nhánh
* Phonghoc (\_id, CoSoId, TenPhong, succhua, trangThaiHoatDong, createdAt, updatedAt): Phòng học
* LoaiKhoaHoc (\_id, Tenloai, mota, ChungChi, trangThaiHoatDong, createdAt, updatedAt): Loại khóa học
* KhoaHoc (\_id, tenkhoahoc, LoaiKhoaHocID, CoSoId, giangvien, ngaykhaigiang, soHocVienToiDa, lichHoc, createdAt, updatedAt): Khóa học; CoSoId tùy chọn; lichHoc: {thu, gioBatDau, gioKetThuc, phonghoc} (giờ HH:mm), tối thiểu một ca, không trùng thứ
* DangKyKhoaHoc (\_id, hocvienId, KhoaHocID, so\_ngay\_nghi, createdAt, updatedAt): Đăng ký học viên vào khóa
* BuoiHoc (\_id, KhoaHocID, BaiHocID, ngayhoc, giobatdau, gioketthuc, phonghoc, createdAt, updatedAt): Buổi học
* ThamGiaBuoiHoc (\_id, dangkykhoahocID, buoihocID, trangthai, thoigian\_checkin, thoigian\_nop, loai\_don, ngay\_bat\_dau, ngay\_ket\_thuc, lydo\_nghi, trangthai\_duyet, buoihoc\_hocbu, createdAt, updatedAt): Điểm danh / đơn nghỉ có phê duyệt
* HocBuDeXuat (\_id, nghiphepID, buoihocID, createdAt, updatedAt): Đề xuất học bù
* DeThiMau (\_id, khoaHocID, tenDe, chungChi, capDo, thoiGianLamBai, moTa, createdAt, updatedAt): Đề thi mẫu (khoaHocID tùy chọn)
* DeThiMauPhan (\_id, deThiMauID, tenPhan, thuTu, createdAt, updatedAt): Phần đề
* DeThiMauPhanNhom (\_id, deThiMauPhanID, tenNhom, thuTu, files, createdAt, updatedAt): Nhóm câu trong phần đề
* DeThiMauCauHoi (\_id, deThiMauID, deThiMauPhanID, deThiMauPhanNhomID, thuTu, loaiCauHoi, noiDung, luaChon, dapAnDungIndex, dapAnDungIndices, dapAnDungBoolean, dapAnDungText, giaiThich, files, createdAt, updatedAt): Câu hỏi đề mẫu
* BaiTap (\_id, khoahocID, tieude, mota, loai, diem, file, ngaytao, hannop, createdAt, updatedAt): Bài tập / kiểm tra
* NopBai (\_id, baitapID, dangkykhoahocID, filenop, filedapan, thoigian, trangthai, nhanxet, diem, createdAt, updatedAt): Bài nộp (trangthai: chờ chấm, đã chấm)
* LuyenTap (\_id, khoaHocID, tenBai, loaiBai, thoiGianLamBai, moTa, createdAt, updatedAt): Luyện tập (loaiBai: flashcard, quiz, trueFalse, shortAnswer, multiSelect, mixedNoFlashcard)
* LuyenTapItem (\_id, luyenTapID, thuTu, loaiItem, noiDung, matTruoc, matSau, luaChon, dapAnDungIndex, dapAnDungIndices, dapAnDungBoolean, dapAnDungText, createdAt, updatedAt): Item luyện tập
* BaiHoc (\_id, LoaiKhoaHoc, tenbai, thutu, mota, file, files, trangThaiHoatDong, createdAt, updatedAt): Bài học theo loại khóa
* KetQuaDeThi (\_id, userId, deThiMauID, diemSo, tongSoCau, soCauDung, thoiGianLamBai, chiTiet, createdAt, updatedAt): Kết quả làm đề thi mẫu (không còn collection Lesson trong codebase)
* File (\_id, url, originalName, type, size, createdAt, updatedAt): File đính kèm
* ThongBao (\_id, tieuDe, createdBy, createdByAdminId, targetType, khoaHocId, fileIds, userID, noidung, trangthaidoc, link, readByUserIds, createdAt, updatedAt): Thông báo
* KioskApiKey (\_id, tenHienThi, keyPrefix, secretSuffixHash, isLocked, isRevoked, createdAt, updatedAt): Khóa API kiosk
* KioskMisidentificationLog (\_id, hocvienId, kioskKeyId, legacyKiosk, createdAt, updatedAt): Log nhận diện sai tại kiosk

## **Thiết kế kiến trúc bảng**

* Table NguoiDung: Dùng để lưu thông tin tài khoản người dùng trong hệ thống

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| email | Varchar(255) | No | UNI | None | lowercase, trim |
| password | Varchar(255) | No |  | None | Hashed |
| hovaten | Varchar(255) | Yes |  | None | trim |
| soDienThoai | Varchar(20) | Yes |  | None | trim |
| diachi | Varchar(255) | Yes |  | None | trim |
| gioitinh | Boolean | Yes |  | true | Male: true |
| ngaysinh | Datetime | Yes |  | None |  |
| role | Enum | No |  | student | student, admin, teacher |
| trangThaiHoatDong | Boolean | No |  | true |  |
| daXacThuc | Boolean | No |  | false |  |
| maOTP | Varchar(255) | Yes |  | None |  |
| hanSuDungOTP | Datetime | Yes |  | None |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table HocVien: Dùng để lưu thông tin học viên liên kết với tài khoản người dùng

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| userId | ObjectId | No | FK | None | Ref: NguoiDung |
| faceEmbedding | Array(Float) | Yes |  |  | Vector embedding |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table GiangVien: Dùng để lưu thông tin giảng viên liên kết với tài khoản người dùng

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| userId | ObjectId | No | FK | None | Ref: NguoiDung |
| TrinhDoHocVan | Varchar(255) | Yes |  | None |  |
| kinhnghiem | Text | Yes |  | None |  |
| chuyenmon | Varchar(255) | Yes |  | None |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table Coso: Dùng để lưu thông tin các chi nhánh/cơ sở đào tạo

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| Tencoso | Varchar(255) | No |  | None |  |
| diachi | Varchar(255) | No |  | None |  |
| mota | Text | Yes |  | None |  |
| trangThaiHoatDong | Boolean | No |  | true |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table Phonghoc: Dùng để lưu thông tin phòng học thuộc từng cơ sở

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| CoSoId | ObjectId | No | FK | None | Ref: Coso |
| TenPhong | Varchar(100) | No |  | None |  |
| succhua | Int(11) | No |  | None |  |
| trangThaiHoatDong | Boolean | No |  | true |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table LoaiKhoaHoc: Dùng để phân loại các khóa học theo chứng chỉ

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| Tenloai | Varchar(255) | No |  | None |  |
| mota | Text | Yes |  | None |  |
| ChungChi | Varchar(50) | Yes |  | None | toeic, ielts |
| trangThaiHoatDong | Boolean | No |  | true |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table KhoaHoc: Dùng để lưu thông tin chi tiết về các khóa học

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| tenkhoahoc | Varchar(255) | No |  | None |  |
| LoaiKhoaHocID | ObjectId | No | FK | None | Ref: LoaiKhoaHoc |
| CoSoId | ObjectId | Yes | FK | None | Ref: Coso |
| giangvien | ObjectId | No | FK | None | Ref: GiangVien |
| ngaykhaigiang | Datetime | No |  | None |  |
| soHocVienToiDa | Int(11) | No |  | 1 |  |
| lichHoc | Array(Object) | No |  |  | {thu, gioBatDau, gioKetThuc, phonghoc}; HH:mm; ≥1 ca; không trùng thứ |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table DangKyKhoaHoc: Dùng để ghi nhận học viên đăng ký khóa học

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| hocvienId | ObjectId | No | FK | None | Ref: HocVien |
| KhoaHocID | ObjectId | No | FK | None | Ref: KhoaHoc |
| so\_ngay\_nghi | Int(11) | No |  | 0 |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table BuoiHoc: Dùng để lưu thông tin từng buổi học cụ thể

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| KhoaHocID | ObjectId | No | FK | None | Ref: KhoaHoc |
| BaiHocID | ObjectId | No | FK | None | Ref: BaiHoc |
| ngayhoc | Datetime | No |  | None |  |
| giobatdau | Datetime | No |  | None |  |
| gioketthuc | Datetime | No |  | None |  |
| phonghoc | ObjectId | No | FK | None | Ref: Phonghoc |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table ThamGiaBuoiHoc: Dùng để ghi nhận tham gia và điểm danh từng buổi học

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| dangkykhoahocID | ObjectId | No | FK | None | Ref: DangKyKhoaHoc |
| buoihocID | ObjectId | No | FK | None | Ref: BuoiHoc |
| trangthai | Enum | No |  | present | present, absent, excused, makeup |
| thoigian\_checkin | Datetime | Yes |  | None |  |
| thoigian\_nop | Datetime | Yes |  | None |  |
| loai\_don | Enum | Yes |  | None | om, viec\_rieng, cong\_tac |
| ngay\_bat\_dau | Datetime | Yes |  | None |  |
| ngay\_ket\_thuc | Datetime | Yes |  | None |  |
| lydo\_nghi | Text | Yes |  | None |  |
| trangthai\_duyet | Enum | No |  | pending | pending, approved, rejected |
| buoihoc\_hocbu | ObjectId | Yes | FK | None | Ref: BuoiHoc |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table HocBuDeXuat: Dùng để lưu đề xuất buổi học bù thay thế cho buổi vắng

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| nghiphepID | ObjectId | No | FK | None | Ref: ThamGiaBuoiHoc |
| buoihocID | ObjectId | No | FK | None | Ref: BuoiHoc |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table DeThiMau: Dùng để quản lý các đề thi mẫu theo chứng chỉ và cấp độ

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| khoaHocID | ObjectId | Yes | FK | None | Ref: KhoaHoc |
| tenDe | Varchar(255) | No |  | None |  |
| chungChi | Enum | No |  | TOEIC | TOEIC, IELTS |
| capDo | Enum | No |  | None | easy, medium, hard, dễ, trung bình, khó |
| thoiGianLamBai | Int(11) | No |  | None | Phút, min 1 |
| moTa | Text | Yes |  |  |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table DeThiMauPhan: Dùng để lưu các phần (Part) trong đề thi mẫu

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| deThiMauID | ObjectId | No | FK | None | Ref: DeThiMau |
| tenPhan | Varchar(255) | No |  | None |  |
| thuTu | Int(11) | No |  | None | min 1 |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table DeThiMauPhanNhom: Dùng để lưu các nhóm câu hỏi trong từng phần đề thi

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| deThiMauPhanID | ObjectId | No | FK | None | Ref: DeThiMauPhan |
| tenNhom | Varchar(255) | No |  | None |  |
| thuTu | Int(11) | No |  | None |  |
| files | Array(Ref) | Yes |  |  | Ref: File |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table DeThiMauCauHoi: Dùng để lưu câu hỏi trong đề thi mẫu

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| deThiMauID | ObjectId | No | FK | None | Ref: DeThiMau |
| deThiMauPhanID | ObjectId | No | FK | None | Ref: DeThiMauPhan |
| deThiMauPhanNhomID | ObjectId | Yes | FK | null | Ref: DeThiMauPhanNhom |
| thuTu | Int(11) | No |  | None | min 1 |
| loaiCauHoi | Enum | No |  | mcq | mcq, multiSelect, trueFalse, shortAnswer |
| noiDung | Text | No |  | None |  |
| luaChon | Array(String) | Yes |  |  |  |
| dapAnDungIndex | Int(11) | Yes |  | None | mcq |
| dapAnDungIndices | Array(Int) | Yes |  |  | multiSelect |
| dapAnDungBoolean | Boolean | Yes |  | None | trueFalse |
| dapAnDungText | Text | Yes |  |  | shortAnswer |
| giaiThich | Text | Yes |  |  |  |
| files | Array(Ref) | Yes |  |  | Ref: File |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table BaiTap: Dùng để quản lý bài tập và kiểm tra trong khóa học

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| khoahocID | ObjectId | No | FK | None | Ref: KhoaHoc |
| tieude | Varchar(255) | No |  | None |  |
| mota | Text | Yes |  | None |  |
| loai | Enum | No |  | homework | homework, test, listening, presentation |
| diem | Int(11) | No |  | 100 |  |
| file | ObjectId | Yes | FK | None | Ref: File |
| ngaytao | Datetime | No |  | Date.now |  |
| hannop | Datetime | No |  | None |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table NopBai: Dùng để ghi nhận bài nộp và kết quả chấm điểm của học viên

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| baitapID | ObjectId | No | FK | None | Ref: BaiTap |
| dangkykhoahocID | ObjectId | No | FK | None | Ref: DangKyKhoaHoc |
| filenop | ObjectId | Yes | FK | None | Ref: File |
| filedapan | Array(Ref) | Yes |  |  | Ref: File |
| thoigian | Datetime | No |  | Date.now |  |
| trangthai | Enum | No |  | chờ chấm | chờ chấm, đã chấm |
| nhanxet | Text | Yes |  | None |  |
| diem | Number | Yes |  | None | min 0 |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table LuyenTap: Dùng để lưu bài luyện tập tự học liên kết với khóa học

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| khoaHocID | ObjectId | Yes | FK | None | Ref: KhoaHoc |
| tenBai | Varchar(200) | No |  | None | maxlength 200 |
| loaiBai | Enum | No |  | None | flashcard, quiz, trueFalse, shortAnswer, multiSelect, mixedNoFlashcard |
| thoiGianLamBai | Int(11) | No |  | 0 | min 1 trong schema |
| moTa | Text | Yes |  |  |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table LuyenTapItem: Dùng để lưu nội dung từng item trong bài luyện tập

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| luyenTapID | ObjectId | No | FK | None | Ref: LuyenTap |
| thuTu | Int(11) | No |  | None | min 1 |
| loaiItem | Enum | No |  | None | flashcard, quiz, trueFalse, shortAnswer, multiSelect |
| noiDung | Text | Yes |  |  |  |
| matTruoc | Text | Yes |  |  | flashcard |
| matSau | Text | Yes |  |  | flashcard |
| luaChon | Array(String) | Yes |  |  | quiz/multiSelect |
| dapAnDungIndex | Int(11) | Yes |  | None | 0–3, quiz |
| dapAnDungIndices | Array(Int) | Yes |  |  | multiSelect |
| dapAnDungBoolean | Boolean | Yes |  | None | trueFalse |
| dapAnDungText | Text | Yes |  |  | shortAnswer |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table BaiHoc: Dùng để lưu nội dung từng bài học trong loại khóa học

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| LoaiKhoaHoc | ObjectId | No | FK | None | Ref: LoaiKhoaHoc |
| tenbai | Varchar(255) | No |  | None |  |
| thutu | Int(11) | No |  | None |  |
| mota | Text | Yes |  | None |  |
| file | ObjectId | Yes | FK | None | Ref: File |
| files | Array(Ref) | Yes |  |  | Ref: File |
| trangThaiHoatDong | Boolean | No |  | true |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table KetQuaDeThi: Dùng để lưu kết quả làm đề thi mẫu của người dùng (điểm, chi tiết từng câu)

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| userId | ObjectId | No | FK | None | Ref: NguoiDung |
| deThiMauID | ObjectId | No | FK | None | Ref: DeThiMau |
| diemSo | Number | No |  | 0 |  |
| tongSoCau | Number | No |  | 0 |  |
| soCauDung | Number | No |  | 0 |  |
| thoiGianLamBai | Int(11) | No |  | None | Giây |
| chiTiet | Array(Object) | No |  | [] | cauHoiId, loaiCauHoi, cauTraLoi*, dapAnDung*, ketQua |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table File: Dùng để lưu trữ thông tin file tải lên hệ thống

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| url | Varchar(255) | No |  | None | S3 / Local Path |
| originalName | Varchar(255) | Yes |  | None |  |
| type | Varchar(50) | Yes |  | None | MIME type |
| size | Int(11) | Yes |  | None | Bytes |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table ThongBao: Dùng để quản lý thông báo gửi đến người dùng

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| tieuDe | Varchar(255) | Yes |  | None |  |
| createdBy | ObjectId | Yes | FK | None | Ref: NguoiDung |
| createdByAdminId | ObjectId | Yes | FK | None | Ref: NguoiDung, legacy |
| targetType | Enum | No |  | all | all, class, personal, assignment\_submit |
| khoaHocId | ObjectId | Yes | FK | None | Ref: KhoaHoc |
| fileIds | Array(Ref) | Yes |  |  | Ref: File |
| userID | Array(Ref) | Yes |  |  | Ref: NguoiDung |
| noidung | Text | No |  | None |  |
| trangthaidoc | Boolean | No |  | false | legacy |
| link | Varchar(512) | Yes |  | None |  |
| readByUserIds | Array(Ref) | Yes |  |  | Ref: NguoiDung |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table KioskApiKey: Dùng để quản lý khóa API cho thiết bị điểm danh kiosk

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| tenHienThi | Varchar(100) | No |  | None | Device Name |
| keyPrefix | Varchar(50) | No | UNI | None |  |
| secretSuffixHash | Varchar(255) | No |  | None |  |
| isLocked | Boolean | No |  | false |  |
| isRevoked | Boolean | No |  | false |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

* Table KioskMisidentificationLog: Dùng để ghi nhận log nhận diện khuôn mặt sai tại kiosk

|  |  |  |  |  |  |
| --- | --- | --- | --- | --- | --- |
| **Field** | **Type** | **Null** | **Key** | **Default** | **Extra** |
| \_id | ObjectId | No | PK | None | Auto |
| hocvienId | ObjectId | No | FK | None | Ref: HocVien |
| kioskKeyId | ObjectId | Yes | FK | null | Ref: KioskApiKey |
| legacyKiosk | Boolean | No |  | false |  |
| createdAt | Datetime | No |  | Current |  |
| updatedAt | Datetime | No |  | Current |  |

## **Sơ đồ thực thể liên kết**

Hình 1: Sơ đồ thực thể liên kết
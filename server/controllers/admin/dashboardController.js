const HocVien = require("../../models/HocVien");
const GiangVien = require("../../models/GiangVien");
const NguoiDung = require("../../models/NguoiDung");
const KhoaHoc = require("../../models/KhoaHoc");
const LoaiKhoaHoc = require("../../models/LoaiKhoaHoc");
const Coso = require("../../models/Coso");
const DeThiMau = require("../../models/DeThiMau");
const LuyenTap = require("../../models/LuyenTap");
const KioskApiKey = require("../../models/KioskApiKey");

function buildLast7UtcDayKeys() {
  const today = new Date();
  const keys = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i));
    keys.push(d.toISOString().slice(0, 10));
  }
  return keys;
}

async function getHocVienRegistrationsByFacilityLast7Days() {
  const dayKeys = buildLast7UtcDayKeys();
  const start = new Date(`${dayKeys[0]}T00:00:00.000Z`);

  const agg = await HocVien.aggregate([
    { $match: { createdAt: { $gte: start } } },
    {
      $lookup: {
        from: "dangkykhoahocs",
        let: { hvId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$hocvienId", "$$hvId"] } } },
          { $sort: { createdAt: 1 } },
          { $limit: 1 },
        ],
        as: "en",
      },
    },
    { $unwind: { path: "$en", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "khoahocs",
        localField: "en.KhoaHocID",
        foreignField: "_id",
        as: "kh",
      },
    },
    { $unwind: { path: "$kh", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        firstPhongId: {
          $let: {
            vars: { slot: { $arrayElemAt: [{ $ifNull: ["$kh.lichHoc", []] }, 0] } },
            in: { $ifNull: ["$$slot.phonghoc", null] },
          },
        },
      },
    },
    {
      $lookup: {
        from: "phonghocs",
        localField: "firstPhongId",
        foreignField: "_id",
        as: "ph",
      },
    },
    { $unwind: { path: "$ph", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        cosoId: { $ifNull: ["$kh.CoSoId", "$ph.CoSoId"] },
      },
    },
    {
      $project: {
        dayKey: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "UTC" },
        },
        facKey: {
          $cond: [{ $ifNull: ["$cosoId", false] }, { $toString: "$cosoId" }, "__none__"],
        },
      },
    },
    {
      $group: {
        _id: { day: "$dayKey", fac: "$facKey" },
        count: { $sum: 1 },
      },
    },
  ]);

  const cellMap = new Map();
  const totalByDay = Object.fromEntries(dayKeys.map((d) => [d, 0]));
  for (const row of agg) {
    const day = row._id.day;
    const fac = row._id.fac;
    cellMap.set(`${fac}|${day}`, row.count);
    totalByDay[day] = (totalByDay[day] || 0) + row.count;
  }

  const cosos = await Coso.find({ trangThaiHoatDong: { $ne: false } })
    .select("_id Tencoso")
    .sort({ Tencoso: 1 })
    .lean();

  const appearedFac = new Set(agg.map((r) => r._id.fac));
  const knownIds = new Set(cosos.map((c) => String(c._id)));

  const series = cosos.map((c) => {
    const id = String(c._id);
    const counts = dayKeys.map((d) => cellMap.get(`${id}|${d}`) || 0);
    return { facilityId: id, name: c.Tencoso || "Cơ sở", counts };
  });

  for (const fac of appearedFac) {
    if (fac === "__none__" || knownIds.has(fac)) continue;
    const counts = dayKeys.map((d) => cellMap.get(`${fac}|${d}`) || 0);
    series.push({
      facilityId: fac,
      name: "Cơ sở (không còn hoạt động)",
      counts,
    });
  }

  if (appearedFac.has("__none__")) {
    const counts = dayKeys.map((d) => cellMap.get(`__none__|${d}`) || 0);
    series.push({ facilityId: null, name: "Chưa gán cơ sở", counts });
  }

  return {
    dates: dayKeys,
    series,
    totalsByDay: dayKeys.map((date) => ({ date, count: totalByDay[date] || 0 })),
  };
}

const getDashboard = async (req, res) => {
  try {
    const [
      hocVien,
      giangVien,
      admins,
      khoaHoc,
      loaiKhoaHoc,
      facilities,
      sampleTests,
      practiceExercises,
      kioskKeys,
      hocVienLast7DaysByFacility,
    ] = await Promise.all([
      HocVien.countDocuments(),
      GiangVien.countDocuments(),
      NguoiDung.countDocuments({ role: "admin" }),
      KhoaHoc.countDocuments(),
      LoaiKhoaHoc.countDocuments(),
      Coso.countDocuments(),
      DeThiMau.countDocuments(),
      LuyenTap.countDocuments(),
      KioskApiKey.countDocuments({ isRevoked: false }),
      getHocVienRegistrationsByFacilityLast7Days(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        counts: {
          hocVien,
          giangVien,
          admins,
          khoaHoc,
          loaiKhoaHoc,
          facilities,
          sampleTests,
          practiceExercises,
          kioskKeys,
        },
        hocVienLast7DaysByFacility,
      },
    });
  } catch (error) {
    console.error("Lỗi dashboard admin:", error);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};

module.exports = { getDashboard };

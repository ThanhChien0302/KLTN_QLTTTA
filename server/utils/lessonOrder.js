const mongoose = require('mongoose');
const BaiHoc = require('../models/BaiHoc');

/** Giá trị tạm để tránh trùng thutu khi dịch chỗ (luôn > 9999) */
const TEMP_THUTU = 900000;

function getMaxThuTu(lessons) {
  if (!lessons || lessons.length === 0) return 0;
  return Math.max(...lessons.map((l) => Number(l.thutu) || 0));
}

/**
 * Chèn tại P: không tạo lỗ trống cuối — P clamp trong [1, max+1].
 */
function clampInsertPosition(lessons, p) {
  const max = getMaxThuTu(lessons);
  const want = Math.floor(Number(p));
  if (!Number.isFinite(want) || want < 1) return 1;
  return Math.min(want, max + 1);
}

/** Chèn tại validP có làm tăng thutu các bài khác không */
function insertShiftsOthers(lessons, validP) {
  const max = getMaxThuTu(lessons);
  return validP <= max;
}

function moveShiftsOthers(lessons, lessonId, oldT, newT) {
  if (oldT === newT) return false;
  const idStr = String(lessonId);
  return lessons.some((l) => {
    if (String(l._id) === idStr) return false;
    if (oldT < newT) return l.thutu > oldT && l.thutu <= newT;
    return l.thutu >= newT && l.thutu < oldT;
  });
}

function countInsertAffected(lessons, validP) {
  return lessons.filter((l) => Number(l.thutu) >= validP).length;
}

function countMoveAffected(lessons, lessonId, oldT, newT) {
  if (oldT === newT) return 0;
  const idStr = String(lessonId);
  return lessons.filter((l) => {
    if (String(l._id) === idStr) return false;
    if (oldT < newT) return l.thutu > oldT && l.thutu <= newT;
    return l.thutu >= newT && l.thutu < oldT;
  }).length;
}

/**
 * Chèn bài mới tại validP: các bài có thutu >= validP tăng 1 (từ cao xuống thấp), rồi tạo bài mới.
 */
async function applyInsertOrder(courseTypeId, validP, createPayload) {
  const cid =
    typeof courseTypeId === 'string' ? new mongoose.Types.ObjectId(courseTypeId) : courseTypeId;

  const toBump = await BaiHoc.find({
    LoaiKhoaHoc: cid,
    thutu: { $gte: validP },
  })
    .sort({ thutu: -1 })
    .lean();

  for (const row of toBump) {
    await BaiHoc.updateOne({ _id: row._id }, { $set: { thutu: row.thutu + 1 } });
  }

  return BaiHoc.create({
    ...createPayload,
    LoaiKhoaHoc: cid,
    thutu: validP,
  });
}

/**
 * Dịch bài lessonId từ oldT sang newT; patch: các field khác (tenbai, mota, file, files).
 */
async function applyMoveOrder(courseTypeId, lessonId, oldT, newT, patch) {
  const cid =
    typeof courseTypeId === 'string' ? new mongoose.Types.ObjectId(courseTypeId) : courseTypeId;
  const lid = typeof lessonId === 'string' ? new mongoose.Types.ObjectId(lessonId) : lessonId;

  if (oldT === newT) {
    return BaiHoc.findOneAndUpdate(
      { _id: lid, LoaiKhoaHoc: cid },
      { $set: patch },
      { new: true, runValidators: true }
    );
  }

  await BaiHoc.updateOne({ _id: lid, LoaiKhoaHoc: cid }, { $set: { thutu: TEMP_THUTU } });

  if (oldT < newT) {
    const inRange = await BaiHoc.find({
      LoaiKhoaHoc: cid,
      thutu: { $gt: oldT, $lte: newT },
      _id: { $ne: lid },
    })
      .sort({ thutu: 1 })
      .lean();

    for (const row of inRange) {
      await BaiHoc.updateOne({ _id: row._id }, { $set: { thutu: row.thutu - 1 } });
    }
  } else {
    const inRange = await BaiHoc.find({
      LoaiKhoaHoc: cid,
      thutu: { $gte: newT, $lt: oldT },
      _id: { $ne: lid },
    })
      .sort({ thutu: -1 })
      .lean();

    for (const row of inRange) {
      await BaiHoc.updateOne({ _id: row._id }, { $set: { thutu: row.thutu + 1 } });
    }
  }

  const setDoc = { ...patch, thutu: newT };
  Object.keys(setDoc).forEach((k) => setDoc[k] === undefined && delete setDoc[k]);

  return BaiHoc.findOneAndUpdate(
    { _id: lid, LoaiKhoaHoc: cid },
    { $set: setDoc },
    { new: true, runValidators: true }
  );
}

async function fetchLessonsLean(courseTypeId) {
  const cid =
    typeof courseTypeId === 'string' ? new mongoose.Types.ObjectId(courseTypeId) : courseTypeId;
  return BaiHoc.find({ LoaiKhoaHoc: cid })
    .sort({ thutu: 1, createdAt: 1 })
    .lean();
}

module.exports = {
  getMaxThuTu,
  clampInsertPosition,
  insertShiftsOthers,
  moveShiftsOthers,
  countInsertAffected,
  countMoveAffected,
  applyInsertOrder,
  applyMoveOrder,
  fetchLessonsLean,
  TEMP_THUTU,
};

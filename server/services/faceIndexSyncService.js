/* eslint-disable */
const HocVien = require('../models/HocVien');
const { pushReloadToPython } = require('./attendancePythonClient');

const EMB_DIM = 512;
const SYNC_RETRY_DELAY_MS = 5000;
const SYNC_MAX_ATTEMPTS = 12;

let syncTimer = null;
let syncInFlight = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildFaceIndexItems() {
  const rows = await HocVien.find({
    faceEmbedding: { $exists: true, $not: { $size: 0 } },
  })
    .select('_id faceEmbedding')
    .lean();

  return rows
    .filter((r) => Array.isArray(r.faceEmbedding) && r.faceEmbedding.length === EMB_DIM)
    .map((r) => ({
      hocvienId: r._id.toString(),
      embedding: r.faceEmbedding,
    }));
}

/**
 * Đọc Mongo và gọi Python /reload. Không throw — log lỗi (khởi động / sau enroll).
 */
async function syncFaceIndexFromDatabase() {
  try {
    const items = await buildFaceIndexItems();
    const result = await pushReloadToPython(items);
    console.log(
      `[faceIndex] Python reload OK: ${result.count ?? items.length} embeddings`
    );
    return result;
  } catch (e) {
    console.warn('[faceIndex] Python reload failed (service chưa chạy?):', e.message || e);
    return null;
  }
}

async function syncFaceIndexWithRetry(options = {}) {
  if (syncInFlight) return syncInFlight;

  const maxAttempts = options.maxAttempts ?? SYNC_MAX_ATTEMPTS;
  const delayMs = options.delayMs ?? SYNC_RETRY_DELAY_MS;

  syncInFlight = (async () => {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      const result = await syncFaceIndexFromDatabase();
      if (result) {
        return result;
      }

      if (attempt < maxAttempts) {
        console.log(
          `[faceIndex] Sẽ thử đồng bộ lại sau ${delayMs / 1000}s (lần ${attempt + 1}/${maxAttempts})`
        );
        await sleep(delayMs);
      }
    }

    console.warn('[faceIndex] Không thể đồng bộ dữ liệu học viên sang Python sau nhiều lần thử');
    return null;
  })();

  try {
    return await syncInFlight;
  } finally {
    syncInFlight = null;
  }
}

function queueFaceIndexSync(options = {}) {
  if (syncTimer) {
    clearTimeout(syncTimer);
  }

  const delayMs = options.delayMs ?? 1500;
  syncTimer = setTimeout(() => {
    syncTimer = null;
    void syncFaceIndexWithRetry(options);
  }, delayMs);
}

module.exports = {
  syncFaceIndexFromDatabase,
  syncFaceIndexWithRetry,
  queueFaceIndexSync,
  EMB_DIM,
};

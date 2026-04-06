"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const WS_URL = `${API_BASE.replace(/^http/, "ws")}/api/kiosk/ws`;
const SESSION_KEY = "kiosk_credential";
const RECORD_SLICE_MS = 800;
/** Chờ xác nhận điểm danh; hết giờ không thao tác → quét lại. */
const CONFIRM_IDLE_MS = 10_000;

export default function KioskPage() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [credential, setCredential] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyError, setKeyError] = useState("");
  const [camError, setCamError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [statusLine, setStatusLine] = useState("");
  const [modal, setModal] = useState(null);
  const [lastRecognize, setLastRecognize] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const modalOpenRef = useRef(false);
  modalOpenRef.current = !!modal;
  const mrRef = useRef(null);

  const resetRecognition = useCallback((fromIdleTimeout = false) => {
    setModal(null);
    setLastRecognize(null);
    setStatusLine(
      fromIdleTimeout
        ? "Hết thời gian chờ — đang nhận diện lại..."
        : "Hướng mặt vào camera — đang nhận diện lại..."
    );
  }, []);

  useEffect(() => {
    if (!modal || confirming) return undefined;
    const t = setTimeout(() => resetRecognition(true), CONFIRM_IDLE_MS);
    return () => clearTimeout(t);
  }, [modal, confirming, resetRecognition]);

  useEffect(() => {
    if (modal) return;
    const r = mrRef.current;
    if (!r || r.state !== "inactive") return;
    if (!credential || !cameraReady || camError) return;
    try {
      r.start();
    } catch {
      /* ignore */
    }
  }, [modal, credential, cameraReady, camError]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setCredential(saved.trim());
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const saveCredential = (raw) => {
    const v = raw.trim();
    if (!v) {
      setKeyError("Vui lòng nhập mã kiosk.");
      return;
    }
    try {
      sessionStorage.setItem(SESSION_KEY, v);
    } catch {
      /* ignore */
    }
    setCredential(v);
    setKeyError("");
    setStatusLine("Đang khởi động camera...");
  };

  const clearCredential = () => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setCredential("");
    setKeyInput("");
    setLastRecognize(null);
    setModal(null);
    setCameraReady(false);
    setCamError("");
    setStatusLine("");
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
  };

  useEffect(() => {
    if (!credential) {
      setCameraReady(false);
      return undefined;
    }
    let stream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCamError("");
        setCameraReady(true);
        setStatusLine("Kết nối luồng nhận diện...");
      } catch {
        setCamError("Không mở được camera.");
        setStatusLine("");
        setCameraReady(false);
      }
    })();
    return () => {
      streamRef.current = null;
      setCameraReady(false);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [credential]);

  const applyRecognizeResult = useCallback((data) => {
    if (!data.success) {
      setStatusLine(data.message || "Lỗi nhận diện");
      return;
    }
    if (!data.recognized) {
      setStatusLine(data.message || "Không nhận diện được — đứng gần camera hơn.");
      return;
    }

    const { match, session, canConfirm, windowStatus } = data;
    setLastRecognize({ match, session, canConfirm, windowStatus });
    if (canConfirm && session) {
      setModal({ match, session });
      setStatusLine(`Đã nhận diện: ${match.hovaten}`);
      return;
    }

    setModal(null);
    const ws = windowStatus || "";
    const extra =
      ws === "too_early"
        ? " (chưa tới giờ điểm danh)"
        : ws === "too_late"
          ? " (đã hết khung giờ điểm danh)"
          : ws === "no_class_today"
            ? " (không có buổi học phù hợp hôm nay)"
            : "";
    setStatusLine(`Đã nhận diện: ${match.hovaten}${extra}`);
  }, []);

  useEffect(() => {
    if (!credential || !cameraReady || camError) return undefined;

    let ws;
    let mr;
    let sliceTimer;
    const recordedChunks = [];
    let cancelled = false;

    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      if (cancelled) return;
      ws.send(JSON.stringify({ type: "auth", key: credential }));
    };

    ws.onmessage = async (ev) => {
      let data;
      try {
        data = JSON.parse(ev.data);
      } catch {
        return;
      }

      if (data.type === "auth_ok") {
        if (cancelled) return;
        const stream = streamRef.current;
        if (!stream || !window.MediaRecorder) {
          setStatusLine("Thiếu MediaRecorder — dùng trình duyệt khác.");
          return;
        }
        const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp8")
          ? "video/webm;codecs=vp8"
          : MediaRecorder.isTypeSupported("video/webm")
            ? "video/webm"
            : "";
        if (!mime) {
          setStatusLine("Trình duyệt không hỗ trợ ghi WebM.");
          return;
        }
        try {
          mr = new MediaRecorder(stream, { mimeType: mime });
        } catch {
          setStatusLine("Không khởi tạo được MediaRecorder.");
          return;
        }
        mrRef.current = mr;
        const scheduleSliceStop = () => {
          if (sliceTimer) clearTimeout(sliceTimer);
          sliceTimer = setTimeout(() => {
            if (cancelled || !mr) return;
            if (modalOpenRef.current) {
              scheduleSliceStop();
              return;
            }
            if (mr.state === "recording") {
              try {
                mr.stop();
              } catch {
                scheduleSliceStop();
              }
            } else {
              scheduleSliceStop();
            }
          }, RECORD_SLICE_MS);
        };

        mr.ondataavailable = (e) => {
          if (cancelled || !e.data || !e.data.size) return;
          recordedChunks.push(e.data);
        };
        mr.onstop = async () => {
          if (cancelled) return;
          const blob =
            recordedChunks.length > 0 ? new Blob(recordedChunks, { type: mime }) : null;
          recordedChunks.length = 0;
          if (
            blob &&
            blob.size >= 32 &&
            !modalOpenRef.current &&
            ws.readyState === WebSocket.OPEN
          ) {
            const buf = await blob.arrayBuffer();
            if (modalOpenRef.current || ws.readyState !== WebSocket.OPEN) return;
            ws.send(buf);
          }
          if (!cancelled && !modalOpenRef.current && ws.readyState === WebSocket.OPEN) {
            try {
              if (mr.state === "inactive") mr.start();
            } catch {
              /* ignore */
            }
          }
          if (!cancelled) scheduleSliceStop();
        };
        mr.start();
        scheduleSliceStop();
        setStatusLine("Hướng mặt vào camera — đang nhận diện...");
        return;
      }

      if (data.type === "recognize") {
        const payload = { ...data };
        delete payload.type;
        applyRecognizeResult(payload);
        return;
      }

      if (data.type === "error") {
        setStatusLine(data.message || "Lỗi xử lý");
      }
    };

    ws.onerror = () => {
      if (!cancelled) setStatusLine("Lỗi kết nối WebSocket — kiểm tra API server.");
    };

    ws.onclose = (ev) => {
      if (mr && mr.state !== "inactive") {
        try {
          mr.stop();
        } catch {
          /* ignore */
        }
      }
      if (cancelled) return;
      if (ev.code === 4001) {
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          /* ignore */
        }
        setCredential("");
        setStatusLine("Mã kiosk không hợp lệ, đã khóa hoặc đã thu hồi.");
      }
    };

    return () => {
      cancelled = true;
      mrRef.current = null;
      if (sliceTimer) clearTimeout(sliceTimer);
      if (mr && mr.state !== "inactive") {
        try {
          mr.stop();
        } catch {
          /* ignore */
        }
      }
      if (ws && ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [credential, cameraReady, camError, applyRecognizeResult]);

  const confirmAttendance = async () => {
    if (!modal?.session || !credential) return;
    setConfirming(true);
    try {
      const r = await fetch(`${API_BASE}/api/kiosk/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Kiosk-Key": credential,
        },
        body: JSON.stringify({
          buoiHocId: modal.session.buoiHocId,
          dangkykhoahocId: modal.session.dangkykhoahocId,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data.success) throw new Error(data.message || "Xác nhận thất bại");
      setModal(null);
      setLastRecognize(null);
      setStatusLine("Điểm danh thành công — cảm ơn bạn!");
      setTimeout(() => {
        setStatusLine("Hướng mặt vào camera — đang nhận diện...");
      }, 4000);
    } catch (e) {
      setStatusLine(e.message || "Lỗi xác nhận");
    } finally {
      setConfirming(false);
    }
  };

  const fmtTime = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleString("vi-VN", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return String(d);
    }
  };

  if (!hydrated) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-gray-400 text-sm">
        Đang tải...
      </div>
    );
  }

  if (!credential) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center p-6 text-white">
        <h1 className="text-xl font-semibold mb-2 text-center">Điểm danh kiosk</h1>
        <p className="text-sm text-gray-400 text-center max-w-md mb-6">
          Nhập mã đầy đủ do quản trị viên cấp (dạng{" "}
          <span className="font-mono text-gray-300">prefix.suffix</span>).
        </p>
        {keyError ? <p className="text-red-400 text-sm mb-2">{keyError}</p> : null}
        <input
          type="password"
          autoComplete="off"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && saveCredential(keyInput)}
          placeholder="Dán mã kiosk"
          className="w-full max-w-md rounded-lg bg-black/50 border border-white/20 px-4 py-3 text-sm font-mono text-white placeholder:text-gray-600 mb-4"
        />
        <button
          type="button"
          onClick={() => saveCredential(keyInput)}
          className="w-full max-w-md py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-sm"
        >
          Tiếp tục
        </button>
      </div>
    );
  }

  const match = modal?.match || lastRecognize?.match;
  const session = modal?.session || lastRecognize?.session;
  const windowStatus = lastRecognize?.windowStatus;

  const windowHint =
    windowStatus === "too_early"
      ? "Chưa trong khung giờ điểm danh."
      : windowStatus === "too_late"
        ? "Đã hết khung giờ điểm danh."
        : windowStatus === "no_class_today"
          ? "Không có buổi học phù hợp hôm nay."
          : null;

  return (
    <div className="fixed inset-0 h-[100dvh] w-screen overflow-hidden flex flex-row bg-black">
      <div className="relative flex-[2] min-w-0 min-h-0 bg-neutral-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/55 text-white text-sm py-2.5 px-4 flex items-center justify-between gap-3">
          <span className="font-medium">Điểm danh khuôn mặt</span>
          <button
            type="button"
            onClick={clearCredential}
            className="text-xs px-3 py-1.5 rounded-md border border-white/35 hover:bg-white/10 shrink-0"
          >
            Đổi mã
          </button>
        </div>
        {camError ? (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/85 text-red-300 text-sm px-4 text-center">
            {camError}
          </div>
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-black/55 text-gray-100 text-sm px-4 py-3">
          <p className="text-center leading-snug">{statusLine}</p>
        </div>
      </div>

      <aside className="flex flex-1 min-w-[min(100%,280px)] max-w-[40vw] flex-col bg-white text-gray-900 border-l border-gray-200 shadow-xl">
        <div className="shrink-0 border-b border-gray-100 px-5 py-5 flex justify-center items-center bg-gray-50/80">
          <div
            className="flex h-[5.5rem] w-full max-w-[200px] items-center justify-center rounded-xl bg-gray-200/90 text-center text-xs font-medium text-gray-500 px-3"
            aria-hidden
          >
            Logo trung tâm
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <section className="flex flex-1 flex-col justify-center border-b border-gray-100 px-5 py-6 min-h-0 overflow-y-auto">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Thông tin học viên
            </h2>
            {match ? (
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className="h-24 w-24 shrink-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 ring-4 ring-gray-100"
                  aria-hidden
                />
                <div>
                  <p className="text-xl font-bold text-gray-900 leading-tight">{match.hovaten}</p>
                  {match.email ? (
                    <p className="text-sm text-gray-500 mt-1 break-all">{match.email}</p>
                  ) : null}
                  <p className="mt-2 inline-block rounded-md bg-gray-100 px-3 py-1 font-mono text-sm text-gray-700">
                    Mã: {match.maHocVienDisplay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetRecognition}
                  disabled={confirming}
                  className="mt-2 w-full max-w-[220px] py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm font-medium hover:bg-amber-100 disabled:opacity-50"
                >
                  Không phải tôi — nhận diện lại
                </button>
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm leading-relaxed px-2">
                Hướng mặt vào camera. Thông tin học viên sẽ hiển thị sau khi nhận diện.
              </p>
            )}
          </section>

          <section className="flex flex-1 flex-col px-5 py-6 min-h-0 overflow-y-auto">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Khóa học &amp; buổi học
            </h2>
            {modal && session ? (
              <div className="flex flex-col gap-4 flex-1 min-h-0">
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm space-y-2 text-gray-700">
                  <p>
                    <span className="text-gray-500">Khóa học:</span>{" "}
                    <span className="font-semibold text-gray-900">{session.tenkhoahoc}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Buổi học:</span>{" "}
                    {fmtTime(session.giobatdau)} — {fmtTime(session.gioketthuc)}
                  </p>
                  {session.late ? (
                    <p className="text-amber-700 font-medium text-sm pt-1">
                      Đến trong khung trễ — vẫn có thể điểm danh.
                    </p>
                  ) : null}
                </div>
                <p className="text-sm font-semibold text-gray-900">Xác nhận điểm danh?</p>
                <p className="text-xs text-gray-500">
                  Tự động quét lại sau {CONFIRM_IDLE_MS / 1000}s nếu không chọn.
                </p>
                <div className="flex flex-col gap-2 mt-auto pt-2">
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={confirmAttendance}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors"
                  >
                    {confirming ? "Đang gửi..." : "Xác nhận điểm danh"}
                  </button>
                  <button
                    type="button"
                    disabled={confirming}
                    onClick={resetRecognition}
                    className="w-full py-2.5 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                  >
                    Không phải tôi / Hủy
                  </button>
                </div>
              </div>
            ) : session && match ? (
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm space-y-2 text-gray-700">
                <p>
                  <span className="text-gray-500">Khóa học:</span>{" "}
                  <span className="font-semibold text-gray-900">{session.tenkhoahoc}</span>
                </p>
                <p>
                  <span className="text-gray-500">Buổi học:</span>{" "}
                  {fmtTime(session.giobatdau)} — {fmtTime(session.gioketthuc)}
                </p>
                {windowHint ? <p className="text-amber-800 text-sm pt-1">{windowHint}</p> : null}
              </div>
            ) : match && windowHint ? (
              <p className="text-sm text-amber-800 leading-relaxed">{windowHint}</p>
            ) : (
              <p className="text-gray-400 text-sm leading-relaxed">
                Thông tin lớp học và buổi học sẽ hiện khi đủ điều kiện điểm danh.
              </p>
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}

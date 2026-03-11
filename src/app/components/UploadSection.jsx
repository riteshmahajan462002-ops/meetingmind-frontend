"use client";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg", ".mp4", ".webm", ".flac", ".aac"];

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function UploadSection({ onFileSelect }) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [audioDuration, setAudioDuration] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    onFileSelect?.(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    const audio = new Audio(url);
    audio.onloadedmetadata = () => {
      setAudioDuration(audio.duration);
      URL.revokeObjectURL(url);
    };
  }, [onFileSelect]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const removeFile = () => {
    setFile(null);
    setAudioDuration(null);
    onFileSelect?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section
      id="upload-section"
      style={{
        padding: "0 24px 80px",
        maxWidth: "760px",
        margin: "0 auto",
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          className="inline-flex items-center gap-2 rounded-full font-bold tracking-widest uppercase"
          style={{
            background: "var(--accent-glow)",
            border: "1px solid var(--border-subtle)",
            color: "var(--accent-primary)",
            padding: "6px 16px",
            fontSize: "12px",
            marginBottom: "20px"
          }}
        >
          Step 1 of 3
        </div>
        <h2
          className="font-extrabold tracking-tight"
          style={{
            color: "var(--text-primary)",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            marginBottom: "12px",
            lineHeight: "1.2",
          }}
        >
          Upload Your Recording
        </h2>
        <p className="leading-relaxed" style={{ fontSize: "15px", color: "var(--text-secondary)" }}>
          Supports MP3, WAV, M4A, OGG, FLAC and more. Max 2 GB.
        </p>
      </div>

      {!file ? (
        /* Drop zone */
        <div
          className={`upload-zone ${dragOver ? "drag-over" : ""}`}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
          id="audio-upload-dropzone"
          style={{
            padding: "60px 40px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Animated rings when dragging */}
          {dragOver && (
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: `${i * 120}px`,
                    height: `${i * 120}px`,
                    borderRadius: "50%",
                    border: "1px solid rgba(108,99,255,0.3)",
                    animation: `spin-slow ${3 + i}s linear infinite`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: dragOver
                ? "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(16,217,160,0.2))"
                : "rgba(108,99,255,0.1)",
              border: `1px solid ${dragOver ? "rgba(108,99,255,0.4)" : "rgba(108,99,255,0.2)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              transition: "all 0.3s ease",
              transform: dragOver ? "scale(1.1)" : "scale(1)",
            }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 1C8.13 1 5 4.13 5 8V13C5 16.87 8.13 20 12 20C15.87 20 19 16.87 19 13V8C19 4.13 15.87 1 12 1Z" stroke="#6c63ff" strokeWidth="1.5" />
              <path d="M8 21H16" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 20V23" stroke="#6c63ff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="8" r="2.5" fill="#6c63ff" />
            </svg>
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>
            {dragOver ? "Drop your audio file here" : "Drag & drop your audio file"}
          </h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "15px", marginBottom: "24px" }}>
            or click to browse from your computer
          </p>

          {/* Format pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {ACCEPTED_EXTENSIONS.map((ext) => (
              <span
                key={ext}
                style={{
                  padding: "4px 12px",
                  borderRadius: "100px",
                  background: "rgba(108,99,255,0.08)",
                  border: "1px solid rgba(108,99,255,0.15)",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "var(--text-secondary)",
                  letterSpacing: "0.04em",
                }}
              >
                {ext.toUpperCase()}
              </span>
            ))}
          </div>
        </div>
      ) : (
        /* File preview */
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: "20px",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* File icon */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(16,217,160,0.2))",
                border: "1px solid rgba(108,99,255,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="2" width="14" height="17" rx="2" stroke="#a78bfa" strokeWidth="1.5" />
                <path d="M17 7H21L17 3V7Z" fill="#a78bfa" />
                <path d="M7 11H13" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M7 14H11" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* File info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "4px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </div>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {formatBytes(file.size)}
                </span>
                {audioDuration && (
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {formatDuration(audioDuration)}
                  </span>
                )}
                <span
                  style={{
                    padding: "2px 10px",
                    borderRadius: "100px",
                    background: "rgba(16,217,160,0.1)",
                    border: "1px solid rgba(16,217,160,0.2)",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "#10d9a0",
                    letterSpacing: "0.04em",
                  }}
                >
                  ✓ Ready
                </span>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={removeFile}
              id="remove-file-btn"
              style={{
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.15)",
                borderRadius: "10px",
                color: "#ff5050",
                width: "36px",
                height: "36px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.15)"; e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,80,80,0.08)"; e.currentTarget.style.transform = "scale(1)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Waveform visual placeholder */}
          <div
            style={{
              marginTop: "20px",
              height: "48px",
              borderRadius: "12px",
              background: "rgba(108,99,255,0.05)",
              border: "1px solid rgba(108,99,255,0.1)",
              display: "flex",
              alignItems: "center",
              padding: "0 16px",
              gap: "2px",
              overflow: "hidden",
            }}
          >
            {Array.from({ length: 80 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: "2px",
                  height: `${Math.random() * 70 + 15}%`,
                  borderRadius: "1px",
                  background: i % 5 === 0
                    ? "linear-gradient(180deg, #6c63ff, #10d9a0)"
                    : "rgba(108,99,255,0.3)",
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(",")}
        style={{ display: "none" }}
        id="audio-file-input"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </section>
  );
}

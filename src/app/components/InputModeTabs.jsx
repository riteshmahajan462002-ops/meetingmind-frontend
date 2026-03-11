import React from 'react';

export default function InputModeTabs({ inputMode, setInputMode }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginBottom: "50px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "100px",
          padding: "6px",
          gap: "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          width: "100%",
          maxWidth: "480px",
        }}
      >
        <button
          onClick={() => setInputMode("upload")}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: "100px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
            textAlign: "center",
            ...(inputMode === "upload"
              ? { background: "var(--accent-glow)", color: "var(--accent-primary)", fontWeight: "800" }
              : { background: "transparent", color: "var(--text-secondary)", fontWeight: "600" })
          }}
        >
          📁 Upload Audio
        </button>
        <button
          onClick={() => setInputMode("live")}
          style={{
            flex: 1,
            padding: "10px 16px",
            borderRadius: "100px",
            fontSize: "14px",
            border: "none",
            cursor: "pointer",
            transition: "all 0.3s ease",
            whiteSpace: "nowrap",
            textAlign: "center",
            ...(inputMode === "live"
              ? { background: "var(--accent-glow)", color: "var(--accent-primary)", fontWeight: "800" }
              : { background: "transparent", color: "var(--text-secondary)", fontWeight: "600" })
          }}
        >
          🎙️ Live Transcription
        </button>
      </div>
    </div>
  );
}

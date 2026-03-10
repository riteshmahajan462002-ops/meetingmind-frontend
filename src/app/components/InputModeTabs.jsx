import React from 'react';

export default function InputModeTabs({ inputMode, setInputMode }) {
  return (
    <div 
      style={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: "50px", 
        paddingLeft: "16px",
        paddingRight: "16px" 
      }}
    >
      <div 
        className="flex flex-col sm:flex-row w-full sm:w-auto shadow-sm"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-subtle)",
          borderRadius: "100px",
          padding: "6px",
          gap: "6px",
        }}
      >
        <button
          onClick={() => setInputMode("upload")}
          className="cursor-pointer transition-all duration-300 ease-in-out border-none"
          style={{
            padding: "12px 32px",
            borderRadius: "100px",
            fontSize: "15px",
            ...(inputMode === "upload" 
              ? { background: "var(--accent-glow)", color: "var(--accent-primary)", fontWeight: "800" } 
              : { background: "transparent", color: "var(--text-secondary)", fontWeight: "600" })
          }}
        >
          📁 Upload Audio
        </button>
        <button
          onClick={() => setInputMode("live")}
          className="cursor-pointer transition-all duration-300 ease-in-out border-none"
          style={{
            padding: "12px 32px",
            borderRadius: "100px",
            fontSize: "15px",
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

"use client";
import { useState } from "react";

const languageOptions = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
  { code: "pt", label: "Portuguese", flag: "🇧🇷" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
];

const outputOptions = [
  {
    id: "summary",
    icon: "📝",
    label: "Smart Summary",
    desc: "Concise paragraph overview of the entire meeting",
    color: "#6c63ff",
  },
  {
    id: "action_items",
    icon: "✅",
    label: "Action Items",
    desc: "Extracted tasks, owners, and deadlines",
    color: "#10d9a0",
  },
  {
    id: "transcript",
    icon: "📃",
    label: "Full Transcript",
    desc: "Word-by-word transcription with timestamps",
    color: "#f97316",
  },
  {
    id: "pdf",
    icon: "📄",
    label: "PDF Report",
    desc: "Downloadable formatted report with all insights",
    color: "#a78bfa",
  },
];

export default function ConfigSection({ onConfig, disabled }) {
  const [language, setLanguage] = useState("en");
  const [speakerDiarization, setSpeakerDiarization] = useState(true);
  const [selectedOutputs, setSelectedOutputs] = useState(["summary", "action_items", "pdf"]);
  const [summaryLength, setSummaryLength] = useState("medium");

  const notify = (updates) => {
    const next = { language, speakerDiarization, selectedOutputs, summaryLength, ...updates };
    onConfig?.(next);
  };

  const handleLanguage = (val) => { setLanguage(val); notify({ language: val }); };
  const handleDiarization = (val) => { setSpeakerDiarization(val); notify({ speakerDiarization: val }); };
  const handleSummaryLength = (val) => { setSummaryLength(val); notify({ summaryLength: val }); };
  const toggleOutput = (id) => {
    setSelectedOutputs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      notify({ selectedOutputs: next });
      return next;
    });
  };

  const config = { language, speakerDiarization, selectedOutputs, summaryLength };

  return (
    <section
      id="config-section"
      style={{
        padding: "0 24px 60px",
        maxWidth: "760px",
        margin: "0 auto",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.3s ease",
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 14px",
            borderRadius: "100px",
            background: "rgba(108, 99, 255, 0.1)",
            border: "1px solid rgba(108, 99, 255, 0.2)",
            marginBottom: "16px",
            fontSize: "12px",
            fontWeight: "700",
            color: "var(--accent-secondary)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Step 2 of 3
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: "800",
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          Configure Options
        </h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          Customize how your meeting is processed and what you receive.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Language + Diarization row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Language */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "16px",
              padding: "20px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "12px",
              }}
            >
              🌐 Language
            </label>
            <select
              value={language}
              onChange={(e) => handleLanguage(e.target.value)}
              id="language-select"
              style={{
                width: "100%",
                background: "rgba(0,0,0,0.2)",
                border: "1px solid var(--border-card)",
                borderRadius: "10px",
                color: "var(--text-primary)",
                padding: "10px 14px",
                fontSize: "15px",
                fontWeight: "500",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
              }}
            >
              {languageOptions.map((l) => (
                <option key={l.code} value={l.code} style={{ background: "#161b2e" }}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Speaker diarization */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "16px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--text-secondary)",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              👥 Speaker Detection
            </label>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: "1.5" }}>
              Identify and label different speakers
            </p>
            {/* Custom toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                onClick={() => handleDiarization(!speakerDiarization)}
                id="speaker-toggle"
                style={{
                  width: "48px",
                  height: "26px",
                  borderRadius: "13px",
                  background: speakerDiarization
                    ? "linear-gradient(135deg, #6c63ff, #a78bfa)"
                    : "rgba(255,255,255,0.1)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.3s ease",
                  boxShadow: speakerDiarization ? "0 0 15px rgba(108,99,255,0.4)" : "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "3px",
                    left: speakerDiarization ? "25px" : "3px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "white",
                    transition: "left 0.3s ease",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  }}
                />
              </button>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: speakerDiarization ? "var(--accent-secondary)" : "var(--text-muted)",
                }}
              >
                {speakerDiarization ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Output options */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            📦 Output Options
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {outputOptions.map((opt) => {
              const selected = selectedOutputs.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOutput(opt.id)}
                  id={`output-${opt.id}`}
                  style={{
                    background: selected
                      ? `rgba(${opt.color === "#6c63ff" ? "108,99,255" : opt.color === "#10d9a0" ? "16,217,160" : opt.color === "#f97316" ? "249,115,22" : "167,139,250"},0.12)`
                      : "rgba(0,0,0,0.15)",
                    border: `1px solid ${selected ? opt.color + "44" : "var(--border-card)"}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.25s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                  onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.background = "rgba(108,99,255,0.06)"; } }}
                  onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.background = "rgba(0,0,0,0.15)"; } }}
                >
                  <span style={{ fontSize: "24px", lineHeight: 1 }}>{opt.icon}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: selected ? opt.color : "var(--text-secondary)",
                        marginBottom: "4px",
                        transition: "color 0.25s",
                      }}
                    >
                      {opt.label}
                      {selected && (
                        <span style={{ marginLeft: "8px", fontSize: "11px", opacity: 0.8 }}>✓</span>
                      )}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: "1.4" }}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary length */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: "700",
              color: "var(--text-secondary)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            📏 Summary Detail Level
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            {[
              { id: "brief", label: "Brief", desc: "~1 paragraph" },
              { id: "medium", label: "Balanced", desc: "~3 paragraphs" },
              { id: "detailed", label: "Detailed", desc: "Full breakdown" },
            ].map((opt) => {
              const selected = summaryLength === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSummaryLength(opt.id)}
                  id={`summary-length-${opt.id}`}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    borderRadius: "10px",
                    background: selected
                      ? "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.15))"
                      : "rgba(0,0,0,0.15)",
                    border: `1px solid ${selected ? "rgba(108,99,255,0.4)" : "var(--border-card)"}`,
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "700",
                      color: selected ? "var(--accent-secondary)" : "var(--text-secondary)",
                      marginBottom: "4px",
                    }}
                  >
                    {opt.label}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{opt.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

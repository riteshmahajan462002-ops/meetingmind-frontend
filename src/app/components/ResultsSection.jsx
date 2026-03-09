"use client";
import { useState } from "react";
import { generateMeetingPDF } from "../utils/pdfGenerator";

const PRIORITY_COLORS = {
  high: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)", text: "#ef4444" },
  medium: { bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.2)", text: "#f97316" },
  low: { bg: "rgba(16,217,160,0.1)", border: "rgba(16,217,160,0.2)", text: "#10d9a0" },
};

function TabButton({ id, label, icon, active, onClick }) {
  return (
    <button
      id={id}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "10px",
        border: "none",
        background: active
          ? "linear-gradient(135deg, rgba(108,99,255,0.2), rgba(167,139,250,0.15))"
          : "transparent",
        borderBottom: active ? "none" : "none",
        color: active ? "var(--accent-secondary)" : "var(--text-muted)",
        fontSize: "14px",
        fontWeight: active ? "700" : "500",
        cursor: "pointer",
        transition: "all 0.25s ease",
        outline: active ? "1px solid rgba(108,99,255,0.25)" : "1px solid transparent",
      }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--text-secondary)"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--text-muted)"; }}
    >
      <span style={{ fontSize: "16px" }}>{icon}</span>
      {label}
    </button>
  );
}

export default function ResultsSection({ isVisible, result, onReset }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [copying, setCopying] = useState(false);

  if (!isVisible || !result) return null;

  // Use real API result directly — no mock fallback
  const data = result;

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const handleDownloadPdf = () => {
    generateMeetingPDF(data);
  };

  return (
    <section
      id="results-section"
      style={{
        padding: "0 24px 100px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 20px",
            borderRadius: "100px",
            background: "rgba(16, 217, 160, 0.1)",
            border: "1px solid rgba(16, 217, 160, 0.25)",
            marginBottom: "20px",
            fontSize: "14px",
            fontWeight: "700",
            color: "#10d9a0",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="#10d9a0" strokeWidth="2" strokeLinecap="round" />
            <path d="M22 4L12 14.01L9 11.01" stroke="#10d9a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Analysis Complete
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: "800",
            letterSpacing: "-1.5px",
            marginBottom: "8px",
            lineHeight: "1.15",
          }}
        >
          {data.title}
        </h2>
        {/* conversationType pill */}
        {data.conversationType && (
          <div style={{ marginTop: "10px", marginBottom: "4px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 14px",
                borderRadius: "100px",
                background: "rgba(108,99,255,0.1)",
                border: "1px solid rgba(108,99,255,0.25)",
                fontSize: "12px",
                fontWeight: "700",
                color: "#a78bfa",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              🎙️ {data.conversationType}
            </span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "14px",
          }}
        >
          {[
            { icon: "📅", label: data.date },
            { icon: "⏱️", label: data.duration || null },
            { icon: "👥", label: `${(data.speakers || []).length} Speakers` },
          ].filter((m) => m.label).map((m, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "100px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                fontSize: "13px",
                color: "var(--text-secondary)",
                fontWeight: "500",
              }}
            >
              {m.icon} {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Action buttons row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
          flexWrap: "wrap",
          justifyContent: "flex-end",
        }}
      >
        <button
          id="download-pdf-btn"
          onClick={handleDownloadPdf}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            color: "white",
            border: "none",
            fontSize: "14px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 6px 20px rgba(108,99,255,0.35)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 35px rgba(108,99,255,0.55)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(108,99,255,0.35)"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M21 15V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V15" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15V3" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Download PDF
        </button>
        <button
          id="copy-summary-btn"
          onClick={() => handleCopy(data.summary)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            color: copying ? "#10d9a0" : "var(--text-secondary)",
            border: `1px solid ${copying ? "rgba(16,217,160,0.3)" : "rgba(255,255,255,0.1)"}`,
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => { if (!copying) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
          onMouseLeave={(e) => { if (!copying) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
        >
          {copying ? (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 8" stroke="#10d9a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg> Copied!</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5" stroke="currentColor" strokeWidth="2" /></svg> Copy Summary</>
          )}
        </button>
        <button
          id="new-meeting-btn"
          onClick={onReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "11px 22px",
            borderRadius: "12px",
            background: "transparent",
            color: "var(--text-muted)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3 12A9 9 0 0 1 12 3C14.5 3 16.8 3.9 18.5 5.4L21 3V9H15L17.5 6.5C16.3 5.5 14.7 5 13 5C9.1 5 6 8.1 6 12H3ZM21 12A9 9 0 0 1 12 21C9.5 21 7.2 20.1 5.5 18.6L3 21V15H9L6.5 17.5C7.7 18.5 9.3 19 11 19C14.9 19 18 15.9 18 12H21Z" fill="currentColor" />
          </svg>
          New Meeting
        </button>
      </div>

      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginBottom: "24px",
          padding: "6px",
          background: "rgba(255,255,255,0.03)",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.06)",
          overflowX: "auto",
        }}
      >
        <TabButton id="tab-summary" label="Summary" icon="📝" active={activeTab === "summary"} onClick={() => setActiveTab("summary")} />
        <TabButton id="tab-actions" label="Action Items" icon="✅" active={activeTab === "actions"} onClick={() => setActiveTab("actions")} />
        <TabButton id="tab-decisions" label="Decisions" icon="💡" active={activeTab === "decisions"} onClick={() => setActiveTab("decisions")} />
        <TabButton id="tab-insights" label="Insights" icon="🔍" active={activeTab === "insights"} onClick={() => setActiveTab("insights")} />
        <TabButton id="tab-transcript" label="Transcript" icon="📃" active={activeTab === "transcript"} onClick={() => setActiveTab("transcript")} />
      </div>

      {/* Tab content */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: "20px",
          padding: "32px",
          minHeight: "300px",
        }}
      >
        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <div>
            {/* Header row with sentiment badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                paddingBottom: "20px",
                borderBottom: "1px solid var(--border-card)",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✨</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>AI-Generated Summary</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Powered by advanced LLM analysis</div>
                </div>
              </div>
              {data.sentiment && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 14px", borderRadius: "100px", background: "rgba(16,217,160,0.1)", border: "1px solid rgba(16,217,160,0.25)", fontSize: "12px", fontWeight: "700", color: "#10d9a0", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10d9a0", display: "inline-block" }} />
                  {data.sentiment}
                </span>
              )}
            </div>

            {data.oneLineSummary && (
              <p style={{ fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic", marginBottom: "16px", lineHeight: "1.6" }}>{data.oneLineSummary}</p>
            )}
            <p style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--text-secondary)", whiteSpace: "pre-line" }}>{data.summary}</p>

            {/* Key Points */}
            {(data.keyPoints || []).length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-card)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>⚡ Key Points</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.keyPoints.map((pt, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6c63ff", flexShrink: 0, marginTop: "8px" }} />
                      <span style={{ fontSize: "15px", lineHeight: "1.65", color: "var(--text-secondary)" }}>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Topics */}
            {(data.mainTopics || []).length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-card)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>🏷️ Main Topics</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {data.mainTopics.map((topic, i) => (
                    <span key={i} style={{ padding: "5px 14px", borderRadius: "100px", background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.2)", fontSize: "13px", fontWeight: "600", color: "#a78bfa" }}>{topic}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {data.nextSteps && (
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-card)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "12px" }}>🚀 Next Steps</div>
                <div style={{ display: "flex", gap: "12px", padding: "16px 18px", borderRadius: "14px", background: "rgba(249,115,22,0.06)", border: "1px solid rgba(249,115,22,0.15)" }}>
                  <span style={{ fontSize: "18px", flexShrink: 0 }}>➡️</span>
                  <p style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--text-secondary)", margin: 0 }}>{data.nextSteps}</p>
                </div>
              </div>
            )}

            {/* Participants */}
            {(data.speakers || []).length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-card)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>Participants</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {data.speakers.map((speaker, si) => (
                    <span key={si} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 14px", borderRadius: "100px", background: "rgba(108,99,255,0.08)", border: "1px solid rgba(108,99,255,0.15)", fontSize: "13px", fontWeight: "600", color: "var(--accent-secondary)" }}>
                      <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "linear-gradient(135deg, #6c63ff, #a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "800", color: "white" }}>{speaker[0]}</div>
                      {speaker}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {(data.tags || []).length > 0 && (
              <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-card)" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "10px" }}>🔖 Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {data.tags.map((tag, i) => (
                    <span key={i} style={{ padding: "4px 12px", borderRadius: "100px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px", fontWeight: "600", color: "var(--text-muted)" }}>#{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Tone Analysis */}
            {data.toneAnalysis && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px", paddingBottom: "16px", borderBottom: "1px solid var(--border-card)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎭</div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "700" }}>Tone Analysis</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Communication dynamic & emotional quality</div>
                  </div>
                </div>
                <p style={{ fontSize: "15px", lineHeight: "1.8", color: "var(--text-secondary)", padding: "16px 20px", borderRadius: "14px", background: "rgba(167,139,250,0.06)", border: "1px solid rgba(167,139,250,0.15)", margin: 0 }}>{data.toneAnalysis}</p>
              </div>
            )}

            {/* Deep Insights */}
            {(data.insights || []).length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>🧠 Deep Insights</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.insights.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "14px", padding: "14px 18px", borderRadius: "12px", background: "rgba(108,99,255,0.05)", border: "1px solid rgba(108,99,255,0.12)" }}>
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>💬</span>
                      <span style={{ fontSize: "14px", lineHeight: "1.65", color: "var(--text-secondary)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Follow-Up Questions */}
            {(data.followUpQuestions || []).length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>❓ Follow-Up Questions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.followUpQuestions.map((q, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "12px 16px", borderRadius: "12px", background: "rgba(249,115,22,0.05)", border: "1px solid rgba(249,115,22,0.12)" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#f97316", flexShrink: 0, marginTop: "1px" }}>{i + 1}.</span>
                      <span style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)" }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics */}
            {(data.keyMetrics || []).length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>📊 Key Metrics</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {data.keyMetrics.map((metric, i) => (
                    <span key={i} style={{ padding: "8px 16px", borderRadius: "12px", background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.15)", fontSize: "14px", fontWeight: "600", color: "var(--accent-secondary)" }}>
                      {typeof metric === "object" ? (metric.value ?? metric.metric) + (metric.label ? ` ${metric.label}` : "") : metric}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {(data.risks || []).length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>⚠️ Risks & Concerns</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.risks.map((risk, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", padding: "14px 18px", borderRadius: "12px", background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>🔴</span>
                      <span style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)" }}>{typeof risk === "object" ? risk.description ?? JSON.stringify(risk) : risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(data.insights || []).length === 0 && !data.toneAnalysis && (data.followUpQuestions || []).length === 0 && (
              <p style={{ fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic" }}>No deeper insights were generated for this conversation.</p>
            )}
          </div>
        )}


        {/* ACTION ITEMS TAB */}
        {activeTab === "actions" && (
          <div>
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-card)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(16,217,160,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>✅</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>Action Items</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{(data.actionItems || data.action_items || []).length} tasks identified</div>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {(data.actionItems || data.action_items || []).map((item, i) => {
                // priority is optional — fall back to a neutral style
                const p = PRIORITY_COLORS[item.priority] || {
                  bg: "rgba(108,99,255,0.1)",
                  border: "rgba(108,99,255,0.2)",
                  text: "#a78bfa",
                };
                return (
                  <div
                    key={i}
                    id={`action-item-${i}`}
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "16px 18px",
                      borderRadius: "14px",
                      background: "rgba(0,0,0,0.15)",
                      border: "1px solid var(--border-card)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(108,99,255,0.04)"; e.currentTarget.style.borderColor = "rgba(108,99,255,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.15)"; e.currentTarget.style.borderColor = "var(--border-card)"; }}
                  >
                    <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: "2px solid rgba(108,99,255,0.3)", flexShrink: 0, marginTop: "2px", cursor: "pointer" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "15px", fontWeight: "600", marginBottom: "6px", lineHeight: "1.4" }}>{item.task}</div>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        {item.owner && (
                          <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            {item.owner}
                          </span>
                        )}
                        {item.due && (
                          <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                            {item.due}
                          </span>
                        )}
                        {item.priority && (
                          <span style={{ padding: "2px 10px", borderRadius: "100px", background: p.bg, border: `1px solid ${p.border}`, fontSize: "11px", fontWeight: "700", color: p.text, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                            {item.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KEY DECISIONS TAB */}
        {activeTab === "decisions" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

            {/* Decisions */}
            <div>
              <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-card)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>💡</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>Key Decisions</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{(data.keyDecisions || data.decisions || data.key_decisions || []).length} decisions recorded</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {(data.keyDecisions || data.decisions || data.key_decisions || []).length === 0 ? (
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", fontStyle: "italic", padding: "12px 0" }}>No key decisions were recorded for this meeting.</p>
                ) : (
                  (data.keyDecisions || data.decisions || data.key_decisions || []).map((decision, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "18px 20px",
                        borderRadius: "14px",
                        background: "rgba(249,115,22,0.05)",
                        border: "1px solid rgba(249,115,22,0.12)",
                      }}
                    >
                      <div
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          background: "rgba(249,115,22,0.15)",
                          border: "1px solid rgba(249,115,22,0.25)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "13px",
                          fontWeight: "800",
                          color: "#f97316",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <span style={{ fontSize: "15px", lineHeight: "1.6", color: "var(--text-primary)", fontWeight: "500" }}>
                        {decision}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Key Metrics */}
            {(data.keyMetrics || []).length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
                  📊 Key Metrics
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
                  {data.keyMetrics.map((metric, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "16px 18px",
                        borderRadius: "14px",
                        background: "rgba(108,99,255,0.07)",
                        border: "1px solid rgba(108,99,255,0.15)",
                        textAlign: "center",
                      }}
                    >
                      <div style={{ fontSize: "22px", fontWeight: "800", color: "var(--accent-secondary)", marginBottom: "4px" }}>
                        {typeof metric === "object" ? metric.value ?? metric.metric : metric}
                      </div>
                      {typeof metric === "object" && metric.label && (
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>{metric.label}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risks */}
            {(data.risks || []).length > 0 && (
              <div>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>
                  ⚠️ Risks
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {data.risks.map((risk, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: "12px",
                        padding: "14px 18px",
                        borderRadius: "12px",
                        background: "rgba(239,68,68,0.05)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      <span style={{ fontSize: "16px", flexShrink: 0 }}>🔴</span>
                      <span style={{ fontSize: "14px", lineHeight: "1.6", color: "var(--text-secondary)" }}>
                        {typeof risk === "object" ? risk.description ?? JSON.stringify(risk) : risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TRANSCRIPT TAB */}
        {activeTab === "transcript" && (
          <div>
            <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border-card)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📃</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>Full Transcript</div>
                  <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Excerpt — download PDF for complete transcript</div>
                </div>
              </div>
            </div>
            <div
              style={{
                background: "rgba(0,0,0,0.2)",
                borderRadius: "14px",
                padding: "24px",
                fontFamily: "'Courier New', monospace",
                fontSize: "14px",
                lineHeight: "2",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-card)",
                whiteSpace: "pre-line",
                maxHeight: "520px",
                overflowY: "auto",
              }}
            >
              {data.transcriptExcerpt || data.transcript_excerpt || data.transcript || ""}
            </div>
            <div
              style={{
                marginTop: "16px",
                padding: "14px 18px",
                borderRadius: "12px",
                background: "rgba(108,99,255,0.06)",
                border: "1px solid rgba(108,99,255,0.15)",
                fontSize: "13px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#a78bfa" strokeWidth="2" />
                <path d="M12 8V12M12 16H12.01" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
              </svg>
              {data.duration ? `This is an excerpt. The complete ${data.duration} transcript is included in your PDF download.` : "The complete transcript is included in your PDF download."}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

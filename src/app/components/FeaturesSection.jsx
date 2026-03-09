"use client";

const FEATURES = [
  {
    icon: "🎙️",
    title: "99.2% Accurate Transcription",
    desc: "Military-grade speech recognition across 50+ languages with automatic punctuation and formatting.",
    color: "#6c63ff",
    gradient: "linear-gradient(135deg, rgba(108,99,255,0.12), rgba(108,99,255,0.04))",
  },
  {
    icon: "🧠",
    title: "Smart AI Summaries",
    desc: "Context-aware summaries that capture the essence of your meeting without losing critical details.",
    color: "#a78bfa",
    gradient: "linear-gradient(135deg, rgba(167,139,250,0.12), rgba(167,139,250,0.04))",
  },
  {
    icon: "✅",
    title: "Action Item Extraction",
    desc: "Automatically identifies tasks, assigns owners, and extracts deadlines from natural conversation.",
    color: "#10d9a0",
    gradient: "linear-gradient(135deg, rgba(16,217,160,0.12), rgba(16,217,160,0.04))",
  },
  {
    icon: "👥",
    title: "Speaker Diarization",
    desc: "Recognizes and labels different voices so every contribution is attributed correctly.",
    color: "#f97316",
    gradient: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))",
  },
  {
    icon: "📄",
    title: "PDF Report Generation",
    desc: "Beautiful, shareable PDF reports with your transcript, summary, and action items in one document.",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, rgba(236,72,153,0.12), rgba(236,72,153,0.04))",
  },
  {
    icon: "⚡",
    title: "Lightning Fast Processing",
    desc: "Results delivered in under 30 seconds regardless of meeting length. No waiting, no queues.",
    color: "#eab308",
    gradient: "linear-gradient(135deg, rgba(234,179,8,0.12), rgba(234,179,8,0.04))",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features-section"
      style={{
        padding: "80px 24px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "60px" }}>
        <h2
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: "900",
            letterSpacing: "-1.5px",
            marginBottom: "16px",
            lineHeight: "1.1",
          }}
        >
          Everything You Need From a{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Meeting
          </span>
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "var(--text-secondary)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          Stop taking notes. Let AI handle the details so you can focus on what matters.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {FEATURES.map((feature, i) => (
          <div
            key={feature.title}
            id={`feature-${i}`}
            style={{
              background: feature.gradient,
              border: `1px solid ${feature.color}22`,
              borderRadius: "20px",
              padding: "28px",
              transition: "all 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = `0 24px 60px ${feature.color}20`;
              e.currentTarget.style.borderColor = `${feature.color}44`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = `${feature.color}22`;
            }}
          >
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: `${feature.color}18`,
                border: `1px solid ${feature.color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                marginBottom: "18px",
              }}
            >
              {feature.icon}
            </div>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: "700",
                marginBottom: "10px",
                color: "var(--text-primary)",
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1.65",
              }}
            >
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

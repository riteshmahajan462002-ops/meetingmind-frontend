"use client";
import { useEffect, useState } from "react";

const PROCESSING_STEPS = [
  { id: "upload", label: "Uploading audio file", icon: "⬆️", duration: 1200 },
  { id: "transcribe", label: "Transcribing speech to text", icon: "🎙️", duration: 2500 },
  { id: "analyze", label: "Analyzing content & context", icon: "🧠", duration: 1800 },
  { id: "summary", label: "Generating smart summary", icon: "✨", duration: 1400 },
  { id: "actions", label: "Extracting action items", icon: "✅", duration: 1000 },
  { id: "pdf", label: "Compiling PDF report", icon: "📄", duration: 900 },
];

function WaveBar({ delay }) {
  return (
    <div
      className="animate-wave"
      style={{
        width: "4px",
        height: "100%",
        borderRadius: "2px",
        background: "linear-gradient(180deg, #6c63ff, #10d9a0)",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function ProcessingView({ isVisible, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      setCompletedSteps([]);
      return;
    }

    let stepIndex = 0;
    let totalElapsed = 0;
    const totalDuration = PROCESSING_STEPS.reduce((s, st) => s + st.duration, 0);
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 80;
      const progressPct = Math.min((elapsed / totalDuration) * 100, 99);
      setProgress(progressPct);

      // Advance steps
      let accum = 0;
      for (let i = 0; i < PROCESSING_STEPS.length; i++) {
        accum += PROCESSING_STEPS[i].duration;
        if (elapsed >= accum && !completedSteps.includes(i)) {
          setCompletedSteps((prev) => [...prev, i]);
          if (i + 1 < PROCESSING_STEPS.length) {
            setCurrentStep(i + 1);
          }
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => onComplete?.(), 600);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <section
      style={{
        padding: "0 24px 80px",
        maxWidth: "760px",
        margin: "120px auto 0",
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
            background: "rgba(249, 115, 22, 0.1)",
            border: "1px solid rgba(249, 115, 22, 0.25)",
            marginBottom: "16px",
            fontSize: "12px",
            fontWeight: "700",
            color: "#f97316",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Step 3 of 3
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: "800",
            letterSpacing: "-1px",
            marginBottom: "12px",
          }}
        >
          Processing Your Meeting
        </h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
          Our AI is hard at work — this usually takes under 30 seconds.
        </p>
      </div>

      {/* Main processing card */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-card)",
          borderRadius: "24px",
          padding: "40px",
        }}
      >
        {/* Animated waveform */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            height: "60px",
            marginBottom: "36px",
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <WaveBar key={i} delay={i * 0.06} />
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-secondary)" }}>
              {PROCESSING_STEPS[currentStep]?.label || "Finalizing..."}
            </span>
            <span
              style={{
                fontSize: "18px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            style={{
              height: "8px",
              borderRadius: "100px",
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                borderRadius: "100px",
                background: "linear-gradient(90deg, #6c63ff, #a78bfa, #10d9a0)",
                backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
                transition: "width 0.15s ease",
              }}
            />
          </div>
        </div>

        {/* Steps list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PROCESSING_STEPS.map((step, i) => {
            const isDone = completedSteps.includes(i);
            const isCurrent = i === currentStep && !isDone;
            const isPending = !isDone && !isCurrent;
            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: isCurrent
                    ? "rgba(108,99,255,0.08)"
                    : isDone
                    ? "rgba(16,217,160,0.05)"
                    : "transparent",
                  border: `1px solid ${
                    isCurrent
                      ? "rgba(108,99,255,0.2)"
                      : isDone
                      ? "rgba(16,217,160,0.15)"
                      : "transparent"
                  }`,
                  transition: "all 0.4s ease",
                }}
              >
                {/* Status indicator */}
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone
                      ? "rgba(16,217,160,0.15)"
                      : isCurrent
                      ? "rgba(108,99,255,0.15)"
                      : "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      isDone
                        ? "rgba(16,217,160,0.3)"
                        : isCurrent
                        ? "rgba(108,99,255,0.3)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    flexShrink: 0,
                    transition: "all 0.4s ease",
                    fontSize: "15px",
                  }}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L19 8" stroke="#10d9a0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : isCurrent ? (
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#6c63ff",
                        animation: "pulse-glow 1.5s ease-in-out infinite",
                      }}
                    />
                  ) : (
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                  )}
                </div>

                <span style={{ fontSize: "14px" }}>{step.icon}</span>

                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: isCurrent || isDone ? "600" : "400",
                    color: isDone
                      ? "#10d9a0"
                      : isCurrent
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                    transition: "color 0.4s ease",
                  }}
                >
                  {step.label}
                </span>

                {isCurrent && (
                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      gap: "4px",
                    }}
                  >
                    {[0, 1, 2].map((d) => (
                      <div
                        key={d}
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#6c63ff",
                          animation: `bounce-dot 1.2s ease-in-out infinite`,
                          animationDelay: `${d * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                {isDone && (
                  <span style={{ marginLeft: "auto", fontSize: "12px", color: "#10d9a0", fontWeight: "600" }}>
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

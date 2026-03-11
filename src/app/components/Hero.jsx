"use client";

function MicWave() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px", height: "32px" }}>
      {[0.3, 0.6, 1, 0.7, 0.4, 0.8, 1, 0.5, 0.9, 0.6, 0.3, 0.7].map((h, i) => (
        <div
          key={i}
          className="animate-wave"
          style={{
            width: "3px",
            height: `${h * 100}%`,
            borderRadius: "2px",
            background: `linear-gradient(180deg, #6c63ff, #10d9a0)`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

function OrbitRing({ size, speed, color, opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        opacity,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        animation: `spin-slow ${speed}s linear infinite`,
      }}
    />
  );
}

export default function Hero({ onScrollToUpload }) {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)",
          top: "10%",
          left: "-10%",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,217,160,0.08) 0%, transparent 70%)",
          bottom: "10%",
          right: "-5%",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Badge */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          borderRadius: "100px",
          background: "rgba(108,99,255,0.12)",
          border: "1px solid rgba(108,99,255,0.25)",
          marginBottom: "32px",
          fontSize: "13px",
          fontWeight: "600",
          color: "var(--accent-secondary)",
          letterSpacing: "0.04em",
        }}
      >
        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10d9a0", display: "inline-block", animation: "pulse-glow 2s ease-in-out infinite" }} />
        AI-Powered Meeting Intelligence
      </div>

      {/* Hero heading */}
      <h1
        className="animate-fade-in-up delay-100"
        style={{
          fontSize: "clamp(42px, 7vw, 80px)",
          fontWeight: "900",
          textAlign: "center",
          lineHeight: "1.05",
          letterSpacing: "-2px",
          maxWidth: "900px",
          marginBottom: "24px",
        }}
      >
        Turn Meetings Into{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #6c63ff 0%, #a78bfa 50%, #10d9a0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Actionable Insights
        </span>
      </h1>

      <p
        className="animate-fade-in-up delay-200"
        style={{
          fontSize: "18px",
          color: "var(--text-secondary)",
          textAlign: "center",
          maxWidth: "560px",
          lineHeight: "1.7",
          marginBottom: "48px",
        }}
      >
        Upload recorded audio for instant AI summaries or get live transcripts during meetings. Save time, capture every key point effortlessly
      </p>

      {/* CTA buttons */}
      <div
        className="animate-fade-in-up delay-300"
        style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "80px" }}
      >
        <button
          onClick={onScrollToUpload}
          style={{
            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
            color: "white",
            border: "none",
            padding: "16px 36px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 30px rgba(108,99,255,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 16px 50px rgba(108,99,255,0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 30px rgba(108,99,255,0.4)";
          }}
          id="hero-upload-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 16M12 2L8 6M12 2L16 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M3 21H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M3 16V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Upload Your Meeting
        </button>
        <button
          style={{
            background: "transparent",
            color: "var(--text-secondary)",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "16px 36px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            e.currentTarget.style.borderColor = "rgba(108,99,255,0.4)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
          id="hero-demo-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M10 8L16 12L10 16V8Z" fill="currentColor" />
          </svg>
          Watch Demo
        </button>
      </div>

      {/* Stats row */}
      <div
        className="animate-fade-in-up delay-400"
        style={{ display: "flex", gap: "48px", flexWrap: "wrap", justifyContent: "center" }}
      >
        {[
          { value: "99.2%", label: "Transcription Accuracy" },
          { value: "<30s", label: "Processing Time" },
          { value: "50+", label: "Languages Supported" },
          { value: "10K+", label: "Meetings Analyzed" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "800",
                background: "linear-gradient(135deg, #f0f4ff, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                letterSpacing: "-0.5px",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px", fontWeight: "500" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

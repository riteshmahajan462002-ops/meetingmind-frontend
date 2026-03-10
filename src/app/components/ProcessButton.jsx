
export default function ProcessButton({ file, handleProcess }) {
  return (
    <div
      className="max-w-[760px] px-6 pb-24"
      style={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}
    >
      <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", alignItems: "center" }}>
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
          Step 3 of 3
        </div>
        <h2
          className="font-extrabold tracking-tight"
          style={{
            color: "var(--text-primary)",
            fontSize: "clamp(24px, 3.5vw, 36px)",
            marginBottom: "12px",
            lineHeight: "1.2"
          }}
        >
          Analyze Your Meeting
        </h2>
        <p
          className="leading-relaxed"
          style={{ color: "var(--text-secondary)", fontSize: "15px" }}
        >
          {file
            ? `Ready to process "${file.name}"`
            : "Upload an audio file first to get started"}
        </p>
      </div>

      <button
        onClick={handleProcess}
        disabled={!file}
        id="start-analysis-btn"
        className={`inline-flex justify-center flex-wrap items-center gap-3 rounded-2xl font-extrabold transition-all duration-300 ease-in-out w-full sm:w-auto ${file
          ? "cursor-pointer text-white border-none" : "cursor-not-allowed border"}`}
        style={{
          padding: "16px 48px",
          fontSize: "17px",
          ...(file ? {
            background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
            boxShadow: "0 12px 40px var(--accent-glow)",
          } : {
            background: "var(--bg-secondary)",
            color: "var(--text-muted)",
            borderColor: "var(--border-card)"
          })
        }}
        onMouseEnter={(e) => {
          if (file) {
            e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
            e.currentTarget.style.boxShadow = "0 20px 60px var(--accent-glow)";
          }
        }}
        onMouseLeave={(e) => {
          if (file) {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = "0 12px 40px var(--accent-glow)";
          }
        }}
      >
        {file ? (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="rgba(255,255,255,0.2)" />
              <path d="M9.5 16.5V7.5L16.5 12L9.5 16.5Z" fill="#ffffff" />
            </svg>
            Start Analysis
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L12 16M12 2L8 6M12 2L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Upload a File First
          </>
        )}
      </button>

      {file && (
        <p
          style={{ color: "var(--text-secondary)", marginTop: "16px", fontSize: "13px" }}
        >
          🔒 Your audio is processed securely and never stored permanently
        </p>
      )}
    </div>
  );
}

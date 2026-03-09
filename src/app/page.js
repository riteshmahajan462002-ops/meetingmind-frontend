"use client";
import { useRef, useState } from "react";
import ConfigSection from "./components/ConfigSection";
import FeaturesSection from "./components/FeaturesSection";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import ProcessingView from "./components/ProcessingView";
import ResultsSection from "./components/ResultsSection";
import UploadSection from "./components/UploadSection";

const STAGES = {
  IDLE: "idle",         // landing page
  READY: "ready",      // file uploaded, show config
  PROCESSING: "processing",
  DONE: "done",
  ERROR: "error",
};

export default function Home() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [file, setFile] = useState(null);
  const [config, setConfig] = useState({
    language: "en",
    speakerDiarization: true,
    selectedOutputs: ["summary", "action_items", "pdf"],
    summaryLength: "medium",
  });
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const uploadRef = useRef(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      setStage(STAGES.READY);
      setTimeout(scrollToUpload, 100);
    } else {
      setStage(STAGES.IDLE);
    }
  };

  const apiDoneRef = useRef(false);
  const animDoneRef = useRef(false);
  const resultRef = useRef(null); // always holds latest merged result — avoids stale closure

  const transitionToDone = (mergedResult) => {
    setResult(mergedResult);
    // Defer stage change so React commits result state first,
    // guaranteeing result is non-null when ResultsSection renders
    setTimeout(() => {
      setStage(STAGES.DONE);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }, 0);
  };

  const handleProcess = async () => {
    if (!file) return;
    setErrorMsg("");
    apiDoneRef.current = false;
    animDoneRef.current = false;
    setStage(STAGES.PROCESSING);

    try {
      // ── Step 1: Transcribe ────────────────────────────────────────────────
      const formData = new FormData();
      formData.append("audio", file, "recording.webm");

      // ⚠️ Do NOT set Content-Type header — browser sets it automatically with boundary
      const transcribeRes = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!transcribeRes.ok) {
        const errText = await transcribeRes.text();
        throw new Error(errText || `Transcription failed: ${transcribeRes.status}`);
      }

      const transcribeData = await transcribeRes.json();

      // ── Step 2: Summarize ─────────────────────────────────────────────────
      const summarizeRes = await fetch("http://localhost:5000/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcribeData.data.transcript }),
      });

      if (!summarizeRes.ok) {
        const errText = await summarizeRes.text();
        throw new Error(errText || `Summarization failed: ${summarizeRes.status}`);
      }

      const summarizeData = await summarizeRes.json();

      // ── Merge both API responses ──────────────────────────────────────────
      const s = summarizeData.data || {};
      const t = transcribeData.data || {};
      const mergedResult = {
        // ── Core ──────────────────────────────────────────────────────────────
        title:               s.title || t.title || file.name,
        date:                new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        // ── From /api/summarize ───────────────────────────────────────────────
        conversationType:    s.conversationType || "",
        oneLineSummary:      s.oneLineSummary || "",
        summary:             s.fullSummary || s.summary || "",
        speakers:            s.participants || t.speakers || [],
        mainTopics:          s.mainTopics || [],
        keyPoints:           s.keyPoints || [],
        decisions:           s.decisions || s.keyDecisions || [],
        actionItems:         s.actionItems || s.action_items || [],
        keyMetrics:          s.keyMetrics || [],
        risks:               s.risks || [],
        sentiment:           s.sentiment || "",
        toneAnalysis:        s.toneAnalysis || "",
        insights:            s.insights || [],
        nextSteps:           s.nextSteps || "",
        followUpQuestions:   s.followUpQuestions || [],
        tags:                s.tags || [],
        pdf_url:             s.pdf_url || s.pdfUrl || null,
        // ── From /api/transcribe ──────────────────────────────────────────────
        transcript:          t.transcript || "",
        duration:            t.duration || "",
      };

      // Store result in ref (readable from any closure) AND in state
      resultRef.current = mergedResult;
      setResult(mergedResult);

      // Both APIs are done — transition only if animation has also finished
      apiDoneRef.current = true;
      if (animDoneRef.current) {
        transitionToDone(mergedResult);
      }
      // If animation hasn't finished yet, handleProcessingComplete will call transitionToDone
    } catch (err) {
      console.error("Processing error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStage(STAGES.ERROR);
    }
  };


  const handleProcessingComplete = () => {
    animDoneRef.current = true;
    // Read result from ref (not state) — state is a stale closure here
    if (apiDoneRef.current && resultRef.current) {
      transitionToDone(resultRef.current);
    }
    // If API hasn't finished yet, its success handler will call transitionToDone
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setErrorMsg("");
    apiDoneRef.current = false;
    animDoneRef.current = false;
    resultRef.current = null;
    setStage(STAGES.IDLE);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showLanding = stage === STAGES.IDLE || stage === STAGES.READY;
  const showProcessing = stage === STAGES.PROCESSING;
  const showResults = stage === STAGES.DONE;
  const showError = stage === STAGES.ERROR;

  return (
    <main style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Background grid pattern */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(108,99,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,99,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Hero — visible on landing */}
        {showLanding && !showResults && (
          <Hero onScrollToUpload={scrollToUpload} />
        )}

        {/* Upload + Config + Process button */}
        {!showProcessing && !showResults && !showError && (
          <div ref={uploadRef}>
            {showLanding && (
              <div style={{ maxWidth: "760px", margin: "0 auto 60px", padding: "0 24px" }}>
                <div
                  style={{
                    height: "1px",
                    background: "linear-gradient(90deg, transparent, rgba(108,99,255,0.3), transparent)",
                    marginBottom: "60px",
                  }}
                />
              </div>
            )}

            <UploadSection onFileSelect={handleFileSelect} />

            <ConfigSection disabled={!file} onConfig={setConfig} />

            {/* Process button */}
            <div
              style={{
                maxWidth: "760px",
                margin: "0 auto",
                padding: "0 24px 100px",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 14px",
                    borderRadius: "100px",
                    background: "rgba(167, 139, 250, 0.1)",
                    border: "1px solid rgba(167, 139, 250, 0.2)",
                    marginBottom: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "var(--accent-secondary)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Step 3 of 3
                </div>
                <h2
                  style={{
                    fontSize: "clamp(24px, 3.5vw, 36px)",
                    fontWeight: "800",
                    letterSpacing: "-0.8px",
                    marginBottom: "12px",
                  }}
                >
                  Analyze Your Meeting
                </h2>
                <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                  {file
                    ? `Ready to process "${file.name}"`
                    : "Upload an audio file first to get started"}
                </p>
              </div>

              <button
                onClick={handleProcess}
                disabled={!file}
                id="start-analysis-btn"
                style={{
                  padding: "18px 52px",
                  borderRadius: "16px",
                  background: file
                    ? "linear-gradient(135deg, #6c63ff, #a78bfa)"
                    : "rgba(255,255,255,0.05)",
                  color: file ? "white" : "var(--text-muted)",
                  border: file ? "none" : "1px solid rgba(255,255,255,0.08)",
                  fontSize: "17px",
                  fontWeight: "800",
                  cursor: file ? "pointer" : "not-allowed",
                  transition: "all 0.3s ease",
                  boxShadow: file ? "0 12px 40px rgba(108,99,255,0.45)" : "none",
                  letterSpacing: "-0.2px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  if (file) {
                    e.currentTarget.style.transform = "translateY(-3px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 20px 60px rgba(108,99,255,0.65)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (file) {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 12px 40px rgba(108,99,255,0.45)";
                  }
                }}
              >
                {file ? (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="rgba(255,255,255,0.2)" />
                      <path d="M9.5 16.5V7.5L16.5 12L9.5 16.5Z" fill="white" />
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
                <p style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
                  🔒 Your audio is processed securely and never stored permanently
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error state */}
        {showError && (
          <div
            style={{
              maxWidth: "600px",
              margin: "80px auto",
              padding: "0 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: "20px",
                padding: "40px 32px",
              }}
            >
              <div style={{ fontSize: "44px", marginBottom: "16px" }}>⚠️</div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  color: "#ef4444",
                  marginBottom: "12px",
                }}
              >
                Processing Failed
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  lineHeight: "1.6",
                  marginBottom: "28px",
                }}
              >
                {errorMsg}
              </p>
              <button
                onClick={handleReset}
                style={{
                  padding: "12px 32px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  color: "white",
                  border: "none",
                  fontSize: "15px",
                  fontWeight: "700",
                  cursor: "pointer",
                  boxShadow: "0 8px 24px rgba(108,99,255,0.4)",
                }}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Features section — visible on idle landing only */}
        {stage === STAGES.IDLE && <FeaturesSection />}

        {/* Processing view */}
        <ProcessingView
          isVisible={showProcessing}
          onComplete={handleProcessingComplete}
        />

        {/* Results */}
        <ResultsSection isVisible={showResults} result={result} onReset={handleReset} />

        {/* Footer */}
        {!showProcessing && (
          <footer
            style={{
              borderTop: "1px solid rgba(255,255,255,0.05)",
              padding: "32px 24px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "7px",
                  background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1C8.13 1 5 4.13 5 8C5 12.5 12 23 12 23C12 23 19 12.5 19 8C19 4.13 15.87 1 12 1Z" fill="white" opacity="0.9" />
                  <circle cx="12" cy="8" r="3" fill="white" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #f0f4ff, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                MeetingMind
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              © 2026 MeetingMind · AI Meeting Intelligence · Built with Next.js
            </p>
          </footer>
        )}
      </div>
    </main>
  );
}

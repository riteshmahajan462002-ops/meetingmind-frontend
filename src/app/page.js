"use client";
import { useRef, useState } from "react";
import ConfigSection from "./components/ConfigSection";
import ErrorState from "./components/ErrorState";
import FeaturesSection from "./components/FeaturesSection";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import InputModeTabs from "./components/InputModeTabs";
import LiveTranscription from "./components/LiveTranscription";
import Navbar from "./components/Navbar";
import ProcessButton from "./components/ProcessButton";
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
  const [inputMode, setInputMode] = useState("upload"); // "upload" | "live"
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
      // Pass config options so the backend can respect user preferences
      formData.append("language", config.language);
      formData.append("speakerDiarization", String(config.speakerDiarization));

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
        body: JSON.stringify({
          transcript: transcribeData.data.transcript,
          language: config.language,
          summaryLength: config.summaryLength,
          selectedOutputs: config.selectedOutputs,
        }),
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
        title: s.title || t.title || file.name,
        date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        // ── From /api/summarize ───────────────────────────────────────────────
        conversationType: s.conversationType || "",
        oneLineSummary: s.oneLineSummary || "",
        summary: s.fullSummary || s.summary || "",
        speakers: s.participants || t.speakers || [],
        mainTopics: s.mainTopics || [],
        keyPoints: s.keyPoints || [],
        decisions: s.decisions || s.keyDecisions || [],
        actionItems: s.actionItems || s.action_items || [],
        keyMetrics: s.keyMetrics || [],
        risks: s.risks || [],
        sentiment: s.sentiment || "",
        toneAnalysis: s.toneAnalysis || "",
        insights: s.insights || [],
        nextSteps: s.nextSteps || "",
        followUpQuestions: s.followUpQuestions || [],
        tags: s.tags || [],
        pdf_url: s.pdf_url || s.pdfUrl || null,
        // ── From /api/transcribe ──────────────────────────────────────────────
        transcript: t.transcript || "",
        duration: t.duration || "",
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
    <main className="min-h-screen">
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

      <div className="relative z-10">
        {/* Hero — visible on landing */}
        {showLanding && !showResults && (
          <Hero onScrollToUpload={scrollToUpload} />
        )}

        {/* Upload + Config + Process button */}
        {!showProcessing && !showResults && !showError && (
          <div ref={uploadRef}>
            {showLanding && (
              <div className="max-w-[760px] mx-auto mb-[60px] px-6">
                <div className="h-px bg-linear-to-r from-transparent via-[rgba(108,99,255,0.3)] to-transparent mb-[60px]" />
              </div>
            )}

            {/* Input Mode Tabs */}
            <InputModeTabs inputMode={inputMode} setInputMode={setInputMode} />

            {inputMode === "upload" ? (
              <>
                <UploadSection onFileSelect={handleFileSelect} />
                <ConfigSection disabled={!file} onConfig={setConfig} />
              </>
            ) : (
              <div className="flex justify-center items-start w-full px-4 sm:px-6">
                <LiveTranscription />
              </div>
            )}

            {/* Process button - Only show in upload mode */}
            {inputMode === "upload" && (
              <ProcessButton file={file} handleProcess={handleProcess} />
            )}
          </div>
        )}

        {/* Error state */}
        {showError && (
          <ErrorState errorMsg={errorMsg} handleReset={handleReset} />
        )}

        {/* Features section — visible on idle landing only */}
        {stage === STAGES.IDLE && <FeaturesSection />}

        {/* Processing view */}
        <ProcessingView
          isVisible={showProcessing}
          onComplete={handleProcessingComplete}
        />

        {/* Results */}
        <ResultsSection isVisible={showResults} result={result} onReset={handleReset} selectedOutputs={config.selectedOutputs} />

        {/* Footer */}
        {!showProcessing && <Footer />}
      </div>
    </main>
  );
}

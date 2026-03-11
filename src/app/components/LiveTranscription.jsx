"use client";
import { useRealtimeRecorder } from "@/hooks/useRealtimeRecorder";
import { generateSummary } from "@/lib/api";
import { useState } from "react";

const SPEAKER_COLORS = ["#60a5fa", "#34d399", "#f59e0b", "#f87171", "#a78bfa"];

function getSpeakerColor(speaker) {
    if (!speaker) return "#a1a1aa";
    const num = parseInt(speaker.replace(/\D/g, ""), 10);
    return SPEAKER_COLORS[isNaN(num) ? 0 : num % SPEAKER_COLORS.length];
}

export default function LiveTranscription({ onSummaryGenerated }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        isRecording,
        sessionId,
        partialText,
        finalLines,
        fullTranscript,
        error,
        startRecording,
        stopRecording,
        correctedTranscript,
        isDiarizing,
    } = useRealtimeRecorder();

    const handleSummary = async () => {
        if (!sessionId) return;
        setLoading(true);
        try {
            const result = await generateSummary(sessionId);
            setSummary(result);
            if (onSummaryGenerated) onSummaryGenerated(result);
        } catch (err) {
            alert("Summary failed: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Renders one speaker line — unchanged
    const SpeakerLine = ({ speaker, text }) => (
        <div style={{ display: "flex", gap: "12px", marginBottom: "8px", alignItems: "flex-start" }}>
            <span
                className="font-bold tracking-[0.5px] uppercase shrink-0"
                style={{ color: getSpeakerColor(speaker), minWidth: "70px", fontSize: "11px", paddingTop: "3px" }}
            >
                {speaker || "—"}
            </span>
            <span style={{ color: "var(--text-primary)", lineHeight: "1.7", fontSize: "15px" }}>
                {text}
            </span>
        </div>
    );

    return (
        <div style={{ width: "100%", maxWidth: "900px", fontFamily: "inherit" }}>

            {/* ── Error ── */}
            {error && (
                <div
                    style={{
                        background: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        color: "#ef4444",
                        padding: "16px 20px",
                        borderRadius: "12px",
                        marginBottom: "24px",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "15px"
                    }}
                >
                    <span style={{ fontSize: "20px" }}>⚠️</span> {error}
                </div>
            )}

            {/* ── Controls ── */}
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginBottom: "32px", width: "100%" }}>
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="border-none cursor-pointer flex items-center gap-2 transition-transform"
                        style={{
                            padding: "16px 32px",
                            background: "linear-gradient(135deg, #22c55e, #16a34a)",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0 8px 20px rgba(34,197,94,0.25)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "white" }} />
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="border-none cursor-pointer flex items-center gap-2 transition-transform"
                        style={{
                            padding: "16px 32px",
                            background: "linear-gradient(135deg, #ef4444, #dc2626)",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0 8px 20px rgba(239,68,68,0.25)"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "white" }} />
                        Stop Recording
                    </button>
                )}

                {/* Summary button — only show once corrected transcript is ready */}
                {!isRecording && correctedTranscript && (
                    <button
                        onClick={handleSummary}
                        disabled={loading}
                        className="border-none flex items-center gap-2 transition-all"
                        style={{
                            padding: "16px 32px",
                            background: "linear-gradient(135deg, #6c63ff, #a78bfa)",
                            color: "white",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0 8px 20px rgba(108,99,255,0.25)",
                            cursor: loading ? "default" : "pointer",
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.transform = "translateY(0)"; }}
                    >
                        ✨ {loading ? "Generating Summary..." : "Generate Summary"}
                    </button>
                )}
            </div>

            {/* ── Live Transcript Box ── */}
            <div
                style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "20px",
                    padding: "24px",
                    minHeight: "300px",
                    marginBottom: "32px",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    textAlign: "left",
                    width: "100%"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-card)" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "2px" }}>
                        LIVE TRANSCRIPT
                    </div>
                    {sessionId && (
                        <div style={{ fontSize: "12px", color: "#6c63ff", background: "rgba(108, 99, 255, 0.1)", padding: "4px 12px", borderRadius: "100px", fontWeight: "600", whiteSpace: "nowrap" }}>
                            Session: {sessionId.slice(-8)}
                        </div>
                    )}
                </div>

                <div className="font-mono" style={{ fontSize: "15px", lineHeight: "1.8" }}>

                    {/* Final confirmed lines */}
                    {finalLines.map((line, i) => {
                        if (line.segments && line.segments.length > 0) {
                            return (
                                <div key={i} style={{ marginBottom: "12px" }}>
                                    {line.segments.map((seg, j) => (
                                        <SpeakerLine key={j} speaker={seg.speaker} text={seg.text} />
                                    ))}
                                </div>
                            );
                        }
                        return (
                            <div key={i} style={{ marginBottom: "12px" }}>
                                <SpeakerLine speaker={line.speaker} text={line.text} />
                            </div>
                        );
                    })}

                    {/* Partial live words */}
                    {partialText && (
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", opacity: 0.7 }}>
                            <span
                                className="font-bold tracking-[0.5px] uppercase shrink-0"
                                style={{ color: getSpeakerColor(partialText.speaker), minWidth: "70px", fontSize: "11px", paddingTop: "3px" }}
                            >
                                {partialText.speaker || "—"}
                            </span>
                            <span style={{ color: "#a78bfa", fontStyle: "italic", lineHeight: "1.7" }}>
                                {partialText.text}
                                <span className="inline-block animate-pulse" style={{ width: "8px", height: "15px", background: "#a78bfa", marginLeft: "4px", verticalAlign: "middle" }} />
                            </span>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isRecording && finalLines.length === 0 && !partialText && (
                        <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0", fontStyle: "italic" }}>
                            Press <span style={{ color: "#22c55e", fontWeight: "600" }}>Start Recording</span> to begin...
                        </div>
                    )}
                </div>
            </div>

            {/* ── Diarizing spinner ── */}
            {/* Shows between session-stopped and transcript-corrected (~15–30s) */}
            {isDiarizing && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        background: "rgba(108, 99, 255, 0.06)",
                        border: "1px solid rgba(108, 99, 255, 0.2)",
                        borderRadius: "14px",
                        padding: "18px 24px",
                        marginBottom: "24px",
                    }}
                >
                    {/* Spinner ring */}
                    <div style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: "2px solid rgba(108,99,255,0.2)",
                        borderTopColor: "#6c63ff",
                        animation: "spin 0.8s linear infinite",
                        flexShrink: 0,
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div>
                        <div style={{ color: "#a78bfa", fontWeight: "600", fontSize: "14px" }}>
                            Identifying speakers...
                        </div>
                        <div style={{ color: "var(--text-muted)", fontSize: "12px", marginTop: "2px" }}>
                            Gladia is analysing the full audio — usually takes 15–30 seconds
                        </div>
                    </div>
                </div>
            )}

            {/* ── Corrected Transcript ── */}
            {/* Replaces the approximate live labels with accurate speaker IDs */}
            {correctedTranscript && (
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid rgba(52, 211, 153, 0.25)",  // green tint = "verified"
                        borderRadius: "20px",
                        padding: "24px",
                        marginBottom: "32px",
                        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        width: "100%",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                        marginBottom: "24px",
                        paddingBottom: "16px",
                        borderBottom: "1px solid var(--border-card)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "2px" }}>
                                FINAL TRANSCRIPT
                            </div>
                            {/* Verified badge */}
                            <div style={{
                                fontSize: "11px",
                                color: "#34d399",
                                background: "rgba(52, 211, 153, 0.1)",
                                border: "1px solid rgba(52, 211, 153, 0.2)",
                                padding: "2px 10px",
                                borderRadius: "100px",
                                fontWeight: "600",
                                whiteSpace: "nowrap",
                            }}>
                                ✓ Speaker-verified
                            </div>
                        </div>

                        {/* Speaker count pill */}
                        <div style={{
                            fontSize: "12px",
                            color: "#60a5fa",
                            background: "rgba(96, 165, 250, 0.1)",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            fontWeight: "600",
                            whiteSpace: "nowrap",
                        }}>
                            🎙 {correctedTranscript.speakerCount} speaker{correctedTranscript.speakerCount !== 1 ? "s" : ""} detected
                        </div>
                    </div>

                    {/* Segments — accurate diarized output */}
                    <div className="font-mono" style={{ fontSize: "15px", lineHeight: "1.8" }}>
                        {correctedTranscript.segments.map((seg, i) => (
                            <div key={i} style={{ marginBottom: "12px" }}>
                                <SpeakerLine speaker={seg.speaker} text={seg.text} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Summary ── */}
            {summary && summary.summary && (
                <div
                    style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-card)",
                        borderRadius: "24px",
                        padding: "36px",
                        marginTop: "8px",
                        width: "100%",
                        boxShadow: "0 4px 32px rgba(108,99,255,0.08)",
                    }}
                >
                    {/* Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <span style={{ fontSize: "16px" }}>✨</span>
                        <span style={{ fontSize: "12px", color: "var(--accent-secondary)", fontWeight: "800", letterSpacing: "2px" }}>
                            SUMMARY
                        </span>
                    </div>

                    <h2 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", lineHeight: "1.3", marginBottom: "12px" }}>
                        {summary.summary.title}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7", marginBottom: "32px" }}>
                        {summary.summary.oneLineSummary}
                    </p>

                    {/* Two-column grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "32px", marginBottom: "28px" }}>

                        {summary.summary.mainTopics?.length > 0 && (
                            <div>
                                <div style={{ color: "#60a5fa", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "14px" }}>
                                    MAIN TOPICS
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {summary.summary.mainTopics.map((t, i) => (
                                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                            <span style={{ color: "#60a5fa", fontSize: "13px", marginTop: "2px", flexShrink: 0 }}>◆</span>
                                            <span style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>{t}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {summary.summary.actionItems?.length > 0 && (
                            <div>
                                <div style={{ color: "var(--accent-green)", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "14px" }}>
                                    ACTION ITEMS
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                    {summary.summary.actionItems.map((a, i) => (
                                        <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                                            <span style={{ color: "var(--accent-green)", fontSize: "14px", fontWeight: "700", flexShrink: 0, marginTop: "1px" }}>✓</span>
                                            <div style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.6" }}>
                                                {a.task}
                                                {a.owner && (
                                                    <span style={{
                                                        color: "var(--accent-green)",
                                                        fontWeight: "600",
                                                        fontSize: "12px",
                                                        background: "rgba(16,217,160,0.1)",
                                                        padding: "1px 8px",
                                                        borderRadius: "100px",
                                                        marginLeft: "6px",
                                                        whiteSpace: "nowrap",
                                                    }}>
                                                        {a.owner}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Next Steps */}
                    {summary.summary.nextSteps && (
                        <div style={{
                            background: "rgba(245,158,11,0.06)",
                            border: "1px solid rgba(245,158,11,0.15)",
                            borderRadius: "14px",
                            padding: "20px 24px",
                        }}>
                            <div style={{ color: "var(--accent-orange)", fontSize: "11px", fontWeight: "700", letterSpacing: "1.5px", marginBottom: "10px" }}>
                                NEXT STEPS
                            </div>
                            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
                                {summary.summary.nextSteps}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
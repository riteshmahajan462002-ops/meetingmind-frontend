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

    // Renders one speaker line
    const SpeakerLine = ({ speaker, text }) => (
        <div style={{ display: "flex", gap: "12px", marginBottom: "8px", alignItems: "flex-start" }}>
            <span
                className="font-bold tracking-[0.5px] uppercase shrink-0"
                style={{ color: getSpeakerColor(speaker), minWidth: "100px", fontSize: "11px", paddingTop: "3px" }}
            >
                {speaker || "—"}
            </span>
            <span style={{ color: "var(--text-primary)", lineHeight: "1.7", fontSize: "15px" }}>
                {text}
            </span>
        </div>
    );

    return (
        <div style={{ width: "70%", fontFamily: "inherit" }}>
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
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap", marginBottom: "32px", width: "100%" }}>
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

                {!isRecording && fullTranscript && (
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
                    padding: "32px",
                    minHeight: "300px",
                    marginBottom: "32px",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    textAlign: "left",
                    width: "100%"
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-card)" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", letterSpacing: "2px" }}>
                        LIVE TRANSCRIPT
                    </div>
                    {sessionId && (
                        <div style={{ fontSize: "12px", color: "#6c63ff", background: "rgba(108, 99, 255, 0.1)", padding: "4px 12px", borderRadius: "100px" }}>
                            Session: {sessionId.slice(-8)}
                        </div>
                    )}
                </div>

                <div className="font-mono" style={{ fontSize: "15px", lineHeight: "1.8" }}>

                    {/* ── Final confirmed lines ── */}
                    {finalLines.map((line, i) => {
                        // Has multiple speaker segments in one turn
                        if (line.segments && line.segments.length > 0) {
                            return (
                                <div key={i} style={{ marginBottom: "12px" }}>
                                    {line.segments.map((seg, j) => (
                                        <SpeakerLine key={j} speaker={seg.speaker} text={seg.text} />
                                    ))}
                                </div>
                            );
                        }
                        // Single line with or without speaker
                        return (
                            <div key={i} style={{ marginBottom: "12px" }}>
                                <SpeakerLine speaker={line.speaker} text={line.text} />
                            </div>
                        );
                    })}

                    {/* ── Partial live words ── */}
                    {partialText && (
                        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", opacity: 0.7 }}>
                            <span
                                className="font-bold tracking-[0.5px] uppercase shrink-0"
                                style={{ color: getSpeakerColor(partialText.speaker), minWidth: "100px", fontSize: "11px", paddingTop: "3px" }}
                            >
                                {partialText.speaker || "—"}
                            </span>
                            <span style={{ color: "#a78bfa", fontStyle: "italic", lineHeight: "1.7" }}>
                                {partialText.text}
                                <span className="inline-block animate-pulse" style={{ width: "8px", height: "15px", background: "#a78bfa", marginLeft: "4px", verticalAlign: "middle" }} />
                            </span>
                        </div>
                    )}

                    {/* ── Empty state ── */}
                    {!isRecording && finalLines.length === 0 && !partialText && (
                        <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0", fontStyle: "italic" }}>
                            Press <span style={{ color: "#22c55e", fontWeight: "600" }}>Start Recording</span> to begin...
                        </div>
                    )}
                </div>
            </div>

            {/* ── Summary ── */}
            {summary && summary.summary && (
                <div className="bg-linear-to-b from-[#6c63ff]/5 to-[#a78bfa]/5 border border-[#a78bfa]/20 rounded-[20px] p-10">
                    <div className="text-[13px] text-[#a78bfa] font-bold tracking-[2px] mb-6">✨ SUMMARY</div>
                    <h2 className="text-[26px] font-extrabold mb-2 text-(--text-primary)">{summary.summary.title}</h2>
                    <p className="text-zinc-400 text-base mb-8">{summary.summary.oneLineSummary}</p>

                    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 mb-6">
                        {summary.summary.mainTopics?.length > 0 && (
                            <div className="bg-[rgba(255,255,255,0.03)] p-5 rounded-[14px]">
                                <div className="text-blue-400 text-xs font-bold mb-3 tracking-[1px]">MAIN TOPICS</div>
                                {summary.summary.mainTopics.map((t, i) => (
                                    <div key={i} className="text-zinc-200 flex gap-2.5 mb-2 text-sm">
                                        <span className="text-blue-400">◆</span> {t}
                                    </div>
                                ))}
                            </div>
                        )}

                        {summary.summary.actionItems?.length > 0 && (
                            <div className="bg-[rgba(255,255,255,0.03)] p-5 rounded-[14px]">
                                <div className="text-emerald-400 text-xs font-bold mb-3 tracking-[1px]">ACTION ITEMS</div>
                                {summary.summary.actionItems.map((a, i) => (
                                    <div key={i} className="text-zinc-200 flex gap-2.5 mb-2 text-sm">
                                        <span className="text-emerald-400">✓</span>
                                        <div>
                                            {a.task}
                                            {a.owner && <span className="bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full text-[11px] ml-2">{a.owner}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {summary.summary.nextSteps && (
                        <div className="bg-amber-500/5 p-5 rounded-[14px] border border-amber-500/10">
                            <div className="text-amber-400 text-xs font-bold mb-2.5 tracking-[1px]">NEXT STEPS</div>
                            <p className="text-zinc-200 text-sm leading-[1.6] m-0">{summary.summary.nextSteps}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

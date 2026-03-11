"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// ── Socket singleton ──────────────────────────────────────────
let socket: Socket | null = null;

function getSocket(): Socket {
    if (!socket) {
        socket = io("http://localhost:5000", {
            transports: ["websocket"],
            autoConnect: false,
        });
    }
    return socket;
}

// ── Types ─────────────────────────────────────────────────────
interface Segment {
    speaker: string;
    text: string;
}

interface FinalLine {
    text: string;
    speaker: string | null;
    segments: Segment[];
}

interface PartialLine {
    text: string;
    speaker: string | null;
}

// NEW: what comes back from the async diarization layer
interface CorrectedTranscript {
    segments: Segment[];      // [{ speaker: "Speaker 0", text: "..." }, ...]
    transcript: string;       // full formatted string "Speaker 0: ...\nSpeaker 1: ..."
    speakerCount: number;     // how many unique speakers Gladia detected
}

// ── Hook ──────────────────────────────────────────────────────
export function useRealtimeRecorder() {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [partialText, setPartialText] = useState<PartialLine | null>(null);
    const [finalLines, setFinalLines] = useState<FinalLine[]>([]);
    const [fullTranscript, setFullTranscript] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    // NEW: accurate diarized transcript arrives ~15–30s after session stops
    const [correctedTranscript, setCorrectedTranscript] = useState<CorrectedTranscript | null>(null);
    // NEW: true while we're waiting for the async diarization result
    const [isDiarizing, setIsDiarizing] = useState<boolean>(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const workletRef = useRef<AudioWorkletNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isRecordingRef = useRef<boolean>(false);
    const sessionIdRef = useRef<string | null>(null);

    // Cleanup listeners on unmount
    useEffect(() => {
        return () => {
            const s = getSocket();
            s.off("session-started");
            s.off("transcript-partial");
            s.off("transcript-final");
            s.off("session-stopped");
            s.off("session-error");
            s.off("transcript-corrected"); // NEW
        };
    }, []);

    const startRecording = useCallback(async () => {
        // ── Reset all state ──────────────────────────────────
        setError(null);
        setFinalLines([]);
        setPartialText(null);
        setFullTranscript("");
        setSessionId(null);
        setCorrectedTranscript(null); // NEW
        setIsDiarizing(false);        // NEW
        sessionIdRef.current = null;
        isRecordingRef.current = true;

        const s = getSocket();

        // Force fresh connection each recording
        if (s.connected) {
            s.disconnect();
            await new Promise<void>((r) => setTimeout(r, 200));
        }

        s.connect();
        await new Promise<void>((resolve) => s.once("connect", resolve));
        console.log("✅ Socket connected:", s.id);

        // ── Register socket listeners ─────────────────────────
        s.off("session-started");
        s.off("transcript-partial");
        s.off("transcript-final");
        s.off("session-stopped");
        s.off("session-error");
        s.off("transcript-corrected"); // NEW

        s.on("transcript-partial", ({ text, speaker }: { text: string; speaker: string | null }) => {
            console.log("📝 Partial:", speaker, text);
            setPartialText({ text, speaker: speaker ?? null });
        });

        s.on("transcript-final", ({ text, speaker, segments }: {
            text: string;
            speaker: string | null;
            segments: Segment[];
        }) => {
            console.log("✅ Final:", segments ?? [{ speaker, text }]);
            setFinalLines((prev) => [
                ...prev,
                {
                    text,
                    speaker: speaker ?? null,
                    segments: segments ?? [],
                },
            ]);
            setPartialText(null);
        });

        s.on("session-stopped", ({ transcript }: { transcript: string }) => {
            console.log("⏹ Stopped, length:", transcript?.length);
            setFullTranscript(transcript || "");
            // NEW: session stopped → async diarization is now running on the backend
            setIsDiarizing(true);
        });

        // NEW ─────────────────────────────────────────────────
        // Fires ~15–30s after session stops with accurate speaker labels.
        // speakerCount tells you exactly how many people Gladia detected.
        s.on("transcript-corrected", ({
            segments,
            transcript,
            speakerCount,
        }: CorrectedTranscript) => {
            console.log(`✅ Corrected transcript ready — ${speakerCount} speaker(s) detected`);
            console.log("🎙 Corrected segments:", segments);

            setCorrectedTranscript({ segments, transcript, speakerCount });
            setIsDiarizing(false);
        });
        // ─────────────────────────────────────────────────────

        s.on("session-error", ({ message }: { message: string }) => {
            console.error("❌ Error:", message);
            setError(message);
            setIsRecording(false);
            setIsDiarizing(false); // NEW: clear on error too
            isRecordingRef.current = false;
        });

        // Tell backend to create session
        s.emit("start-session");
        console.log("📤 Emitted start-session, waiting for Gladia...");

        // ── Wait for Gladia to be fully ready ─────────────────
        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Gladia connection timeout — try again"));
            }, 10_000);

            s.once("session-started", ({ sessionId }: { sessionId: string }) => {
                clearTimeout(timeout);
                console.log("✅ Gladia ready, session:", sessionId);
                setSessionId(sessionId);
                sessionIdRef.current = sessionId;
                resolve(undefined);
            });

            s.once("session-error", ({ message }: { message: string }) => {
                clearTimeout(timeout);
                reject(new Error(message));
            });
        });

        // ── Start mic — Gladia is ready ───────────────────────
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    sampleRate: 16000,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleSize: 16,
                },
            });

            streamRef.current = stream;
            console.log("✅ Mic access granted");

            const audioContext = new AudioContext({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            await audioContext.audioWorklet.addModule("/audio-processor.js");

            const worklet = new AudioWorkletNode(audioContext, "pcm-processor");
            workletRef.current = worklet;

            const source = audioContext.createMediaStreamSource(stream);

            let chunkCount = 0;

            worklet.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
                if (!isRecordingRef.current) return;

                s.emit("audio-chunk", e.data);

                chunkCount++;
                if (chunkCount % 20 === 0) {
                    console.log(`🎙 Sent ${chunkCount} chunks`);
                }
            };

            source.connect(worklet);
            worklet.connect(audioContext.destination);

            setIsRecording(true);
            console.log("🎙 Recording started — AudioWorklet active");

        } catch (err: unknown) {
            const e = err as Error;
            const msg = e.message || "Microphone error";
            setError(
                e.name === "NotAllowedError"
                    ? "Microphone permission denied."
                    : msg
            );
            isRecordingRef.current = false;
        }
    }, []);

    const stopRecording = useCallback(() => {
        console.log("⏹ Stopping...");
        isRecordingRef.current = false;

        if (workletRef.current) {
            workletRef.current.port.onmessage = null;
            workletRef.current.disconnect();
            workletRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        }

        getSocket().emit("stop-session");
        setIsRecording(false);
        // NOTE: isDiarizing is set to true inside the "session-stopped" listener,
        // not here — because it only starts once the backend confirms it stopped.
    }, []);

    return {
        isRecording,
        sessionId,
        sessionIdRef,
        partialText,
        finalLines,
        fullTranscript,
        error,
        startRecording,
        stopRecording,
        // NEW exports:
        correctedTranscript,  // null until async diarization finishes
        isDiarizing,          // true while waiting for corrected transcript
    };
}
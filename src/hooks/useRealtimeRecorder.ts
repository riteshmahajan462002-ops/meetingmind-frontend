"use client";

import { getSocket } from "@/lib/socket";
import { CorrectedTranscript, FinalLine, PartialLine, RealtimeRecorderReturn, Segment } from "@/types/live.transcription";
import { useCallback, useEffect, useRef, useState } from "react";

export function useRealtimeRecorder(): RealtimeRecorderReturn {
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [partialText, setPartialText] = useState<PartialLine | null>(null);
    const [finalLines, setFinalLines] = useState<FinalLine[]>([]);
    const [fullTranscript, setFullTranscript] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [correctedTranscript, setCorrectedTranscript] = useState<CorrectedTranscript | null>(null);
    const [isDiarizing, setIsDiarizing] = useState<boolean>(false);

    const audioContextRef = useRef<AudioContext | null>(null);
    const workletRef = useRef<AudioWorkletNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isRecordingRef = useRef<boolean>(false);
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            const s = getSocket();
            s.off("session-started");
            s.off("transcript-partial");
            s.off("transcript-final");
            s.off("session-stopped");
            s.off("session-error");
            s.off("transcript-corrected");
        };
    }, []);

    const startRecording = useCallback(async (): Promise<void> => {
        setError(null);
        setFinalLines([]);
        setPartialText(null);
        setFullTranscript("");
        setSessionId(null);
        setCorrectedTranscript(null);
        setIsDiarizing(false);
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

        // Register socket listeners
        s.off("session-started");
        s.off("transcript-partial");
        s.off("transcript-final");
        s.off("session-stopped");
        s.off("session-error");
        s.off("transcript-corrected");

        s.on("transcript-partial", ({ text, speaker }: { text: string; speaker: string | null }) => {
            console.log("📝 Partial:", speaker, text);
            setPartialText({ text, speaker: speaker ?? null });
        });

        s.on("transcript-final", ({ text, speaker, segments }: {
            text: string;
            speaker: string | null;
            segments: Segment[];
        }) => {
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
            setFullTranscript(transcript || "");
            setIsDiarizing(true);
        });

        s.on("transcript-corrected", ({
            segments,
            transcript,
            speakerCount,
        }: CorrectedTranscript) => {
            setCorrectedTranscript({ segments, transcript, speakerCount });
            setIsDiarizing(false);
        });

        s.on("session-error", ({ message }: { message: string }) => {
            setError(message);
            setIsRecording(false);
            setIsDiarizing(false);
            isRecordingRef.current = false;
        });

        s.emit("start-session");

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Gladia connection timeout — try again"));
            }, 10_000);

            s.once("session-started", ({ sessionId }: { sessionId: string }) => {
                clearTimeout(timeout);
                setSessionId(sessionId);
                sessionIdRef.current = sessionId;
                resolve(undefined);
            });

            s.once("session-error", ({ message }: { message: string }) => {
                clearTimeout(timeout);
                reject(new Error(message));
            });
        });

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
        correctedTranscript,
        isDiarizing,
    } as RealtimeRecorderReturn;
}

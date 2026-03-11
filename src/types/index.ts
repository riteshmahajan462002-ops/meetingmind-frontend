export type Stage = "idle" | "ready" | "processing" | "done" | "error";

export interface Config {
    language: string;
    speakerDiarization: boolean;
    selectedOutputs: ("summary" | "action_items" | "pdf" | "transcript")[];
    summaryLength: "brief" | "medium" | "detailed";
}

export interface MeetingResult {
    title: string;
    date: string;
    conversationType: string;
    oneLineSummary: string;
    summary: string;
    speakers: string[];
    mainTopics: string[];
    keyPoints: string[];
    decisions: string[];
    actionItems: Array<{ description: string; assignee?: string }>;
    keyMetrics: (string | Record<string, unknown>)[];
    risks: string[];
    sentiment: string;
    toneAnalysis: string;
    insights: string[];
    nextSteps: string;
    followUpQuestions: string[];
    tags: string[];
    pdf_url: string | null;
    transcript: string;
    duration: string;
}
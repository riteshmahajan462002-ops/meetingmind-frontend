import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "MeetingMind – AI Meeting Intelligence",
  description: "Upload recorded audio for instant AI summaries or get live transcripts during meetings. Save time, capture every key point effortlessly",
  keywords: "meeting transcription, AI meeting notes, audio transcription, meeting summary",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div className="noise-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}

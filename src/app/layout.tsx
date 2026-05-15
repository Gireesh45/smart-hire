import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InterviewAI — AI-Powered Interview Platform",
  description: "Experience the future of hiring with InterviewAI — a cutting-edge AI-powered interview platform that evaluates candidates with precision, speed, and fairness.",
  keywords: "AI interview, hiring platform, technical interview, AI recruiter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

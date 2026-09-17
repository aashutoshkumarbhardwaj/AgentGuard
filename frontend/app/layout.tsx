import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentGuard — The Control Layer for Autonomous AI Agents",
  description: "AgentGuard sits between autonomous AI agents and their tools. Evaluates every action against security policies, assesses risk, requests human approval, and halts unauthorized execution.",
  keywords: ["AI agent security", "Agent governance", "Prompt injection defense", "Cedar policies", "Bedrock agents", "AI firewall"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06080D] text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}

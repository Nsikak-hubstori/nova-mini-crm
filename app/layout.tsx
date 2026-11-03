import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova Mini CRM – React 19 + Groq Agent",
  description: "Next.js 15.3 React 19 TypeScript Supabase RLS Groq Llama3 Agent",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#050505", color: "#fff", fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
    }

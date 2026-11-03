import { createClient } from "@supabase/supabase-js";

type Lead = {
  id: string;
  name: string;
  email: string;
  status: string;
  score: number | null;
  amount: number;
  fee_rate: number;
  created_at: string;
};

type AgentLog = {
  id: string;
  action: string;
  agent: string;
  approved: boolean;
  created_at: string;
};

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: leads } = (await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20)) as { data: Lead[] | null };

  const { data: logs } = (await supabase
    .from("agent_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(15)) as { data: AgentLog[] | null };

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 32, marginBottom: 4 }}>🚀 Nova Mini CRM v2</h1>
      <p style={{ color: "#aaa", marginTop: 0 }}>
        Next.js 15.3 (React 19) • TypeScript • Supabase Postgres RLS • Groq Llama3 Agent • Fee Math
      </p>

      <h2 style={{ marginTop: 24 }}>Pipeline – {leads?.length || 0} Leads</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#111", borderRadius: 8 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
            <th style={{ padding: 10 }}>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Amount</th>
            <th>Fee (15%)</th>
            <th>Groq Score</th>
          </tr>
        </thead>
        <tbody>
          {leads?.map((l) => {
            const fee = Math.round(l.amount * (l.fee_rate || 0.15) * 100) / 100;
            return (
              <tr key={l.id} style={{ borderBottom: "1px solid #222" }}>
                <td style={{ padding: 10 }}>{l.name}</td>
                <td style={{ fontSize: 12 }}>{l.email}</td>
                <td>{l.status}</td>
                <td>${l.amount}</td>
                <td>${fee}</td>
                <td>
                  {l.score ?? "-"}
                  <span style={{ background: "#22c55e", color: "#000", fontSize: 10, padding: "2px 6px", borderRadius: 10, marginLeft: 6 }}>
                    Groq
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 11, color: "#666", marginTop: 6 }}>
        Fee math: Math.round(amount * fee_rate * 100)/100 – prevents floating point error. RLS: auth.uid() = owner_id.
      </p>

      <div style={{ marginTop: 28, background: "#111", padding: 16, borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>🤖 Groq Agent – Human-in-Loop Logs</h3>
        <p style={{ fontSize: 12, color: "#7dd3fc", background: "#000", padding: 8, borderRadius: 6 }}>
          POST /api/groq-agent → Groq llama3-8b-8192 → logs to agent_logs with approved=false
        </p>
        {logs?.map((log) => (
          <div key={log.id} style={{ fontSize: 12, padding: "8px 0", borderBottom: "1px solid #222" }}>
            <b>{log.agent}</b>: {log.action}
            <br />
            <span style={{ color: log.approved ? "#22c55e" : "#f59e0b" }}>
              {log.approved ? "✅ Approved" : "⏳ Needs Approval"}
            </span>{" "}
            – {new Date(log.created_at).toLocaleString()}
          </div>
        ))}
      </div>
    </main>
  );
}

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const { leadId, lead } = await req.json();

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            'You are Nova CRM Groq Agent. Return ONLY valid JSON: {"score": 1-100, "summary": string, "stalled": boolean, "followUpDraft": string, "feeCheck": string}',
        },
        {
          role: "user",
          content: `Lead: Name ${lead.name}, Email ${lead.email}, Status ${lead.status}, Amount $${lead.amount}. Summarize risk, check fee math, draft follow-up SMS.`,
        },
      ],
    }),
  });

  const groqData = await groqRes.json();
  const content = groqData.choices?.[0]?.message?.content || "{}";

  let parsed: any = {};
  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { summary: content, score: 55, followUpDraft: "Follow up soon" };
  }

  await supabaseAdmin.from("agent_logs").insert({
    action: `Groq Llama3: Score ${parsed.score} – ${parsed.summary?.slice(0, 120)} | Draft: ${parsed.followUpDraft?.slice(0, 80)}`,
    lead_id: leadId,
    agent: "groq-agent",
    approved: false,
  });

  if (leadId && parsed.score) {
    await supabaseAdmin.from("leads").update({ score: parsed.score }).eq("id", leadId);
  }

  return Response.json({
    model: "llama3-8b-8192",
    result: parsed,
    status: "Logged – Needs Human Approval",
  });
}

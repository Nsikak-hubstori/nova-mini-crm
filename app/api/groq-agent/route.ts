import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { leadId, lead } = await req.json();

    if (!lead) {
      return Response.json({ error: "No lead provided" }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Try models in order – Groq killed Llama for free users, so we use GPT-OSS first
    const models = ["openai/gpt-oss-20b", "openai/gpt-oss-120b"];
    let content = "{}";
    let usedModel = models[0];

    for (const model of models) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
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
        if (groqData.choices?.[0]?.message?.content) {
          content = groqData.choices[0].message.content;
          usedModel = model;
          break;
        }
      } catch {}
    }

    // Clean JSON – GPT-OSS sometimes adds ```json fences
    const cleanContent = content.replace(/```json|```/g, "").trim();

    let parsed: any = {};
    try {
      parsed = JSON.parse(cleanContent);
    } catch {
      parsed = { summary: cleanContent, score: 55, stalled: false, followUpDraft: "Follow up soon", feeCheck: "Check fee manually" };
    }

    // Ensure score is a number
    if (typeof parsed.score !== "number") parsed.score = 55;

    try {
      await supabaseAdmin.from("agent_logs").insert({
        action: `Groq ${usedModel}: Score ${parsed.score} – ${parsed.summary?.slice(0, 120)} | Draft: ${parsed.followUpDraft?.slice(0, 80)}`,
        lead_id: leadId,
        agent: "groq-agent",
        approved: false,
      });
      if (leadId && parsed.score) {
        await supabaseAdmin.from("leads").update({ score: parsed.score }).eq("id", leadId);
      }
    } catch {}

    return Response.json({
      model: usedModel,
      result: parsed,
      status: "Logged – Needs Human Approval",
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Groq agent failed" }, { status: 500 });
  }
  }
